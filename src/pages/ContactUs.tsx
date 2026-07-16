import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

export default function ContactUs() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [hp, setHp] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{ referenceId: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: { ...result.data, _hp: hp, idempotencyKey: idempotencyKeyRef.current },
      });
      if (error || !data?.success) {
        const msg = (data as { error?: string } | null)?.error || error?.message ||
          "We couldn't send your message. Please try again.";
        setSubmitError(msg);
        toast({ title: "Submission failed", description: msg, variant: "destructive" });
        return;
      }
      setSubmitted({ referenceId: data.referenceId });
      toast({ title: "Message sent!", description: `Reference: ${data.referenceId}` });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setSubmitError(msg);
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Contact Us" subtitle="We'd love to hear from you" />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            {submitted ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 font-display text-2xl font-semibold">Message received</h3>
                <p className="mt-2 text-muted-foreground">
                  Thank you — we'll be in touch shortly.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Reference: <span className="font-mono font-medium text-foreground">{submitted.referenceId}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Honeypot */}
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
                <div>
                  <Input placeholder="Your Name *" value={form.name} onChange={(e) => update("name", e.target.value)} disabled={loading} />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Input placeholder="Email Address *" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} disabled={loading} />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <Input placeholder="Subject *" value={form.subject} onChange={(e) => update("subject", e.target.value)} disabled={loading} />
                  {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
                </div>
                <div>
                  <Textarea placeholder="Your Message *" rows={6} value={form.message} onChange={(e) => update("message", e.target.value)} disabled={loading} />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
                {submitError && (
                  <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {submitError}
                  </div>
                )}
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}

            {/* Info */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">Office Address</h4>
                  <p className="text-sm text-muted-foreground">220 West Congress Street Ste 698, Detroit, MI, USA</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">Phone</h4>
                  <p className="text-sm text-muted-foreground">Contact us through the form or social media</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">Email</h4>
                  <p className="text-sm text-muted-foreground">info@humanitypathwaysglobal.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">Business Hours</h4>
                  <p className="text-sm text-muted-foreground">Monday – Friday: 9:00 AM – 5:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
