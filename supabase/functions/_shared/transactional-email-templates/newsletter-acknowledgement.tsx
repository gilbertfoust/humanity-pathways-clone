import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Humanity Pathways Global'

interface Props { email?: string; referenceId?: string }

const Email = ({ email, referenceId }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're subscribed to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You're on the list.</Heading>
        <Text style={lead}>
          Thank you for subscribing to updates from {SITE_NAME}. We'll send occasional news
          about our initiatives, events, and impact.
        </Text>
        {referenceId && <Text style={ref}>Reference: <strong>{referenceId}</strong></Text>}
        {email && <Text style={ref}>Subscribed address: {email}</Text>}
        <Hr style={hr} />
        <Text style={footer}>
          You can unsubscribe at any time using the link in the footer of any email we send.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: () => `Welcome to updates from ${SITE_NAME}`,
  displayName: 'Newsletter — Subscriber Acknowledgement',
  previewData: { email: 'jane@example.com', referenceId: 'HPG-N-XYZ123' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: 600 as const, margin: '0 0 12px' }
const lead = { color: '#1a1a1a', fontSize: '15px', lineHeight: '22px', margin: '0 0 12px' }
const ref = { color: '#333', fontSize: '14px', margin: '0 0 6px' }
const hr = { borderColor: '#eee', margin: '16px 0' }
const footer = { color: '#999', fontSize: '12px' }
