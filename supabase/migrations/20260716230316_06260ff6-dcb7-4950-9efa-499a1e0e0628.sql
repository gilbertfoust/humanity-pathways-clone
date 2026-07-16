
-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- contact_inquiries
-- =========================
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  email_queued BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_inquiries TO service_role;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to contact_inquiries"
  ON public.contact_inquiries FOR SELECT USING (false);
CREATE TRIGGER contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- newsletter_subscriptions
-- =========================
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  ip_hash TEXT,
  user_agent TEXT,
  unsubscribed_at TIMESTAMPTZ,
  email_queued BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.newsletter_subscriptions TO service_role;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to newsletter_subscriptions"
  ON public.newsletter_subscriptions FOR SELECT USING (false);
CREATE TRIGGER newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- volunteer_applications
-- =========================
CREATE TABLE public.volunteer_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT,
  data JSONB NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  email_queued BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.volunteer_applications TO service_role;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to volunteer_applications"
  ON public.volunteer_applications FOR SELECT USING (false);
CREATE TRIGGER volunteer_applications_updated_at
  BEFORE UPDATE ON public.volunteer_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- sponsorship_applications
-- =========================
CREATE TABLE public.sponsorship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT UNIQUE,
  organization_name TEXT,
  email TEXT NOT NULL,
  language TEXT,
  data JSONB NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  email_queued BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.sponsorship_applications TO service_role;
ALTER TABLE public.sponsorship_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to sponsorship_applications"
  ON public.sponsorship_applications FOR SELECT USING (false);
CREATE TRIGGER sponsorship_applications_updated_at
  BEFORE UPDATE ON public.sponsorship_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- submission_events (audit log)
-- =========================
CREATE TABLE public.submission_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL,
  event_type TEXT NOT NULL,
  reference_id TEXT,
  submission_id UUID,
  ip_hash TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.submission_events TO service_role;
ALTER TABLE public.submission_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to submission_events"
  ON public.submission_events FOR SELECT USING (false);
CREATE INDEX submission_events_ratelimit_idx
  ON public.submission_events (form_type, ip_hash, created_at DESC);
CREATE INDEX submission_events_form_idx
  ON public.submission_events (form_type, created_at DESC);
