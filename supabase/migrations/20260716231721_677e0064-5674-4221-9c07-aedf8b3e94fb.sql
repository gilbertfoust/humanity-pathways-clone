
-- Board applications table
CREATE TABLE public.board_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  seat_interest TEXT,
  data JSONB NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  notification_queued BOOLEAN NOT NULL DEFAULT false,
  ack_queued BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.board_applications TO service_role;
ALTER TABLE public.board_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access to board_applications"
  ON public.board_applications FOR SELECT USING (false);
CREATE TRIGGER board_applications_updated_at
  BEFORE UPDATE ON public.board_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Track applicant acknowledgement queueing separately on all existing form tables
ALTER TABLE public.contact_inquiries
  ADD COLUMN IF NOT EXISTS notification_queued BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ack_queued BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.newsletter_subscriptions
  ADD COLUMN IF NOT EXISTS notification_queued BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ack_queued BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.volunteer_applications
  ADD COLUMN IF NOT EXISTS notification_queued BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ack_queued BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.sponsorship_applications
  ADD COLUMN IF NOT EXISTS notification_queued BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ack_queued BOOLEAN NOT NULL DEFAULT false;
