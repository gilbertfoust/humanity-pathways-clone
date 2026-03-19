import { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactUs() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setForm({ name: "", email: "", subject: "", message: "" });
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input placeholder="Your Name *" value={form.name} onChange={(e) => update("name", e.target.value)} />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Input placeholder="Email Address *" value={form.email} onChange={(e) => update("email", e.target.value)} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Input placeholder="Subject *" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
                {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
              </div>
              <div>
                <Textarea placeholder="Your Message *" rows={6} value={form.message} onChange={(e) => update("message", e.target.value)} />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full">Send Message</Button>
            </form>

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
