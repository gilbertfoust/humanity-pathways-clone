import { z } from 'npm:zod@3.23.8'
import {
  corsHeaders, json, getServiceClient, getClientIp, hashIp,
  makeReferenceId, sanitizeText, checkHoneypot, rateLimit, logEvent,
  queueEmailWithLog,
} from '../_shared/submission-helpers.ts'

const FORM_TYPE = 'board'
// Board applications route to the Recruitment/HR staffing inbox and the
// Recruitment Trello board — the same governance-facing addresses already
// configured in the project — with a copy to Development as a governance CC.
const HR_RECIPIENT = 'hr.staffing@humanitypathwaysglobal.com'
const GOVERNANCE_CC = 'development@humanitypathwaysglobal.com'
const TRELLO_RECIPIENT = 'gilbertfoust+liliiodopchnjng0z0sf@boards.trello.com'

const schema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(1).max(30),
  location: z.string().trim().min(1).max(200),
  linkedIn: z.string().max(500).optional().default(''),
  currentAffiliation: z.string().max(200).optional().default(''),
  seatInterest: z.string().trim().min(1).max(100),
  committeeInterest: z.string().max(500).optional().default(''),
  timeCommitment: z.string().max(200).optional().default(''),
  professionalBackground: z.string().trim().min(20).max(5000),
  boardExperience: z.string().max(5000).optional().default(''),
  governanceExpertise: z.string().max(5000).optional().default(''),
  motivation: z.string().trim().min(20).max(5000),
  conflictsDisclosure: z.string().max(5000).optional().default(''),
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
    return json({ success: true, referenceId: makeReferenceId('B') })
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'validation_failed', ipHash, userAgent,
      details: { errors: parsed.error.flatten().fieldErrors },
    })
    return json({ error: 'Please review the form and try again.', fieldErrors: parsed.error.flatten().fieldErrors }, 400)
  }
  if (!parsed.data.consent) return json({ error: 'Consent is required.' }, 400)

  const rl = await rateLimit(supabase, FORM_TYPE, ipHash, 3600, 3)
  if (rl.limited) {
    await logEvent(supabase, { formType: FORM_TYPE, eventType: 'rate_limited', ipHash, userAgent })
    return json({ error: 'Too many applications from this location. Please try again later.' }, 429)
  }

  const d = parsed.data
  const clean: Record<string, unknown> = { ...d }
  for (const k of Object.keys(clean)) {
    const v = clean[k]
    if (typeof v === 'string') clean[k] = sanitizeText(v, 5000)
  }
  clean.email = String(clean.email).toLowerCase()

  const idempotencyKey = d.idempotencyKey ?? crypto.randomUUID()

  const { data: existing } = await supabase
    .from('board_applications')
    .select('id, reference_id, notification_queued, ack_queued')
    .eq('idempotency_key', idempotencyKey).maybeSingle()

  let submissionId: string
  let referenceId: string
  const isDuplicate = !!existing

  if (existing) {
    submissionId = existing.id
    referenceId = existing.reference_id
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'duplicate_retry', ipHash, userAgent,
      referenceId, submissionId,
      details: { notification_queued: existing.notification_queued, ack_queued: existing.ack_queued },
    })
    if (existing.notification_queued && existing.ack_queued) {
      return json({ success: true, referenceId, duplicate: true })
    }
  } else {
    referenceId = makeReferenceId('B')
    const { data: inserted, error: insertError } = await supabase
      .from('board_applications')
      .insert({
        reference_id: referenceId, idempotency_key: idempotencyKey,
        full_name: clean.fullName as string,
        email: clean.email as string,
        seat_interest: clean.seatInterest as string,
        data: clean, ip_hash: ipHash, user_agent: userAgent,
      }).select('id, reference_id').single()
    if (insertError || !inserted) {
      console.error('board insert failed', insertError)
      await logEvent(supabase, { formType: FORM_TYPE, eventType: 'insert_failed', ipHash, userAgent, details: { error: insertError?.message } })
      return json({ error: 'Could not save your application. Please try again.' }, 500)
    }
    submissionId = inserted.id
    await logEvent(supabase, {
      formType: FORM_TYPE, eventType: 'submitted', ipHash, userAgent,
      referenceId, submissionId,
    })
  }

  const templateData = { ...clean, referenceId }
  const [hr, ack, gov, trello] = await Promise.all([
    queueEmailWithLog(supabase, {
      formType: FORM_TYPE, role: 'notification',
      templateName: 'board-application', recipientEmail: HR_RECIPIENT,
      idempotencyKey: `board-hr-${submissionId}`,
      templateData, referenceId, submissionId, ipHash, userAgent,
    }),
    queueEmailWithLog(supabase, {
      formType: FORM_TYPE, role: 'acknowledgement',
      templateName: 'board-acknowledgement', recipientEmail: clean.email as string,
      idempotencyKey: `board-ack-${submissionId}`,
      templateData: {
        fullName: clean.fullName, seatInterest: clean.seatInterest, referenceId,
      },
      referenceId, submissionId, ipHash, userAgent,
    }),
    queueEmailWithLog(supabase, {
      formType: FORM_TYPE, role: 'governance-cc',
      templateName: 'board-application', recipientEmail: GOVERNANCE_CC,
      idempotencyKey: `board-gov-${submissionId}`,
      templateData, referenceId, submissionId, ipHash, userAgent,
    }),
    queueEmailWithLog(supabase, {
      formType: FORM_TYPE, role: 'trello',
      templateName: 'board-application', recipientEmail: TRELLO_RECIPIENT,
      idempotencyKey: `board-trello-${submissionId}`,
      templateData, referenceId, submissionId, ipHash, userAgent,
    }),
  ])

  const patch: Record<string, boolean> = {}
  if (hr.ok) patch.notification_queued = true
  if (ack.ok) patch.ack_queued = true
  if (Object.keys(patch).length > 0) {
    await supabase.from('board_applications').update(patch).eq('id', submissionId)
  }

  if (!hr.ok || !ack.ok) {
    return json({
      error: !hr.ok
        ? 'Your application was saved but the internal notification could not be queued. Our Nominations Committee will follow up.'
        : 'Your application was saved but the acknowledgement email could not be queued. Please save your reference number.',
      referenceId,
      queued: { notification: hr.ok, acknowledgement: ack.ok, governance: gov.ok, trello: trello.ok },
    }, 502)
  }

  return json({
    success: true, referenceId, duplicate: isDuplicate,
    queued: { notification: true, acknowledgement: true, governance: gov.ok, trello: trello.ok },
  })
})
