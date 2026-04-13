import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Humanity Pathways Global"

interface Props {
  orgName?: string
  contact?: string
  email?: string
  phone?: string
  country?: string
  state?: string
  tier?: string
  amount?: string
  date?: string
}

const OnboardingFeeReceiptEmail = (props: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Onboarding Fee Payment: {props.orgName || 'Organization'} — ${props.amount || '0'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{SITE_NAME}</Heading>
          <Text style={subtitle}>Onboarding Fee Payment Received</Text>
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Organization</Heading>
          <Text style={field}><strong>Organization:</strong> {props.orgName || '—'}</Text>
          <Text style={field}><strong>Primary Contact:</strong> {props.contact || '—'}</Text>
          <Text style={field}><strong>Email:</strong> {props.email || '—'}</Text>
          {props.phone && <Text style={field}><strong>Phone:</strong> {props.phone}</Text>}
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Payment Details</Heading>
          <Text style={field}><strong>Country:</strong> {props.country || '—'}</Text>
          {props.state && <Text style={field}><strong>State/Province:</strong> {props.state}</Text>}
          <Text style={field}><strong>Filing Tier:</strong> {props.tier || '—'}</Text>
          <Text style={amountStyle}><strong>Amount Paid:</strong> ${props.amount || '0.00'}</Text>
          <Text style={field}><strong>Date:</strong> {props.date || '—'}</Text>
        </Section>

        <Hr style={divider} />
        <Text style={footer}>This is an automated receipt from {SITE_NAME}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OnboardingFeeReceiptEmail,
  subject: (data: Record<string, any>) =>
    `Onboarding Fee Payment: ${data.orgName || 'Organization'} — $${data.amount || '0'}`,
  displayName: 'Onboarding fee payment receipt',
  previewData: {
    orgName: 'Megabridge Foundation',
    contact: 'Jane Doe',
    email: 'jane@megabridge.org',
    country: 'United States',
    state: 'California',
    tier: 'Tier B (higher filing complexity)',
    amount: '200.00',
    date: 'April 13, 2026',
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
const amountStyle = { fontSize: '15px', color: '#2d3e50', lineHeight: '1.6', margin: '0 0 4px', fontWeight: '700' }
const divider = { borderColor: '#e5e7eb', margin: '12px 0' }
const footer = { fontSize: '11px', color: '#999', margin: '20px 0 0', textAlign: 'center' as const }
