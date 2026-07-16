import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      const msg = result.error.errors[0].message;
      setSubmitError(msg);
      toast({ title: "Invalid email", description: msg, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-newsletter", {
        body: { email: result.data.email, _hp: hp, idempotencyKey: idempotencyKeyRef.current },
      });
      if (error || !data?.success) {
        const msg = (data as { error?: string } | null)?.error || error?.message ||
          "Something went wrong. Please try again.";
        setSubmitError(msg);
        toast({ title: "Signup failed", description: msg, variant: "destructive" });
        return;
      }
      if (data.alreadySubscribed) {
        toast({ title: "Already subscribed", description: "You're already on our list!" });
      } else {
        toast({ title: "Subscribed!", description: `Reference: ${data.referenceId}` });
      }
      setEmail("");
      idempotencyKeyRef.current = crypto.randomUUID();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setSubmitError(msg);
      toast({ title: "Signup failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-secondary py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl px-4 text-center"
      >
        <h2 className="font-display text-3xl font-light text-foreground md:text-4xl">
          Subscribe
        </h2>
        <div className="mx-auto mt-4 h-px w-16 bg-muted-foreground/30" />
        <p className="mt-6 text-muted-foreground">
          Sign up to be the first to get updates.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
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
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="flex-1 border-border bg-background"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Signing up…" : "Sign Up"}
          </Button>
        </form>
        {submitError && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {submitError}
          </p>
        )}
      </motion.div>
    </section>
  );
}
