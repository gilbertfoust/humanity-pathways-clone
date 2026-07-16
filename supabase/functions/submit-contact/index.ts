import { z } from 'npm:zod@3.23.8'
import {
  corsHeaders,
  json,
  getServiceClient,
  getClientIp,
  hashIp,
  makeReferenceId,
  sanitizeText,
  checkHoneypot,
  rateLimit,
  logEvent,
  sendTransactionalEmail,
} from '../_shared/submission-helpers.ts'

const FORM_TYPE = 'contact'
const RECIPIENT = 'info@humanitypathwaysglobal.com'

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(5000),
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
  try {
    raw = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  if (checkHoneypot(raw)) {
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'honeypot_blocked', ipHash, userAgent })
    return json({ success: true, referenceId: makeReferenceId('C') })
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'validation_failed', ipHash, userAgent,
      details: { errors: parsed.error.flatten().fieldErrors },
    })
    return json({ error: 'Validation failed', fieldErrors: parsed.error.flatten().fieldErrors }, 400)
  }

  const rl = await rateLimit(supabase, FORM_TYPE, ipHash)
  if (rl.limited) {
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'rate_limited', ipHash, userAgent })
    return json({ error: 'Too many submissions. Please try again later.' }, 429)
  }

  const data = parsed.data
  const name = sanitizeText(data.name, 100)
  const email = sanitizeText(data.email, 255).toLowerCase()
  const subject = sanitizeText(data.subject, 200)
  const message = sanitizeText(data.message, 5000)
  const idempotencyKey = data.idempotencyKey ?? crypto.randomUUID()

  // Idempotency: return existing record if replayed
  const { data: existing } = await supabase
    .from('contact_inquiries').select('id, reference_id, email_queued')
    .eq('idempotency_key', idempotencyKey).maybeSingle()
  if (existing) {
    return json({ success: true, referenceId: existing.reference_id, duplicate: true })
  }

  const referenceId = makeReferenceId('C')
  const { data: inserted, error: insertError } = await supabase
    .from('contact_inquiries')
    .insert({
      reference_id: referenceId, idempotency_key: idempotencyKey,
      name, email, subject, message, ip_hash: ipHash, user_agent: userAgent,
    })
    .select('id, reference_id').single()

  if (insertError || !inserted) {
    console.error('contact insert failed', insertError)
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'insert_failed', ipHash, userAgent, details: { error: insertError?.message } })
    return json({ error: 'Could not save your message. Please try again.' }, 500)
  }

  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'submitted', ipHash, userAgent,
    referenceId, submissionId: inserted.id,
  })

  // Send notification to org
  const emailRes = await sendTransactionalEmail({
    templateName: 'contact-inquiry',
    recipientEmail: RECIPIENT,
    idempotencyKey: `contact-${inserted.id}`,
    templateData: { name, email, subject, message, referenceId },
  })

  if (!emailRes.ok) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'email_failed', ipHash, userAgent,
      referenceId, submissionId: inserted.id, details: { status: emailRes.status, body: emailRes.body },
    })
    return json({ error: 'Your message was saved but we could not send the notification. Our team will follow up.', referenceId }, 502)
  }

  await supabase.from('contact_inquiries').update({ email_queued: true }).eq('id', inserted.id)
  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'email_queued', ipHash, userAgent,
    referenceId, submissionId: inserted.id,
  })

  return json({ success: true, referenceId })
})
