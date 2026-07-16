import { z } from 'npm:zod@3.23.8'
import {
  corsHeaders, json, getServiceClient, getClientIp, hashIp,
  makeReferenceId, sanitizeText, checkHoneypot, rateLimit, logEvent,
  sendTransactionalEmail,
} from '../_shared/submission-helpers.ts'

const FORM_TYPE = 'newsletter'
const RECIPIENT = 'info@humanitypathwaysglobal.com'

const schema = z.object({
  email: z.string().trim().email().max(255),
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
    return json({ success: true, referenceId: makeReferenceId('N') })
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'validation_failed', ipHash, userAgent,
      details: { errors: parsed.error.flatten().fieldErrors },
    })
    return json({ error: 'Please enter a valid email.', fieldErrors: parsed.error.flatten().fieldErrors }, 400)
  }

  const rl = await rateLimit(supabase, FORM_TYPE, ipHash, 900, 10)
  if (rl.limited) {
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'rate_limited', ipHash, userAgent })
    return json({ error: 'Too many attempts. Please try again later.' }, 429)
  }

  const email = sanitizeText(parsed.data.email, 255).toLowerCase()
  const idempotencyKey = parsed.data.idempotencyKey ?? crypto.randomUUID()

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('newsletter_subscriptions').select('id, reference_id, unsubscribed_at')
    .eq('email', email).maybeSingle()

  if (existing && !existing.unsubscribed_at) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'duplicate', ipHash, userAgent,
      referenceId: existing.reference_id, submissionId: existing.id,
    })
    return json({ success: true, referenceId: existing.reference_id, alreadySubscribed: true })
  }

  const referenceId = existing?.reference_id || makeReferenceId('N')
  let submissionId: string
  if (existing) {
    const { data: upd, error } = await supabase
      .from('newsletter_subscriptions')
      .update({ unsubscribed_at: null, idempotency_key: idempotencyKey, ip_hash: ipHash, user_agent: userAgent })
      .eq('id', existing.id).select('id').single()
    if (error || !upd) return json({ error: 'Could not save your subscription. Please try again.' }, 500)
    submissionId = upd.id
  } else {
    const { data: ins, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        reference_id: referenceId, idempotency_key: idempotencyKey,
        email, ip_hash: ipHash, user_agent: userAgent,
      }).select('id').single()
    if (error || !ins) {
      console.error('newsletter insert failed', error)
      await logEvent(supabase, { formType: FORM_TYPE, eventType: 'insert_failed', ipHash, userAgent, details: { error: error?.message } })
      return json({ error: 'Could not save your subscription. Please try again.' }, 500)
    }
    submissionId = ins.id
  }

  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'submitted', ipHash, userAgent,
    referenceId, submissionId,
  })

  const emailRes = await sendTransactionalEmail({
    templateName: 'newsletter-subscription',
    recipientEmail: RECIPIENT,
    idempotencyKey: `newsletter-${submissionId}`,
    templateData: { email, referenceId, subscribedAt: new Date().toISOString() },
  })

  if (!emailRes.ok) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'email_failed', ipHash, userAgent,
      referenceId, submissionId, details: { status: emailRes.status, body: emailRes.body },
    })
    return json({ error: 'You were added but notification failed. We will follow up.', referenceId }, 502)
  }

  await supabase.from('newsletter_subscriptions').update({ email_queued: true }).eq('id', submissionId)
  await logEvent(supabase, {
    formType: FORM_TYPE, eventType: 'email_queued', ipHash, userAgent,
    referenceId, submissionId,
  })

  return json({ success: true, referenceId })
})
