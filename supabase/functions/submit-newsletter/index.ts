import { z } from 'npm:zod@3.23.8'
import {
  corsHeaders, json, getServiceClient, getClientIp, hashIp,
  makeReferenceId, sanitizeText, checkHoneypot, rateLimit, logEvent,
  queueEmailWithLog,
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

  const { data: existing } = await supabase
    .from('newsletter_subscriptions')
    .select('id, reference_id, unsubscribed_at, notification_queued, ack_queued')
    .eq('email', email).maybeSingle()

  let submissionId: string
  let referenceId: string
  let isDuplicate = false

  if (existing && !existing.unsubscribed_at) {
    submissionId = existing.id
    referenceId = existing.reference_id
    isDuplicate = true
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'duplicate_retry', ipHash, userAgent,
      referenceId, submissionId,
      details: { notification_queued: existing.notification_queued, ack_queued: existing.ack_queued },
    })
    if (existing.notification_queued && existing.ack_queued) {
      return json({ success: true, referenceId, alreadySubscribed: true, duplicate: true })
    }
  } else if (existing) {
    referenceId = existing.reference_id
    const { data: upd, error } = await supabase
      .from('newsletter_subscriptions')
      .update({
        unsubscribed_at: null, idempotency_key: idempotencyKey,
        ip_hash: ipHash, user_agent: userAgent,
        notification_queued: false, ack_queued: false,
      })
      .eq('id', existing.id).select('id').single()
    if (error || !upd) return json({ error: 'Could not save your subscription. Please try again.' }, 500)
    submissionId = upd.id
  } else {
    referenceId = makeReferenceId('N')
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
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'submitted', ipHash, userAgent,
      referenceId, submissionId,
    })
  }

  const subscribedAt = new Date().toISOString()
  const [notif, ack] = await Promise.all([
    queueEmailWithLog(supabase, {
      formType: FORM_TYPE, role: 'notification',
      templateName: 'newsletter-subscription', recipientEmail: RECIPIENT,
      idempotencyKey: `newsletter-notif-${submissionId}`,
      templateData: { email, referenceId, subscribedAt },
      referenceId, submissionId, ipHash, userAgent,
    }),
    queueEmailWithLog(supabase, {
      formType: FORM_TYPE, role: 'acknowledgement',
      templateName: 'newsletter-acknowledgement', recipientEmail: email,
      idempotencyKey: `newsletter-ack-${submissionId}`,
      templateData: { email, referenceId },
      referenceId, submissionId, ipHash, userAgent,
    }),
  ])

  const patch: Record<string, boolean> = {}
  if (notif.ok) patch.notification_queued = true
  if (ack.ok) patch.ack_queued = true
  if (Object.keys(patch).length > 0) {
    await supabase.from('newsletter_subscriptions').update(patch).eq('id', submissionId)
  }

  if (!notif.ok || !ack.ok) {
    return json({
      error: !notif.ok
        ? 'You were added but the notification email could not be queued. We will follow up.'
        : 'You were added but the confirmation email could not be queued. Please save your reference number.',
      referenceId,
      queued: { notification: notif.ok, acknowledgement: ack.ok },
    }, 502)
  }

  return json({
    success: true, referenceId, duplicate: isDuplicate,
    queued: { notification: true, acknowledgement: true },
  })
})
