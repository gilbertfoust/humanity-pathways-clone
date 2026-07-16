import { z } from 'npm:zod@3.23.8'
import {
  corsHeaders, json, getServiceClient, getClientIp, hashIp,
  makeReferenceId, sanitizeText, checkHoneypot, rateLimit, logEvent,
  sendTransactionalEmail,
} from '../_shared/submission-helpers.ts'

const FORM_TYPE = 'sponsorship'
const DEV_RECIPIENT = 'development@humanitypathwaysglobal.com'
const TRELLO_RECIPIENT = 'gilbertfoust+dc3ehestj0cnjjib3dw7@boards.trello.com'

// Permissive schema — sponsorship form has many optional fields per step.
const schema = z.object({
  organizationName: z.string().trim().min(1).max(200),
  contactEmail: z.string().trim().email().max(255),
  language: z.string().max(10).optional().default('en'),
  data: z.record(z.any()),
  idempotencyKey: z.string().uuid().optional(),
  _hp: z.string().optional(),
})

function deepSanitize(v: unknown, depth = 0): unknown {
  if (depth > 6) return null
  if (typeof v === 'string') return sanitizeText(v, 10000)
  if (Array.isArray(v)) return v.slice(0, 100).map((x) => deepSanitize(x, depth + 1))
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(v)) {
      if (Object.keys(out).length >= 200) break
      out[k.slice(0, 100)] = deepSanitize(val, depth + 1)
    }
    return out
  }
  return v
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabase = getServiceClient()
  const ip = getClientIp(req)
  const ipHash = await hashIp(ip)
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? undefined

  let raw: Record<string, unknown>
  try { raw = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }

  if (checkHoneypot(raw)) {
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'honeypot_blocked', ipHash, userAgent })
    return json({ success: true, referenceId: makeReferenceId('S') })
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'validation_failed', ipHash, userAgent,
      details: { errors: parsed.error.flatten().fieldErrors },
    })
    return json({ error: 'Please review the form and try again.', fieldErrors: parsed.error.flatten().fieldErrors }, 400)
  }

  const rl = await rateLimit(supabase, FORM_TYPE, ipHash, 3600, 3)
  if (rl.limited) {
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'rate_limited', ipHash, userAgent })
    return json({ error: 'Too many applications from this location. Please try again later.' }, 429)
  }

  const orgName = sanitizeText(parsed.data.organizationName, 200)
  const email = sanitizeText(parsed.data.contactEmail, 255).toLowerCase()
  const language = sanitizeText(parsed.data.language, 10) || 'en'
  const cleanData = deepSanitize(parsed.data.data) as Record<string, unknown>
  const idempotencyKey = parsed.data.idempotencyKey ?? crypto.randomUUID()

  const { data: existing } = await supabase
    .from('sponsorship_applications').select('id, reference_id')
    .eq('idempotency_key', idempotencyKey).maybeSingle()
  if (existing) return json({ success: true, referenceId: existing.reference_id, duplicate: true })

  const referenceId = makeReferenceId('S')
  const { data: inserted, error: insertError } = await supabase
    .from('sponsorship_applications')
    .insert({
      reference_id: referenceId, idempotency_key: idempotencyKey,
      organization_name: orgName, email, language,
      data: { ...cleanData, organizationName: orgName, contactEmail: email, language },
      ip_hash: ipHash, user_agent: userAgent,
    }).select('id, reference_id').single()

  if (insertError || !inserted) {
    console.error('sponsorship insert failed', insertError)
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'insert_failed', ipHash, userAgent, details: { error: insertError?.message } })
    return json({ error: 'Could not save your application. Please try again.' }, 500)
  }

  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'submitted', ipHash, userAgent,
    referenceId, submissionId: inserted.id,
  })

  const templateData = { ...cleanData, organizationName: orgName, contactEmail: email, language, referenceId }
  const [devRes, trelloRes] = await Promise.all([
    sendTransactionalEmail({
      templateName: 'sponsorship-application', recipientEmail: DEV_RECIPIENT,
      idempotencyKey: `sponsorship-dev-${inserted.id}`, templateData,
    }),
    sendTransactionalEmail({
      templateName: 'sponsorship-application', recipientEmail: TRELLO_RECIPIENT,
      idempotencyKey: `sponsorship-trello-${inserted.id}`, templateData,
    }),
  ])

  if (!devRes.ok) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'email_failed', ipHash, userAgent,
      referenceId, submissionId: inserted.id, details: { dev: devRes, trello: trelloRes },
    })
    return json({ error: 'Your application was saved but the notification failed. Our team will follow up.', referenceId }, 502)
  }

  await supabase.from('sponsorship_applications').update({ email_queued: true }).eq('id', inserted.id)
  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'email_queued', ipHash, userAgent,
    referenceId, submissionId: inserted.id, details: { trelloOk: trelloRes.ok },
  })

  return json({ success: true, referenceId })
})
