

# Plan: Connect Supabase and Route Applications via Email

## Summary

Connect the project to Supabase using the provided credentials, then set up email sending so volunteer applications go to **hr.staffing@humanitypathwaysglobal.com** and the **Trello board email**. The sponsorship application also currently only saves to localStorage — we'll fix that too.

## Steps

### 1. Connect Supabase to the project
- Set up the Supabase client integration using the provided URL and anon key
- Create `src/integrations/supabase/client.ts` with the Supabase client
- Store the URL and anon key as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the project

### 2. Set up email domain
- Check email domain status and configure if needed (required for sending emails)
- Set up email infrastructure (queues, tables, cron job)

### 3. Create volunteer application email template
- Create a React Email template that formats all application data into a readable email
- Sections: Personal Info, Position & Logistics, Experience, Mission Alignment

### 4. Wire up volunteer application submission
- Update `handleSubmit` in `VolunteerApplication.tsx` to invoke `send-transactional-email` twice:
  - **To HR**: hr.staffing@humanitypathwaysglobal.com
  - **To Trello**: gilbertfoust+liliiodopchnjng0z0sf@boards.trello.com (subject line formatted as "Volunteer App: [Name] — [Position]" for meaningful Trello card titles)
- Keep localStorage backup

### 5. Wire up sponsorship application submission
- Same pattern: send formatted email to HR and Trello on sponsorship form submit
- Subject: "Sponsorship App: [Org Name] — [Model]"

## Technical Notes
- Uses Lovable's built-in email infrastructure (no third-party service needed)
- Each email send uses an `idempotencyKey` to prevent duplicates on retry
- Templates are React Email components with HPG branding

