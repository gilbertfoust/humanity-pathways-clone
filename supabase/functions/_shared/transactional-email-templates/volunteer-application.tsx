import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Humanity Pathways Global"

interface Props {
  fullName?: string
  preferredName?: string
  email?: string
  phone?: string
  location?: string
  linkedIn?: string
  position?: string
  startDate?: string
  availability?: string[]
  hoursTimezone?: string
  degree?: string
  experienceSummary?: string
  competencies?: string
  toolsCerts?: string
  resumeLink?: string
  missionStatement?: string
  causesRegions?: string
  authorizedToWork?: string
  requireSponsorship?: string
}

const VolunteerApplicationEmail = (props: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Volunteer Application: {props.fullName || 'New Applicant'} — {props.position || 'General'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>{SITE_NAME}</Heading>
          <Text style={subtitle}>Volunteer Application Received</Text>
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Personal Information</Heading>
          <Text style={field}><strong>Full Name:</strong> {props.fullName || '—'}</Text>
          {props.preferredName && <Text style={field}><strong>Preferred Name:</strong> {props.preferredName}</Text>}
          <Text style={field}><strong>Email:</strong> {props.email || '—'}</Text>
          <Text style={field}><strong>Phone:</strong> {props.phone || '—'}</Text>
          <Text style={field}><strong>Location:</strong> {props.location || '—'}</Text>
          {props.linkedIn && <Text style={field}><strong>LinkedIn:</strong> {props.linkedIn}</Text>}
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Position & Logistics</Heading>
          <Text style={field}><strong>Position:</strong> {props.position || '—'}</Text>
          <Text style={field}><strong>Start Date:</strong> {props.startDate || '—'}</Text>
          <Text style={field}><strong>Availability:</strong> {props.availability?.join(', ') || '—'}</Text>
          {props.hoursTimezone && <Text style={field}><strong>Hours/Timezone:</strong> {props.hoursTimezone}</Text>}
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Experience & Qualifications</Heading>
          <Text style={field}><strong>Education:</strong> {props.degree || '—'}</Text>
          <Text style={field}><strong>Experience:</strong> {props.experienceSummary || '—'}</Text>
          <Text style={field}><strong>Competencies:</strong> {props.competencies || '—'}</Text>
          {props.toolsCerts && <Text style={field}><strong>Tools/Certs:</strong> {props.toolsCerts}</Text>}
          <Text style={field}><strong>Resume:</strong> {props.resumeLink || '—'}</Text>
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading as="h2" style={h2}>Mission Alignment</Heading>
          <Text style={field}><strong>Mission Statement:</strong> {props.missionStatement || '—'}</Text>
          {props.causesRegions && <Text style={field}><strong>Causes/Regions:</strong> {props.causesRegions}</Text>}
          <Text style={field}><strong>Authorized to Work:</strong> {props.authorizedToWork || '—'}</Text>
          <Text style={field}><strong>Requires Sponsorship:</strong> {props.requireSponsorship || '—'}</Text>
        </Section>

        <Hr style={divider} />
        <Text style={footer}>This is an automated notification from {SITE_NAME}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: VolunteerApplicationEmail,
  subject: (data: Record<string, any>) =>
    `Volunteer Application: ${data.fullName || 'New Applicant'} — ${data.position || 'General'}`,
  displayName: 'Volunteer application notification',
  previewData: {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 555-123-4567',
    location: 'New York, NY, USA',
    position: 'Grant Manager',
    startDate: '2026-05-01',
    availability: ['Remote', 'Part-time'],
    degree: "Master's Degree",
    experienceSummary: '5 years in grant management and nonprofit operations.',
    competencies: 'Grant writing, budget management, stakeholder engagement',
    resumeLink: 'https://drive.google.com/example',
    missionStatement: 'I am deeply passionate about creating sustainable pathways for communities.',
    authorizedToWork: 'Yes',
    requireSponsorship: 'No',
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
