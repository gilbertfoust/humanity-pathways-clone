// Shared helpers for public form submission edge functions.
// Provides: CORS, IP hashing, rate limiting, honeypot check, ref-id generator,
// and a wrapper to trigger the transactional email pipeline.
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export function getServiceClient(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return createClient(url, key, { auth: { persistSession: false } })
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || ''
  const first = xff.split(',')[0]?.trim()
  return first || req.headers.get('x-real-ip') || 'unknown'
}

export async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'salt'
  const data = new TextEncoder().encode(`${salt}:${ip}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

// Simple, generic prefix-based reference IDs, e.g. HPG-C-K3F9AB
export function makeReferenceId(prefix: string): string {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const rand = Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, '0'))
    .join('')
    .toUpperCase()
    .slice(0, 6)
  return `HPG-${prefix}-${rand}`
}

export function sanitizeText(s: unknown, max = 5000): string {
  if (typeof s !== 'string') return ''
  // Strip control chars + trim; keep newlines/tabs
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)
}

export function checkHoneypot(body: Record<string, unknown>): boolean {
  // Consider _hp, website, honeypot fields; any non-empty means bot
  const fields = ['_hp', 'website', 'honeypot', 'company_website']
  for (const f of fields) {
    const v = body[f]
    if (typeof v === 'string' && v.trim().length > 0) return true
  }
  return false
}

export async function rateLimit(
  supabase: SupabaseClient,
  formType: string,
  ipHash: string,
  windowSeconds = 900,
  maxAttempts = 5
): Promise<{ limited: boolean; count: number }> {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString()
  const { count, error } = await supabase
    .from('submission_events')
    .select('id', { count: 'exact', head: true })
    .eq('form_type', formType)
    .eq('ip_hash', ipHash)
    .eq('event_type', 'submitted')
    .gte('created_at', since)
  if (error) {
    console.error('rate-limit query failed', error)
    return { limited: false, count: 0 }
  }
  return { limited: (count ?? 0) >= maxAttempts, count: count ?? 0 }
}

export async function logEvent(
  supabase: SupabaseClient,
  params: {
    formType: string
    eventType: string
    ipHash?: string
    userAgent?: string
    referenceId?: string
    submissionId?: string
    details?: Record<string, unknown>
  }
): Promise<void> {
  await supabase.from('submission_events').insert({
    form_type: params.formType,
    event_type: params.eventType,
    ip_hash: params.ipHash,
    user_agent: params.userAgent,
    reference_id: params.referenceId,
    submission_id: params.submissionId,
    details: params.details ?? null,
  })
}

// Directly invoke send-transactional-email using service role — returns the
// parsed JSON response so callers know if the email was queued.
export async function sendTransactionalEmail(params: {
  templateName: string
  recipientEmail: string
  idempotencyKey: string
  templateData: Record<string, unknown>
}): Promise<{ ok: boolean; status: number; body: unknown }> {
  const url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-transactional-email`
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify(params),
    })
    let body: unknown = null
    try {
      body = await res.json()
    } catch {
      body = null
    }
    return { ok: res.ok, status: res.status, body }
  } catch (err) {
    console.error('sendTransactionalEmail fetch failed', err)
    return { ok: false, status: 0, body: { error: String(err) } }
  }
}

/**
 * Queue an email and log the result as its own audit event, using a stable
 * per-role idempotency key so retries are safe. Never claims delivery — only
 * that the email was received and queued (or that the queue attempt failed).
 */
export async function queueEmailWithLog(
  supabase: SupabaseClient,
  args: {
    formType: string
    role: string // e.g. 'notification' | 'acknowledgement' | 'trello'
    templateName: string
    recipientEmail: string
    idempotencyKey: string
    templateData: Record<string, unknown>
    referenceId?: string
    submissionId?: string
    ipHash?: string
    userAgent?: string
  }
): Promise<{ ok: boolean; status: number }> {
  const res = await sendTransactionalEmail({
    templateName: args.templateName,
    recipientEmail: args.recipientEmail,
    idempotencyKey: args.idempotencyKey,
    templateData: args.templateData,
  })
  await logEvent(supabase, {
    formType: args.formType,
    eventType: res.ok ? 'email_queued' : 'email_failed',
    ipHash: args.ipHash,
    userAgent: args.userAgent,
    referenceId: args.referenceId,
    submissionId: args.submissionId,
    details: {
      role: args.role,
      template: args.templateName,
      recipient: args.recipientEmail,
      status: res.status,
      ...(res.ok ? {} : { body: res.body }),
    },
  })
  return { ok: res.ok, status: res.status }
}
