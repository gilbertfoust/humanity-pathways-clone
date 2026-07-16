import { z } from 'npm:zod@3.23.8'
import {
  corsHeaders, json, getServiceClient, getClientIp, hashIp,
  makeReferenceId, sanitizeText, checkHoneypot, rateLimit, logEvent,
  sendTransactionalEmail,
} from '../_shared/submission-helpers.ts'

const FORM_TYPE = 'volunteer'
const HR_RECIPIENT = 'hr.staffing@humanitypathwaysglobal.com'
const TRELLO_RECIPIENT = 'gilbertfoust+liliiodopchnjng0z0sf@boards.trello.com'

const schema = z.object({
  fullName: z.string().trim().min(1).max(100),
  preferredName: z.string().max(100).optional().default(''),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(1).max(30),
  location: z.string().trim().min(1).max(200),
  linkedIn: z.string().max(500).optional().default(''),
  position: z.string().trim().min(1).max(100),
  startDate: z.string().max(50).optional().default(''),
  availability: z.array(z.string().max(50)).max(10).optional().default([]),
  hoursTimezone: z.string().max(200).optional().default(''),
  degree: z.string().max(100).optional().default(''),
  experienceSummary: z.string().max(5000).optional().default(''),
  competencies: z.string().max(5000).optional().default(''),
  toolsCerts: z.string().max(2000).optional().default(''),
  resumeLink: z.string().max(500).optional().default(''),
  missionStatement: z.string().max(5000).optional().default(''),
  causesRegions: z.string().max(2000).optional().default(''),
  authorizedToWork: z.string().max(20).optional().default(''),
  requireSponsorship: z.string().max(20).optional().default(''),
  consent: z.boolean(),
  idempotencyKey: z.string().uuid().optional(),
  _hp: z.string().optional(),
})

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
    return json({ success: true, referenceId: makeReferenceId('V') })
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'validation_failed', ipHash, userAgent,
      details: { errors: parsed.error.flatten().fieldErrors },
    })
    return json({ error: 'Please review the form and try again.', fieldErrors: parsed.error.flatten().fieldErrors }, 400)
  }
  if (!parsed.data.consent) {
    return json({ error: 'Consent is required.' }, 400)
  }

  const rl = await rateLimit(supabase, FORM_TYPE, ipHash, 3600, 3)
  if (rl.limited) {
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'rate_limited', ipHash, userAgent })
    return json({ error: 'Too many applications from this location. Please try again later.' }, 429)
  }

  const d = parsed.data
  // Sanitize string fields
  const clean: Record<string, unknown> = { ...d }
  for (const k of Object.keys(clean)) {
    const v = clean[k]
    if (typeof v === 'string') clean[k] = sanitizeText(v, 5000)
  }
  clean.email = String(clean.email).toLowerCase()

  const idempotencyKey = d.idempotencyKey ?? crypto.randomUUID()

  const { data: existing } = await supabase
    .from('volunteer_applications').select('id, reference_id')
    .eq('idempotency_key', idempotencyKey).maybeSingle()
  if (existing) return json({ success: true, referenceId: existing.reference_id, duplicate: true })

  const referenceId = makeReferenceId('V')
  const { data: inserted, error: insertError } = await supabase
    .from('volunteer_applications')
    .insert({
      reference_id: referenceId, idempotency_key: idempotencyKey,
      full_name: clean.fullName as string, email: clean.email as string,
      position: clean.position as string, data: clean,
      ip_hash: ipHash, user_agent: userAgent,
    }).select('id, reference_id').single()

  if (insertError || !inserted) {
    console.error('volunteer insert failed', insertError)
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'insert_failed', ipHash, userAgent, details: { error: insertError?.message } })
    return json({ error: 'Could not save your application. Please try again.' }, 500)
  }

  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'submitted', ipHash, userAgent,
    referenceId, submissionId: inserted.id,
  })

  const templateData = { ...clean, referenceId }
  const [hrRes, trelloRes] = await Promise.all([
    sendTransactionalEmail({
      templateName: 'volunteer-application', recipientEmail: HR_RECIPIENT,
      idempotencyKey: `volunteer-hr-${inserted.id}`, templateData,
    }),
    sendTransactionalEmail({
      templateName: 'volunteer-application', recipientEmail: TRELLO_RECIPIENT,
      idempotencyKey: `volunteer-trello-${inserted.id}`, templateData,
    }),
  ])

  // Require the HR email to queue; Trello is best-effort.
  if (!hrRes.ok) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'email_failed', ipHash, userAgent,
      referenceId, submissionId: inserted.id, details: { hr: hrRes, trello: trelloRes },
    })
    return json({ error: 'Your application was saved but the notification failed. Our team will follow up.', referenceId }, 502)
  }

  await supabase.from('volunteer_applications').update({ email_queued: true }).eq('id', inserted.id)
  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'email_queued', ipHash, userAgent,
    referenceId, submissionId: inserted.id, details: { trelloOk: trelloRes.ok },
  })

  return json({ success: true, referenceId })
})
