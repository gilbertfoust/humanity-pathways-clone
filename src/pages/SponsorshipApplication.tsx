import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, CheckCircle2, Copy } from "lucide-react";

const STEPS = ["Organization", "Request", "Impact", "Links", "Review"] as const;

const legalStatuses = [
  "501(c)(3)",
  "Nonprofit pending",
  "International NGO",
  "Unincorporated initiative",
  "For-profit social enterprise",
  "Other",
] as const;

const sponsorshipModels = [
  "Project Sponsorship",
  "Fiscal Sponsorship (Type C)",
  "Event Sponsorship",
  "In-kind Sponsorship",
  "Other",
] as const;

const contactMethods = ["Email", "WhatsApp", "Zoom"] as const;

interface FormData {
  orgName: string;
  website: string;
  repName: string;
  repTitle: string;
  email: string;
  phone: string;
  location: string;
  ein: string;
  legalStatus: string;
  countryRegistration: string;
  countryOperation: string;
  model: string;
  missionFocus: string;
  numProjects: string;
  totalAmount: string;
  overheadPerProject: string;
  donationPerProject: string;
  timelineStart: string;
  timelineEnd: string;
  projectExamples: string;
  eventDetails: string;
  inkindDetails: string;
  communityImpact: string;
  brandingMessage: string;
  otherFunding: string;
  proposalLink: string;
  budgetLink: string;
  deckLink: string;
  contactMethod: string;
  timezone: string;
  consent: boolean;
}

const emptyForm: FormData = {
  orgName: "",
  website: "",
  repName: "",
  repTitle: "",
  email: "",
  phone: "",
  location: "",
  ein: "",
  legalStatus: "",
  countryRegistration: "",
  countryOperation: "",
  model: "",
  missionFocus: "",
  numProjects: "",
  totalAmount: "",
  overheadPerProject: "",
  donationPerProject: "",
  timelineStart: "",
  timelineEnd: "",
  projectExamples: "",
  eventDetails: "",
  inkindDetails: "",
  communityImpact: "",
  brandingMessage: "",
  otherFunding: "",
  proposalLink: "",
  budgetLink: "",
  deckLink: "",
  contactMethod: "",
  timezone: "",
  consent: false,
};

export default function SponsorshipApplication() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const { toast } = useToast();

  const progress = ((step + 1) / STEPS.length) * 100;

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-sm text-destructive">{errors[field]}</p>
    ) : null;

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (step === 0) {
      if (!form.orgName.trim()) errs.orgName = "Organization name is required.";
      if (!form.repName.trim()) errs.repName = "Representative name is required.";
      const emailResult = z.string().email().safeParse(form.email);
      if (!emailResult.success) errs.email = "Please enter a valid email.";
    }

    if (step === 1) {
      if (!form.model) errs.model = "Please select a sponsorship model.";
      if (!form.missionFocus.trim()) errs.missionFocus = "Mission focus is required.";
    }

    if (step === 2) {
      if (!form.communityImpact.trim())
        errs.communityImpact = "Please describe how your project impacts the community.";
      if (!form.brandingMessage.trim())
        errs.brandingMessage = "Please describe the branding message.";
    }

    if (step === 3) {
      // Links step — no hard requirements, but consent is checked here
      if (!form.consent) errs.consent = "Consent is required to submit.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    const id = `HPG-S-${Date.now().toString(36).toUpperCase()}`;
    const submissions = JSON.parse(
      localStorage.getItem("hpg_sponsorship_apps") || "[]"
    );
    submissions.push({ ...form, id, submittedAt: new Date().toISOString() });
    localStorage.setItem("hpg_sponsorship_apps", JSON.stringify(submissions));
    setRefId(id);
    setSubmitted(true);
    toast({
      title: "Application received!",
      description: "Your sponsorship application has been submitted.",
    });
  };

  const copyRefId = () => {
    navigator.clipboard.writeText(refId);
    toast({ title: "Reference ID copied!" });
  };

  /* ── Step Renders ─────────────────────── */

  const renderOrganization = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">Organization Details</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="orgName">Organization Name *</Label>
          <Input id="orgName" value={form.orgName} onChange={(e) => set("orgName", e.target.value)} />
          <FieldError field="orgName" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Website (optional)</Label>
          <Input id="website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://... or social profile link" />
          <p className="text-xs text-muted-foreground">If you do not have a website, paste a social profile link.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="repName">Representative Name *</Label>
          <Input id="repName" value={form.repName} onChange={(e) => set("repName", e.target.value)} />
          <FieldError field="repName" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="repTitle">Representative Title / Role</Label>
          <Input id="repTitle" value={form.repTitle} onChange={(e) => set("repTitle", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <FieldError field="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="location">Location (City, State, Country)</Label>
          <Input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ein">EIN / Tax ID (if applicable)</Label>
          <Input id="ein" value={form.ein} onChange={(e) => set("ein", e.target.value)} />
          <p className="text-xs text-muted-foreground">If outside the U.S., you can leave this blank.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Legal Status</Label>
          <Select value={form.legalStatus} onValueChange={(v) => set("legalStatus", v)}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              {legalStatuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="countryRegistration">Country of Registration</Label>
          <Input id="countryRegistration" value={form.countryRegistration} onChange={(e) => set("countryRegistration", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="countryOperation">Country of Operation</Label>
          <Input id="countryOperation" value={form.countryOperation} onChange={(e) => set("countryOperation", e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderRequest = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">Sponsorship Request</h3>

      <div className="space-y-1.5">
        <Label>Select Sponsorship Model *</Label>
        <Select value={form.model} onValueChange={(v) => set("model", v)}>
          <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
          <SelectContent>
            {sponsorshipModels.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">This controls which fields appear below.</p>
        <FieldError field="model" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="missionFocus">Mission Focus *</Label>
        <Input id="missionFocus" value={form.missionFocus} onChange={(e) => set("missionFocus", e.target.value)} />
        <FieldError field="missionFocus" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="numProjects">Number of Projects</Label>
          <Input id="numProjects" value={form.numProjects} onChange={(e) => set("numProjects", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="totalAmount">Total Amount Requested (USD)</Label>
          <Input id="totalAmount" value={form.totalAmount} onChange={(e) => set("totalAmount", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="overheadPerProject">Estimated Overhead Per Project (USD)</Label>
          <Input id="overheadPerProject" value={form.overheadPerProject} onChange={(e) => set("overheadPerProject", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="donationPerProject">Targeted Donation Per Project (USD)</Label>
          <Input id="donationPerProject" value={form.donationPerProject} onChange={(e) => set("donationPerProject", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timelineStart">Timeline Start Date</Label>
          <Input id="timelineStart" type="date" value={form.timelineStart} onChange={(e) => set("timelineStart", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timelineEnd">Timeline End Date</Label>
          <Input id="timelineEnd" type="date" value={form.timelineEnd} onChange={(e) => set("timelineEnd", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="projectExamples">Project Examples</Label>
        <Textarea id="projectExamples" value={form.projectExamples} onChange={(e) => set("projectExamples", e.target.value)} rows={4} maxLength={4000} placeholder="Separate multiple projects with bullet points." />
        <p className="text-xs text-muted-foreground text-right">{form.projectExamples.length} / 4000</p>
      </div>

      {form.model === "Event Sponsorship" && (
        <div className="space-y-1.5">
          <Label htmlFor="eventDetails">Event Sponsorship Details</Label>
          <Textarea id="eventDetails" value={form.eventDetails} onChange={(e) => set("eventDetails", e.target.value)} rows={3} placeholder="Include date/location or add a deck link in the Links step." />
        </div>
      )}

      {form.model === "In-kind Sponsorship" && (
        <div className="space-y-1.5">
          <Label htmlFor="inkindDetails">In-kind Sponsorship Details</Label>
          <Textarea id="inkindDetails" value={form.inkindDetails} onChange={(e) => set("inkindDetails", e.target.value)} rows={3} placeholder="List items and quantities, and provide an itemized doc link in Links." />
        </div>
      )}
    </div>
  );

  const renderImpact = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">Community Impact</h3>

      <div className="space-y-1.5">
        <Label htmlFor="communityImpact">How will your project impact the community? *</Label>
        <Textarea id="communityImpact" value={form.communityImpact} onChange={(e) => set("communityImpact", e.target.value)} rows={6} maxLength={8000} placeholder="Beneficiaries, frequency, outputs, and measurable indicators." />
        <p className="text-xs text-muted-foreground text-right">{form.communityImpact.length} / 8000</p>
        <FieldError field="communityImpact" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="brandingMessage">What is the branding message and vibe of your project? *</Label>
        <Textarea id="brandingMessage" value={form.brandingMessage} onChange={(e) => set("brandingMessage", e.target.value)} rows={4} maxLength={4000} />
        <p className="text-xs text-muted-foreground text-right">{form.brandingMessage.length} / 4000</p>
        <FieldError field="brandingMessage" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="otherFunding">What other funding sources have you secured?</Label>
        <Textarea id="otherFunding" value={form.otherFunding} onChange={(e) => set("otherFunding", e.target.value)} rows={3} maxLength={4000} />
        <p className="text-xs text-muted-foreground text-right">{form.otherFunding.length} / 4000</p>
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">Supporting Links &amp; Preferences</h3>

      <div className="space-y-1.5">
        <Label htmlFor="proposalLink">Proposal / Concept Note Link</Label>
        <Input id="proposalLink" value={form.proposalLink} onChange={(e) => set("proposalLink", e.target.value)} placeholder="https://..." />
        <p className="text-xs text-muted-foreground">A short concept note is fine if you don't have a full proposal yet.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="budgetLink">Budget Link</Label>
          <Input id="budgetLink" value={form.budgetLink} onChange={(e) => set("budgetLink", e.target.value)} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="deckLink">Deck / Pitch Link</Label>
          <Input id="deckLink" value={form.deckLink} onChange={(e) => set("deckLink", e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Preferred Contact Method</Label>
          <Select value={form.contactMethod} onValueChange={(v) => set("contactMethod", v)}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              {contactMethods.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="timezone">Time Zone</Label>
          <Input id="timezone" value={form.timezone} onChange={(e) => set("timezone", e.target.value)} placeholder="e.g. EST, WAT, GMT+3" />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <Checkbox checked={form.consent} onCheckedChange={(c) => set("consent", c === true)} className="mt-0.5" />
        <span>I consent to receive updates on the status of my application.</span>
      </label>
      <FieldError field="consent" />
    </div>
  );

  const renderReview = () => {
    const sections = [
      {
        title: "Organization",
        rows: [
          ["Organization", form.orgName],
          ["Website", form.website || "—"],
          ["Representative", form.repName],
          ["Title", form.repTitle || "—"],
          ["Email", form.email],
          ["Phone", form.phone || "—"],
          ["Location", form.location || "—"],
          ["EIN", form.ein || "—"],
          ["Legal Status", form.legalStatus || "—"],
          ["Registration", form.countryRegistration || "—"],
          ["Operation", form.countryOperation || "—"],
        ],
      },
      {
        title: "Request",
        rows: [
          ["Model", form.model],
          ["Mission Focus", form.missionFocus],
          ["# Projects", form.numProjects || "—"],
          ["Total Requested", form.totalAmount || "—"],
          ["Timeline", form.timelineStart && form.timelineEnd ? `${form.timelineStart} → ${form.timelineEnd}` : "—"],
          ["Project Examples", form.projectExamples || "—"],
        ],
      },
      {
        title: "Impact",
        rows: [
          ["Community Impact", form.communityImpact],
          ["Branding Message", form.brandingMessage],
          ["Other Funding", form.otherFunding || "—"],
        ],
      },
      {
        title: "Links",
        rows: [
          ["Proposal Link", form.proposalLink || "—"],
          ["Budget Link", form.budgetLink || "—"],
          ["Deck Link", form.deckLink || "—"],
          ["Contact Method", form.contactMethod || "—"],
          ["Timezone", form.timezone || "—"],
        ],
      },
    ];

    return (
      <div className="space-y-6">
        <h3 className="font-display text-xl font-semibold text-foreground">Review &amp; Confirm</h3>
        <p className="text-sm text-muted-foreground">
          Submissions are reviewed by Development. You will receive a reference ID after submission.
        </p>
        {sections.map((s) => (
          <div key={s.title} className="rounded-md border border-border p-4">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{s.title}</h4>
            <dl className="space-y-2">
              {s.rows.map(([label, val]) => (
                <div key={label} className="grid grid-cols-3 gap-2 text-sm">
                  <dt className="font-medium text-foreground">{label}</dt>
                  <dd className="col-span-2 text-muted-foreground break-words whitespace-pre-line">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    );
  };

  /* ── Success ─────────────────────────── */

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <PageHero title="Application Received" />
        <section className="mx-auto max-w-2xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-6 font-display text-3xl font-semibold text-foreground">
            Application Received
          </h2>
          <p className="mt-4 text-muted-foreground">
            Your sponsorship application was submitted successfully.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2 text-sm font-mono">
            <span className="text-muted-foreground">Reference ID:</span>
            <span className="font-bold text-foreground">{refId}</span>
            <button onClick={copyRefId} className="text-primary hover:text-primary/80">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Include this reference ID if you follow up by email so Development can locate your submission.
          </p>
          <Button
            className="mt-8"
            onClick={() => {
              setForm(emptyForm);
              setStep(0);
              setSubmitted(false);
              setRefId("");
            }}
          >
            Done
          </Button>
        </section>
        <Footer />
      </div>
    );
  }

  /* ── Main ────────────────────────────── */

  const stepContent = [renderOrganization, renderRequest, renderImpact, renderLinks, renderReview];

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Sponsorship Application" subtitle="Submit your organization's sponsorship request to HPG Development" />

      <section className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-3 flex justify-between">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => { if (i < step) setStep(i); }}
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  i === step ? "text-primary" : i < step ? "text-accent cursor-pointer" : "text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {stepContent[step]()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" onClick={back} disabled={step === 0} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-1">
              <CheckCircle2 className="h-4 w-4" /> Submit to HPG Development
            </Button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
