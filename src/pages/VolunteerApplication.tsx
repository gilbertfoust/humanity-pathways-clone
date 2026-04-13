import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

/* ── schemas per step ────────────────────────── */

const stepOneSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  preferredName: z.string().max(100).optional(),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(1, "Phone number is required").max(30),
  location: z.string().trim().min(1, "Current location is required").max(200),
  linkedIn: z
    .string()
    .max(500)
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Link must start with http:// or https://"
    )
    .optional(),
});

const positions = [
  "Director of NGO Programs",
  "HR Specialist",
  "Recruitment Specialist",
  "Grant Manager",
  "Software/DevOps Specialist",
  "Project Manager",
  "General Volunteer",
] as const;

const availabilityOptions = ["Remote", "Part-time", "Weekends", "Evenings"] as const;

const degrees = [
  "High School / GED",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate / PhD",
] as const;

const STEPS = ["Personal", "Position", "Experience", "Alignment", "Review"] as const;

/* ── types ────────────────────────────────────── */

interface FormData {
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  position: string;
  startDate: string;
  availability: string[];
  hoursTimezone: string;
  degree: string;
  experienceSummary: string;
  competencies: string;
  toolsCerts: string;
  resumeLink: string;
  missionStatement: string;
  causesRegions: string;
  authorizedToWork: string;
  requireSponsorship: string;
  consent: boolean;
}

const emptyForm: FormData = {
  fullName: "",
  preferredName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  position: "",
  startDate: "",
  availability: [],
  hoursTimezone: "",
  degree: "",
  experienceSummary: "",
  competencies: "",
  toolsCerts: "",
  resumeLink: "",
  missionStatement: "",
  causesRegions: "",
  authorizedToWork: "",
  requireSponsorship: "",
  consent: false,
};

/* ── component ───────────────────────────────── */

export default function VolunteerApplication() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const progress = ((step + 1) / STEPS.length) * 100;

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ── validation per step ─────────────────── */

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (step === 0) {
      const result = stepOneSchema.safeParse(form);
      if (!result.success) {
        result.error.errors.forEach((e) => {
          errs[e.path[0] as string] = e.message;
        });
      }
    }

    if (step === 1) {
      if (!form.position) errs.position = "Please select a position.";
      if (!form.startDate) errs.startDate = "Please choose a start date.";
      if (form.availability.length === 0)
        errs.availability = "Please select at least one availability option.";
    }

    if (step === 2) {
      if (!form.degree) errs.degree = "Please select an education level.";
      if (!form.experienceSummary.trim())
        errs.experienceSummary = "Please add a short experience summary.";
      if (!form.competencies.trim())
        errs.competencies = "Please list your core competencies.";
      if (!form.resumeLink.trim())
        errs.resumeLink = "Please provide a resume link.";
    }

    if (step === 3) {
      if (!form.missionStatement.trim())
        errs.missionStatement = "Please add a short explanation.";
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

  const handleSubmit = async () => {
    // Save to localStorage as backup
    const submissions = JSON.parse(
      localStorage.getItem("hpg_volunteer_apps") || "[]"
    );
    const id = crypto.randomUUID();
    const entry = {
      ...form,
      id,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(entry);
    localStorage.setItem("hpg_volunteer_apps", JSON.stringify(submissions));

    // Send email to HR
    const templateData = { ...form };
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "volunteer-application",
        recipientEmail: "hr.staffing@humanitypathwaysglobal.com",
        idempotencyKey: `volunteer-hr-${id}`,
        templateData,
      },
    });

    // Send email to Trello Recruitment board
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "volunteer-application",
        recipientEmail: "gilbertfoust+liliiodopchnjng0z0sf@boards.trello.com",
        idempotencyKey: `volunteer-trello-${id}`,
        templateData,
      },
    });

    setSubmitted(true);
    toast({
      title: "Application received!",
      description:
        "Your submission has been recorded. A receipt email should arrive shortly.",
    });
  };

  /* ── field helper ────────────────────────── */

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-sm text-destructive">{errors[field]}</p>
    ) : null;

  /* ── step renders ────────────────────────── */

  const renderPersonal = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Personal Information
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Legal Full Name *</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Your full legal name"
          />
          <FieldError field="fullName" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferredName">Preferred Name</Label>
          <Input
            id="preferredName"
            value={form.preferredName}
            onChange={(e) => set("preferredName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
          <FieldError field="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Mobile Phone *</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
          <p className="text-xs text-muted-foreground">
            Include country code if outside the U.S.
          </p>
          <FieldError field="phone" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="location">Current Location (City, State, Country) *</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
          <FieldError field="location" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="linkedIn">LinkedIn / Portfolio URL</Label>
          <Input
            id="linkedIn"
            value={form.linkedIn}
            onChange={(e) => set("linkedIn", e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
          <FieldError field="linkedIn" />
        </div>
      </div>
    </div>
  );

  const renderPosition = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Position &amp; Logistics
      </h3>

      <div className="space-y-1.5">
        <Label>Position Applying For *</Label>
        <Select value={form.position} onValueChange={(v) => set("position", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Role..." />
          </SelectTrigger>
          <SelectContent>
            {positions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError field="position" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="startDate">Available Start Date *</Label>
        <Input
          id="startDate"
          type="date"
          value={form.startDate}
          onChange={(e) => set("startDate", e.target.value)}
        />
        <FieldError field="startDate" />
      </div>

      <div className="space-y-2">
        <Label>Work Style &amp; Availability *</Label>
        <div className="flex flex-wrap gap-4">
          {availabilityOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.availability.includes(opt)}
                onCheckedChange={(checked) => {
                  set(
                    "availability",
                    checked
                      ? [...form.availability, opt]
                      : form.availability.filter((a) => a !== opt)
                  );
                }}
              />
              {opt}
            </label>
          ))}
        </div>
        <FieldError field="availability" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hoursTimezone">Hours per Week &amp; Time Zone Constraints</Label>
        <Input
          id="hoursTimezone"
          value={form.hoursTimezone}
          onChange={(e) => set("hoursTimezone", e.target.value)}
          placeholder="e.g. 10-15 hrs/week, EST"
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Experience &amp; Qualifications
      </h3>

      <div className="space-y-1.5">
        <Label>Highest Degree Earned *</Label>
        <Select value={form.degree} onValueChange={(v) => set("degree", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select one..." />
          </SelectTrigger>
          <SelectContent>
            {degrees.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError field="degree" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="experienceSummary">Professional Experience Summary *</Label>
        <Textarea
          id="experienceSummary"
          value={form.experienceSummary}
          onChange={(e) => set("experienceSummary", e.target.value)}
          placeholder="If relevant, mention fiscal sponsorship or grant management experience."
          rows={5}
          maxLength={4000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {form.experienceSummary.length} / 4000
        </p>
        <FieldError field="experienceSummary" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="competencies">Top 2–3 Core Competencies *</Label>
        <Textarea
          id="competencies"
          value={form.competencies}
          onChange={(e) => set("competencies", e.target.value)}
          rows={3}
          maxLength={600}
        />
        <p className="text-xs text-muted-foreground text-right">
          {form.competencies.length} / 600
        </p>
        <FieldError field="competencies" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="toolsCerts">Technical Tools &amp; Certifications</Label>
        <Input
          id="toolsCerts"
          value={form.toolsCerts}
          onChange={(e) => set("toolsCerts", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="resumeLink">Resume (link) *</Label>
        <Input
          id="resumeLink"
          value={form.resumeLink}
          onChange={(e) => set("resumeLink", e.target.value)}
          placeholder="Paste a link to your resume (Google Drive, Dropbox, etc.)"
        />
        <p className="text-xs text-muted-foreground">
          Ensure the link is viewable by anyone.
        </p>
        <FieldError field="resumeLink" />
      </div>
    </div>
  );

  const renderAlignment = () => (
    <div className="space-y-5">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Mission Alignment
      </h3>

      <div className="space-y-1.5">
        <Label htmlFor="missionStatement">
          What inspires you to contribute to HPG's mission? *
        </Label>
        <Textarea
          id="missionStatement"
          value={form.missionStatement}
          onChange={(e) => set("missionStatement", e.target.value)}
          rows={5}
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {form.missionStatement.length} / 2000
        </p>
        <FieldError field="missionStatement" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="causesRegions">
          Specific causes or regions you care about
        </Label>
        <Input
          id="causesRegions"
          value={form.causesRegions}
          onChange={(e) => set("causesRegions", e.target.value)}
        />
      </div>

      <h3 className="font-display text-xl font-semibold text-foreground pt-4">
        Compliance &amp; Review
      </h3>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Legally authorized to work in your country?</Label>
          <RadioGroup
            value={form.authorizedToWork}
            onValueChange={(v) => set("authorizedToWork", v)}
            className="flex gap-6"
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="Yes" /> Yes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="No" /> No
            </label>
          </RadioGroup>
        </div>

        <div className="space-y-1.5">
          <Label>Do you require sponsorship?</Label>
          <RadioGroup
            value={form.requireSponsorship}
            onValueChange={(v) => set("requireSponsorship", v)}
            className="flex gap-6"
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="No" /> No
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="Yes" /> Yes
            </label>
          </RadioGroup>
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <Checkbox
          checked={form.consent}
          onCheckedChange={(c) => set("consent", c === true)}
          className="mt-0.5"
        />
        <span>
          I consent to Humanity Pathways Global processing my data for
          recruitment purposes.
        </span>
      </label>
      <FieldError field="consent" />
    </div>
  );

  const renderReview = () => {
    const sections = [
      {
        title: "Personal Information",
        rows: [
          ["Full Name", form.fullName],
          ["Preferred Name", form.preferredName || "—"],
          ["Email", form.email],
          ["Phone", form.phone],
          ["Location", form.location],
          ["LinkedIn / Portfolio", form.linkedIn || "—"],
        ],
      },
      {
        title: "Position & Logistics",
        rows: [
          ["Position", form.position],
          ["Start Date", form.startDate],
          ["Availability", form.availability.join(", ")],
          ["Hours / Timezone", form.hoursTimezone || "—"],
        ],
      },
      {
        title: "Experience & Qualifications",
        rows: [
          ["Degree", form.degree],
          ["Experience Summary", form.experienceSummary],
          ["Core Competencies", form.competencies],
          ["Tools & Certifications", form.toolsCerts || "—"],
          ["Resume Link", form.resumeLink],
        ],
      },
      {
        title: "Mission Alignment",
        rows: [
          ["Mission Statement", form.missionStatement],
          ["Causes / Regions", form.causesRegions || "—"],
          ["Authorized to Work", form.authorizedToWork || "—"],
          ["Requires Sponsorship", form.requireSponsorship || "—"],
        ],
      },
    ];

    return (
      <div className="space-y-6">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Review Your Application
        </h3>
        {sections.map((s) => (
          <div key={s.title} className="rounded-md border border-border p-4">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {s.title}
            </h4>
            <dl className="space-y-2">
              {s.rows.map(([label, val]) => (
                <div key={label} className="grid grid-cols-3 gap-2 text-sm">
                  <dt className="font-medium text-foreground">{label}</dt>
                  <dd className="col-span-2 text-muted-foreground break-words">
                    {val}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        <p className="text-sm text-muted-foreground">
          If everything looks correct, click <strong>Submit</strong> below.
        </p>
      </div>
    );
  };

  /* ── success state ───────────────────────── */

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <PageHero title="Application Received" />
        <section className="mx-auto max-w-2xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
          <h2 className="mt-6 font-display text-3xl font-semibold text-foreground">
            Thank You!
          </h2>
          <p className="mt-4 text-muted-foreground">
            Your submission has been recorded successfully. A receipt email
            should arrive shortly at <strong>{form.email}</strong>.
          </p>
          <Button
            className="mt-8"
            onClick={() => {
              setForm(emptyForm);
              setStep(0);
              setSubmitted(false);
            }}
          >
            Start New Application
          </Button>
        </section>
        <Footer />
      </div>
    );
  }

  /* ── main render ─────────────────────────── */

  const stepContent = [
    renderPersonal,
    renderPosition,
    renderExperience,
    renderAlignment,
    renderReview,
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Join the Movement"
        subtitle="Career & Volunteer Application"
      />

      <section className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-3 flex justify-between">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => {
                  if (i < step) setStep(i);
                }}
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  i === step
                    ? "text-primary"
                    : i < step
                    ? "text-accent cursor-pointer"
                    : "text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Form step */}
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

        {/* Nav buttons */}
        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={back}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-1">
              <CheckCircle2 className="h-4 w-4" /> Submit
            </Button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
