

# Plan: Enable Cloud, Set Up Email Routing for All Three Forms, and Wire Stripe Payments

## Summary

Enable Lovable Cloud, configure email sending, and wire up three flows:

1. **Volunteer applications** → email to HR + Trello Recruitment board
2. **Sponsorship applications** → email to Development + Trello ES-FSA board
3. **Onboarding fee payments** → Stripe checkout + receipt email to Finance

## Steps

### 1. Enable Lovable Cloud
Required for Edge Functions, email infrastructure, and Stripe payments.

### 2. Set up email domain
Configure the sender domain (humanitypathwaysglobal.com) so emails come from your brand. You will need to add DNS records at your domain provider — I will guide you through this.

### 3. Set up email infrastructure
Create the database tables, queues, and cron jobs needed for reliable email delivery.

### 4. Create email templates

- **Volunteer application received** — formatted summary of all form fields (personal info, position, experience, alignment). Sent to:
  - hr.staffing@humanitypathwaysglobal.com (subject: "Volunteer Application: [Name] — [Position]")
  - Trello Recruitment: gilbertfoust+liliiodopchnjng0z0sf@boards.trello.com (same subject for card title)

- **Sponsorship application received** — formatted summary of all form fields (organization, request, impact, links). Sent to:
  - development@humanitypathwaysglobal.com (subject: "Sponsorship Application: [Org Name] — [Model]")
  - Trello ES-FSA: gilbertfoust+dc3ehestj0cnjjib3dw7@boards.trello.com (same subject for card title)

- **Onboarding fee payment receipt** — payment confirmation with org name, jurisdiction, tier, amount paid, and date. Sent to:
  - finance@humanitypathwaysglobal.com (subject: "Onboarding Fee Payment: [Org Name] — $[Amount]")

### 5. Wire up Stripe payments on onboarding fee page
- Enable Lovable's built-in Stripe payments integration
- Replace the placeholder Stripe Elements area with a real checkout flow
- On successful payment, trigger the receipt email to finance@humanitypathwaysglobal.com
- The payment amount is dynamic ($150 or $200) based on jurisdiction selection

### 6. Update form submission handlers
- **VolunteerApplication.tsx**: After localStorage save, invoke `send-transactional-email` twice (HR + Trello)
- **SponsorshipApplication.tsx**: After localStorage save, invoke `send-transactional-email` twice (Development + Trello)
- **HpgOnboardingFee.tsx**: After Stripe payment succeeds, invoke `send-transactional-email` to Finance

### 7. Create unsubscribe page
Required by the email infrastructure for compliance. Will be a simple branded page.

## Email Routing Summary

| Form | Recipients | Subject Format |
|------|-----------|----------------|
| Volunteer | hr.staffing@ + Trello Recruitment | Volunteer Application: [Name] — [Position] |
| Sponsorship | development@ + Trello ES-FSA | Sponsorship Application: [Org] — [Model] |
| Onboarding Fee | finance@ | Onboarding Fee Payment: [Org] — $[Amount] |

## What You Will Need To Do
- Approve enabling Lovable Cloud (required for everything)
- Add DNS records for your email domain (I will provide exact records)
- The onboarding fee page will have real Stripe checkout — payments go through Stripe to your relay account as they do now

