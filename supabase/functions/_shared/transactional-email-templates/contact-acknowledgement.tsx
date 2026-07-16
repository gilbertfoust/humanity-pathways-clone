import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Humanity Pathways Global'

interface Props {
  name?: string
  subject?: string
  message?: string
  referenceId?: string
}

const Email = ({ name, subject, message, referenceId }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your message — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you{ name ? `, ${name}` : '' }.</Heading>
        <Text style={lead}>
          Your message has been received by {SITE_NAME}. A member of our team will review it
          and reply as soon as possible.
        </Text>
        {referenceId && <Text style={ref}>Your reference: <strong>{referenceId}</strong></Text>}
        <Hr style={hr} />
        <Section>
          {subject && (<>
            <Text style={label}>Subject</Text>
            <Text style={value}>{subject}</Text>
          </>)}
          {message && (<>
            <Text style={label}>Your message</Text>
            <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message}</Text>
          </>)}
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          If you did not submit this message, you can ignore this email. This is an automated
          acknowledgement from {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `We received your message${d.referenceId ? ` (${d.referenceId})` : ''} — ${SITE_NAME}`,
  displayName: 'Contact — Applicant Acknowledgement',
  previewData: {
    name: 'Jane Doe', subject: 'Partnership inquiry',
    message: 'Hello, I would like to learn more…', referenceId: 'HPG-C-ABC123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: 600 as const, margin: '0 0 12px' }
const lead = { color: '#1a1a1a', fontSize: '15px', lineHeight: '22px', margin: '0 0 12px' }
const ref = { color: '#333', fontSize: '14px', margin: '0 0 8px' }
const label = { color: '#666', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '12px 0 4px' }
const value = { color: '#1a1a1a', fontSize: '15px', margin: '0' }
const hr = { borderColor: '#eee', margin: '16px 0' }
const footer = { color: '#999', fontSize: '12px', marginTop: '16px' }
