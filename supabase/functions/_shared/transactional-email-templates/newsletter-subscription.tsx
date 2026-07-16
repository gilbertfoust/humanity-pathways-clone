import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Humanity Pathways Global'

interface Props {
  email?: string
  referenceId?: string
  subscribedAt?: string
}

const Email = ({ email, referenceId, subscribedAt }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New newsletter subscriber: {email}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Newsletter Subscriber</Heading>
        {referenceId && <Text style={ref}>Reference: {referenceId}</Text>}
        <Hr style={hr} />
        <Text style={label}>Email</Text>
        <Text style={value}>{email}</Text>
        {subscribedAt && (
          <>
            <Text style={label}>Subscribed at</Text>
            <Text style={value}>{subscribedAt}</Text>
          </>
        )}
        <Hr style={hr} />
        <Text style={footer}>Added via the {SITE_NAME} subscribe form.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New subscriber: ${d.email ?? ''}`.trim(),
  displayName: 'Newsletter Subscription',
  previewData: { email: 'jane@example.com', referenceId: 'HPG-N-XYZ123', subscribedAt: new Date().toISOString() },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: 600 as const, margin: '0 0 8px' }
const ref = { color: '#666', fontSize: '13px', margin: '0 0 8px' }
const label = { color: '#666', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '12px 0 4px' }
const value = { color: '#1a1a1a', fontSize: '15px', margin: '0' }
const hr = { borderColor: '#eee', margin: '16px 0' }
const footer = { color: '#999', fontSize: '12px', marginTop: '16px' }
