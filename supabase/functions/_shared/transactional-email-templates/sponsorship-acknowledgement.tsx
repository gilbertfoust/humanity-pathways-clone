import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Humanity Pathways Global'

interface Props { organizationName?: string; referenceId?: string }

const Email = ({ organizationName, referenceId }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your sponsorship request — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you{organizationName ? `, ${organizationName}` : ''}.</Heading>
        <Text style={lead}>
          Your sponsorship request has been received by our Development team at {SITE_NAME}.
          Requests are reviewed by our Fund Development committee, and we will follow up by
          email regarding next steps.
        </Text>
        {referenceId && <Text style={ref}>Your reference: <strong>{referenceId}</strong></Text>}
        <Hr style={hr} />
        <Text style={footer}>
          This is an automated acknowledgement. Please keep your reference number for any
          follow-up. If you did not submit this request, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `We received your sponsorship request${d.referenceId ? ` (${d.referenceId})` : ''} — ${SITE_NAME}`,
  displayName: 'Sponsorship — Applicant Acknowledgement',
  previewData: { organizationName: 'Example Org', referenceId: 'HPG-S-ABC123' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: 600 as const, margin: '0 0 12px' }
const lead = { color: '#1a1a1a', fontSize: '15px', lineHeight: '22px', margin: '0 0 12px' }
const ref = { color: '#333', fontSize: '14px', margin: '0 0 6px' }
const hr = { borderColor: '#eee', margin: '16px 0' }
const footer = { color: '#999', fontSize: '12px' }
