import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Humanity Pathways Global"

interface Props {
  orgName?: string
  website?: string
  repName?: string
  repTitle?: string
  email?: string
  phone?: string
  location?: string
  ein?: string
  legalStatus?: string
  countryRegistration?: string
  countryOperation?: string
  model?: string
  missionFocus?: string
  numProjects?: string
  totalAmount?: string
  overheadPerProject?: string
  donationPerProject?: string
  timelineStart?: string
  timelineEnd?: string
  projectExamples?: string
  eventDetails?: string
  inkindDetails?: string
  communityImpact?: string
  brandingMessage?: string
  otherFunding?: string
  proposalLink?: string
  budgetLink?: string
  deckLink?: string
  contactMethod?: string
  timezone?: string
}

const SponsorshipApplicationEmail = (props: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Sponsorship Application: {props.orgName || 'New Organization'} — {props.model || 'General'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{SITE_NAME}</Heading>
          <Text style={subtitle}>Sponsorship Application Received</Text>
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Organization</Heading>
          <Text style={field}><strong>Organization:</strong> {props.orgName || '—'}</Text>
          {props.website && <Text style={field}><strong>Website:</strong> {props.website}</Text>}
          <Text style={field}><strong>Representative:</strong> {props.repName || '—'} {props.repTitle ? `(${props.repTitle})` : ''}</Text>
          <Text style={field}><strong>Email:</strong> {props.email || '—'}</Text>
          {props.phone && <Text style={field}><strong>Phone:</strong> {props.phone}</Text>}
          {props.location && <Text style={field}><strong>Location:</strong> {props.location}</Text>}
          {props.ein && <Text style={field}><strong>EIN:</strong> {props.ein}</Text>}
          {props.legalStatus && <Text style={field}><strong>Legal Status:</strong> {props.legalStatus}</Text>}
          {props.countryRegistration && <Text style={field}><strong>Registration:</strong> {props.countryRegistration}</Text>}
          {props.countryOperation && <Text style={field}><strong>Operation:</strong> {props.countryOperation}</Text>}
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Sponsorship Request</Heading>
          <Text style={field}><strong>Model:</strong> {props.model || '—'}</Text>
          <Text style={field}><strong>Mission Focus:</strong> {props.missionFocus || '—'}</Text>
          {props.numProjects && <Text style={field}><strong># Projects:</strong> {props.numProjects}</Text>}
          {props.totalAmount && <Text style={field}><strong>Total Requested:</strong> ${props.totalAmount}</Text>}
          {props.overheadPerProject && <Text style={field}><strong>Overhead/Project:</strong> ${props.overheadPerProject}</Text>}
          {props.donationPerProject && <Text style={field}><strong>Donation/Project:</strong> ${props.donationPerProject}</Text>}
          {(props.timelineStart || props.timelineEnd) && <Text style={field}><strong>Timeline:</strong> {props.timelineStart || '?'} → {props.timelineEnd || '?'}</Text>}
          {props.projectExamples && <Text style={field}><strong>Project Examples:</strong> {props.projectExamples}</Text>}
          {props.eventDetails && <Text style={field}><strong>Event Details:</strong> {props.eventDetails}</Text>}
          {props.inkindDetails && <Text style={field}><strong>In-kind Details:</strong> {props.inkindDetails}</Text>}
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Impact & Branding</Heading>
          <Text style={field}><strong>Community Impact:</strong> {props.communityImpact || '—'}</Text>
          <Text style={field}><strong>Branding Message:</strong> {props.brandingMessage || '—'}</Text>
          {props.otherFunding && <Text style={field}><strong>Other Funding:</strong> {props.otherFunding}</Text>}
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Links & Preferences</Heading>
          {props.proposalLink && <Text style={field}><strong>Proposal:</strong> {props.proposalLink}</Text>}
          {props.budgetLink && <Text style={field}><strong>Budget:</strong> {props.budgetLink}</Text>}
          {props.deckLink && <Text style={field}><strong>Deck:</strong> {props.deckLink}</Text>}
          {props.contactMethod && <Text style={field}><strong>Preferred Contact:</strong> {props.contactMethod}</Text>}
          {props.timezone && <Text style={field}><strong>Timezone:</strong> {props.timezone}</Text>}
        </Section>

        <Hr style={divider} />
        <Text style={footer}>This is an automated notification from {SITE_NAME}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SponsorshipApplicationEmail,
  subject: (data: Record<string, any>) =>
    `Sponsorship Application: ${data.orgName || 'New Organization'} — ${data.model || 'General'}`,
  displayName: 'Sponsorship application notification',
  previewData: {
    orgName: 'Example Foundation',
    repName: 'John Smith',
    repTitle: 'Executive Director',
    email: 'john@example.org',
    model: 'Fiscal Sponsorship (Type C)',
    missionFocus: 'Education and youth empowerment in East Africa',
    communityImpact: 'Serves 500+ students across 3 schools annually.',
    brandingMessage: 'Empowering the next generation through education.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Lato', Arial, sans-serif" }
const container = { padding: '20px 30px', maxWidth: '600px', margin: '0 auto' }
const header = { textAlign: 'center' as const, padding: '10px 0' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#2d3e50', margin: '0 0 4px', fontFamily: "'Cormorant Garamond', Georgia, serif" }
const subtitle = { fontSize: '14px', color: '#c9a227', margin: '0', fontWeight: '600' }
const h2 = { fontSize: '16px', fontWeight: 'bold', color: '#2d3e50', margin: '0 0 10px' }
const section = { padding: '8px 0' }
const field = { fontSize: '13px', color: '#333', lineHeight: '1.6', margin: '0 0 4px' }
const divider = { borderColor: '#e5e7eb', margin: '12px 0' }
const footer = { fontSize: '11px', color: '#999', margin: '20px 0 0', textAlign: 'center' as const }
