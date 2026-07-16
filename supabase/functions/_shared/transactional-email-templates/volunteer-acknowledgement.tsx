import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Humanity Pathways Global'

interface Props { fullName?: string; position?: string; referenceId?: string }

const Email = ({ fullName, position, referenceId }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your volunteer application — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you{fullName ? `, ${fullName}` : ''}.</Heading>
        <Text style={lead}>
          Your volunteer application {position ? <>for <strong>{position}</strong> </> : null}
          has been received by our Recruitment team at {SITE_NAME}. We review each application
          carefully and will follow up by email if we would like to move forward.
        </Text>
        {referenceId && <Text style={ref}>Your reference: <strong>{referenceId}</strong></Text>}
        <Hr style={hr} />
        <Text style={footer}>
          This is an automated acknowledgement. Please keep your reference number for any
          follow-up. If you did not submit this application, you can ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `We received your volunteer application${d.referenceId ? ` (${d.referenceId})` : ''} — ${SITE_NAME}`,
  displayName: 'Volunteer — Applicant Acknowledgement',
  previewData: { fullName: 'Jane Doe', position: 'Project Manager', referenceId: 'HPG-V-ABC123' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: 600 as const, margin: '0 0 12px' }
const lead = { color: '#1a1a1a', fontSize: '15px', lineHeight: '22px', margin: '0 0 12px' }
const ref = { color: '#333', fontSize: '14px', margin: '0 0 6px' }
const hr = { borderColor: '#eee', margin: '16px 0' }
const footer = { color: '#999', fontSize: '12px' }
