import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Humanity Pathways Global'

interface Props {
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedIn?: string
  seatInterest?: string
  currentAffiliation?: string
  professionalBackground?: string
  boardExperience?: string
  governanceExpertise?: string
  committeeInterest?: string
  timeCommitment?: string
  conflictsDisclosure?: string
  motivation?: string
  referenceId?: string
}

const Row = ({ label, value }: { label: string; value?: string }) => (
  value ? <Text style={field}><strong>{label}:</strong> {value}</Text> : null
)

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Board Application: {p.fullName || 'New Candidate'} — {p.seatInterest || 'Board Seat'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{SITE_NAME}</Heading>
          <Text style={subtitle}>Board of Directors — Application Received</Text>
        </Section>
        <Hr style={divider} />
        <Section style={section}>
          <Heading as="h2" style={h2}>Candidate</Heading>
          <Row label="Full Name" value={p.fullName} />
          <Row label="Email" value={p.email} />
          <Row label="Phone" value={p.phone} />
          <Row label="Location" value={p.location} />
          <Row label="LinkedIn" value={p.linkedIn} />
          <Row label="Current Affiliation" value={p.currentAffiliation} />
        </Section>
        <Hr style={divider} />
        <Section style={section}>
          <Heading as="h2" style={h2}>Seat & Committees</Heading>
          <Row label="Seat / Role Interest" value={p.seatInterest} />
          <Row label="Committee Interest" value={p.committeeInterest} />
          <Row label="Time Commitment" value={p.timeCommitment} />
        </Section>
        <Hr style={divider} />
        <Section style={section}>
          <Heading as="h2" style={h2}>Governance & Experience</Heading>
          {p.professionalBackground && (<>
            <Text style={label}>Professional Background</Text>
            <Text style={{ ...field, whiteSpace: 'pre-wrap' }}>{p.professionalBackground}</Text>
          </>)}
          {p.boardExperience && (<>
            <Text style={label}>Board Experience</Text>
            <Text style={{ ...field, whiteSpace: 'pre-wrap' }}>{p.boardExperience}</Text>
          </>)}
          {p.governanceExpertise && (<>
            <Text style={label}>Governance Expertise</Text>
            <Text style={{ ...field, whiteSpace: 'pre-wrap' }}>{p.governanceExpertise}</Text>
          </>)}
        </Section>
        <Hr style={divider} />
        <Section style={section}>
          <Heading as="h2" style={h2}>Alignment</Heading>
          {p.motivation && (<>
            <Text style={label}>Motivation</Text>
            <Text style={{ ...field, whiteSpace: 'pre-wrap' }}>{p.motivation}</Text>
          </>)}
          {p.conflictsDisclosure && (<>
            <Text style={label}>Conflicts Disclosure</Text>
            <Text style={{ ...field, whiteSpace: 'pre-wrap' }}>{p.conflictsDisclosure}</Text>
          </>)}
        </Section>
        <Hr style={divider} />
        <Text style={footer}>
          Reference: {p.referenceId || '—'} · Received via the {SITE_NAME} Board Application form.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `Board App: ${d.fullName ?? 'Candidate'} — ${d.seatInterest ?? 'Board Seat'}`,
  displayName: 'Board Application',
  previewData: {
    fullName: 'Alex Rivera', email: 'alex@example.com', phone: '+1 555 0100',
    location: 'Chicago, IL', linkedIn: 'https://linkedin.com/in/alex',
    seatInterest: 'Director', committeeInterest: 'Nominations, Finance',
    currentAffiliation: 'Rivera & Co', timeCommitment: '5-10 hrs/mo',
    professionalBackground: '20+ years in nonprofit governance.',
    boardExperience: 'Board chair, ExampleOrg 2018-2022.',
    governanceExpertise: 'Finance, audit, risk.',
    motivation: 'Committed to global equity.',
    conflictsDisclosure: 'None to disclose.',
    referenceId: 'HPG-B-ABC123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { margin: '0 auto', padding: '24px', maxWidth: '640px' }
const header = { padding: '4px 0 12px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: 700 as const, margin: '0 0 4px' }
const subtitle = { color: '#555', fontSize: '14px', margin: 0 }
const section = { padding: '4px 0' }
const h2 = { color: '#1a1a1a', fontSize: '15px', fontWeight: 700 as const, margin: '0 0 8px' }
const label = { color: '#666', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '10px 0 4px' }
const field = { color: '#1a1a1a', fontSize: '14px', margin: '4px 0' }
const divider = { borderColor: '#eee', margin: '12px 0' }
const footer = { color: '#999', fontSize: '12px', marginTop: '12px' }
