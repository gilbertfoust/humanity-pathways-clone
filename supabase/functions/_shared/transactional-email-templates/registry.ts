/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as volunteerApplication } from './volunteer-application.tsx'
import { template as sponsorshipApplication } from './sponsorship-application.tsx'
import { template as onboardingFeeReceipt } from './onboarding-fee-receipt.tsx'
import { template as contactInquiry } from './contact-inquiry.tsx'
import { template as newsletterSubscription } from './newsletter-subscription.tsx'
import { template as contactAcknowledgement } from './contact-acknowledgement.tsx'
import { template as newsletterAcknowledgement } from './newsletter-acknowledgement.tsx'
import { template as volunteerAcknowledgement } from './volunteer-acknowledgement.tsx'
import { template as sponsorshipAcknowledgement } from './sponsorship-acknowledgement.tsx'
import { template as boardApplication } from './board-application.tsx'
import { template as boardAcknowledgement } from './board-acknowledgement.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'volunteer-application': volunteerApplication,
  'sponsorship-application': sponsorshipApplication,
  'onboarding-fee-receipt': onboardingFeeReceipt,
  'contact-inquiry': contactInquiry,
  'newsletter-subscription': newsletterSubscription,
  'contact-acknowledgement': contactAcknowledgement,
  'newsletter-acknowledgement': newsletterAcknowledgement,
  'volunteer-acknowledgement': volunteerAcknowledgement,
  'sponsorship-acknowledgement': sponsorshipAcknowledgement,
  'board-application': boardApplication,
  'board-acknowledgement': boardAcknowledgement,
}
