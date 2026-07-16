import { useRef, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(30),
  location: z.string().trim().min(1, "Location is required").max(200),
  linkedIn: z
    .string()
    .max(500)
    .refine((v) => !v || /^https?:\/\/.+/.test(v), "Must start with http(s)://")
    .optional()
    .or(z.literal("")),
  currentAffiliation: z.string().max(200).optional().or(z.literal("")),
  seatInterest: z.string().trim().min(1, "Please indicate the seat you are applying for").max(100),
  committeeInterest: z.string().max(500).optional().or(z.literal("")),
  timeCommitment: z.string().max(200).optional().or(z.literal("")),
  professionalBackground: z
    .string()
    .trim()
    .min(20, "Please provide at least a short professional background (20+ characters)")
    .max(5000),
  boardExperience: z.string().max(5000).optional().or(z.literal("")),
  governanceExpertise: z.string().max(5000).optional().or(z.literal("")),
  motivation: z
    .string()
    .trim()
    .min(20, "Please share your motivation (20+ characters)")
    .max(5000),
  conflictsDisclosure: z.string().max(5000).optional().or(z.literal("")),
});

type FormShape = z.infer<typeof schema>;

const initial: FormShape = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  currentAffiliation: "",
  seatInterest: "",
  committeeInterest: "",
  timeCommitment: "",
  professionalBackground: "",
  boardExperience: "",
  governanceExpertise: "",
  motivation: "",
  conflictsDisclosure: "",
};

export default function BoardApplication() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormShape>(initial);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{ referenceId: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const update = (field: keyof FormShape, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const res = schema.safeParse(form);
    if (!res.success) {
      const fe: Record<string, string> = {};
      res.error.errors.forEach((err) => {
        if (err.path[0]) fe[err.path[0] as string] = err.message;
      });
      setErrors(fe);
      return;
    }
    if (!consent) {
      setSubmitError("Please confirm you agree to the disclosure and processing terms.");
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-board", {
        body: { ...res.data, consent, _hp: hp, idempotencyKey: idempotencyKeyRef.current },
      });
      if (error || !data?.success) {
        const msg =
          (data as { error?: string } | null)?.error ||
          error?.message ||
          "We couldn't submit your application. Please try again.";
        setSubmitError(msg);
        toast({ title: "Submission failed", description: msg, variant: "destructive" });
        return;
      }
      setSubmitted({ referenceId: data.referenceId });
      toast({ title: "Application received", description: `Reference: ${data.referenceId}` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setSubmitError(msg);
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Board of Directors — Application"
        subtitle="Join the governance of Humanity Pathways Global"
      />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4">
          {submitted ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 font-display text-2xl font-semibold">
                Application received
              </h3>
              <p className="mt-2 text-muted-foreground">
                Your Board application was received and a confirmation email has been
                queued to your address. Our Nominations Committee will follow up.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Reference:{" "}
                <span className="font-mono font-medium text-foreground">
                  {submitted.referenceId}
                </span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <section className="space-y-4">
                <h2 className="font-display text-xl font-semibold">Candidate</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full name *</Label>
                    <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} disabled={loading} />
                    {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} disabled={loading} />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} disabled={loading} />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input id="location" value={form.location} onChange={(e) => update("location", e.target.value)} disabled={loading} />
                    {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location}</p>}
                  </div>
                  <div>
                    <Label htmlFor="linkedIn">LinkedIn URL</Label>
                    <Input id="linkedIn" value={form.linkedIn} onChange={(e) => update("linkedIn", e.target.value)} disabled={loading} placeholder="https://…" />
                    {errors.linkedIn && <p className="mt-1 text-xs text-destructive">{errors.linkedIn}</p>}
                  </div>
                  <div>
                    <Label htmlFor="currentAffiliation">Current organization</Label>
                    <Input id="currentAffiliation" value={form.currentAffiliation} onChange={(e) => update("currentAffiliation", e.target.value)} disabled={loading} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-xl font-semibold">Seat &amp; Committees</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="seatInterest">Seat / role of interest *</Label>
                    <Input id="seatInterest" value={form.seatInterest} onChange={(e) => update("seatInterest", e.target.value)} disabled={loading} placeholder="e.g. Director, Advisory" />
                    {errors.seatInterest && <p className="mt-1 text-xs text-destructive">{errors.seatInterest}</p>}
                  </div>
                  <div>
                    <Label htmlFor="timeCommitment">Time commitment</Label>
                    <Input id="timeCommitment" value={form.timeCommitment} onChange={(e) => update("timeCommitment", e.target.value)} disabled={loading} placeholder="e.g. 5–10 hrs/mo" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="committeeInterest">Committee interest</Label>
                    <Input id="committeeInterest" value={form.committeeInterest} onChange={(e) => update("committeeInterest", e.target.value)} disabled={loading} placeholder="e.g. Nominations, Finance, Fund Development" />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-xl font-semibold">Governance &amp; Experience</h2>
                <div>
                  <Label htmlFor="professionalBackground">Professional background *</Label>
                  <Textarea id="professionalBackground" rows={4} value={form.professionalBackground} onChange={(e) => update("professionalBackground", e.target.value)} disabled={loading} />
                  {errors.professionalBackground && <p className="mt-1 text-xs text-destructive">{errors.professionalBackground}</p>}
                </div>
                <div>
                  <Label htmlFor="boardExperience">Prior board experience</Label>
                  <Textarea id="boardExperience" rows={3} value={form.boardExperience} onChange={(e) => update("boardExperience", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <Label htmlFor="governanceExpertise">Governance expertise</Label>
                  <Textarea id="governanceExpertise" rows={3} value={form.governanceExpertise} onChange={(e) => update("governanceExpertise", e.target.value)} disabled={loading} placeholder="Finance, audit, legal, risk, DEI, etc." />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-xl font-semibold">Alignment</h2>
                <div>
                  <Label htmlFor="motivation">Motivation *</Label>
                  <Textarea id="motivation" rows={4} value={form.motivation} onChange={(e) => update("motivation", e.target.value)} disabled={loading} />
                  {errors.motivation && <p className="mt-1 text-xs text-destructive">{errors.motivation}</p>}
                </div>
                <div>
                  <Label htmlFor="conflictsDisclosure">Conflicts of interest to disclose</Label>
                  <Textarea id="conflictsDisclosure" rows={3} value={form.conflictsDisclosure} onChange={(e) => update("conflictsDisclosure", e.target.value)} disabled={loading} placeholder="None, or list any" />
                </div>
              </section>

              <div className="flex items-start gap-3">
                <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} disabled={loading} />
                <Label htmlFor="consent" className="text-sm leading-snug">
                  I confirm the information above is accurate and consent to Humanity Pathways
                  Global processing this application for board nomination review.
                </Label>
              </div>

              {submitError && (
                <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Submitting…" : "Submit Board Application"}
              </Button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
