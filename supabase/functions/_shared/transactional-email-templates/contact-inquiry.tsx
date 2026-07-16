import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Humanity Pathways Global'

interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
  referenceId?: string
}

const Email = ({ name, email, subject, message, referenceId }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact inquiry from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Inquiry</Heading>
        {referenceId && <Text style={ref}>Reference: {referenceId}</Text>}
        <Hr style={hr} />
        <Section>
          <Text style={label}>From</Text>
          <Text style={value}>{name} &lt;{email}&gt;</Text>
          <Text style={label}>Subject</Text>
          <Text style={value}>{subject}</Text>
          <Text style={label}>Message</Text>
          <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Sent via the {SITE_NAME} contact form.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Contact: ${d.subject ? String(d.subject).slice(0, 80) : 'New inquiry'} — ${d.name ?? ''}`.trim(),
  displayName: 'Contact Inquiry',
  previewData: {
    name: 'Jane Doe', email: 'jane@example.com',
    subject: 'Partnership inquiry', message: 'Hello, I would like to learn more…',
    referenceId: 'HPG-C-ABC123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: 600 as const, margin: '0 0 8px' }
const ref = { color: '#666', fontSize: '13px', margin: '0 0 8px' }
const label = { color: '#666', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '12px 0 4px' }
const value = { color: '#1a1a1a', fontSize: '15px', margin: '0' }
const hr = { borderColor: '#eee', margin: '16px 0' }
const footer = { color: '#999', fontSize: '12px', marginTop: '16px' }
