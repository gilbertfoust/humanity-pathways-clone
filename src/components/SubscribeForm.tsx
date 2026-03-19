import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Store subscriber locally for now.
    // Connect Lovable Cloud to persist subscribers and send emails.
    try {
      const existing = JSON.parse(localStorage.getItem("hpg_subscribers") || "[]") as string[];
      if (existing.includes(result.data.email)) {
        toast({ title: "Already subscribed", description: "You're already on our list!" });
      } else {
        existing.push(result.data.email);
        localStorage.setItem("hpg_subscribers", JSON.stringify(existing));
        toast({ title: "Subscribed!", description: "Thank you for joining our mailing list." });
        setEmail("");
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
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

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
      </motion.div>
    </section>
  );
}
