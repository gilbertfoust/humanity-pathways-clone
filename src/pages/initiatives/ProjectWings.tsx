import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Heart, Briefcase, Users } from "lucide-react";

const DONATE_URL =
  "https://www.every.org/humanity-pathways-global?suggestedAmounts=50%2C250%2C500%2C1000%2C10000&theme_color=D20103&designation=Project+Wings&utm_campaign=donate-link";

export default function ProjectWings() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Project Wings" subtitle="Soaring Beyond Survival • Chicago, USA" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Recovery that could support family stability and work readiness.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Project Wings is designed to support women through recovery, reconnection, and job readiness.
              This page provides a transparent funding model showing how resources could translate into services.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Donate via Every.org
                </a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Donations are processed through Every.org under Humanity Pathways Global and designated to Project Wings.
            </p>
          </motion.div>

          {/* Core Programs */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Core Programs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Heart className="h-6 w-6 text-accent" />,
                title: "Recovery & healing workshops",
                desc: "Trauma-informed group sessions, peer support, coping tools, and relapse-prevention planning.",
                examples: "Attendance, completion, referrals followed, participant feedback.",
              },
              {
                icon: <Briefcase className="h-6 w-6 text-accent" />,
                title: "Job readiness",
                desc: "Coaching, resumes, interviews, digital basics, and employer connections for stable work steps.",
                examples: "Training hours, interviews scheduled, placements verified.",
              },
              {
                icon: <Users className="h-6 w-6 text-accent" />,
                title: "Family reunification support",
                desc: "Navigation and wraparound support to reconnect mothers with children and loved ones.",
                examples: "Service plans completed, documented milestones, follow-ups.",
              },
            ].map((p) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-3">{p.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                    <p className="mt-3 text-xs text-muted-foreground/70 italic">Examples: {p.examples}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 rounded-lg bg-muted p-8">
            <h2 className="font-display text-2xl font-bold text-foreground text-center">Partner, fund, or request documents</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="font-semibold text-foreground">Direct contact</h3>
                <p className="mt-2 text-sm text-muted-foreground">Request proposal packets, budget narratives, or partnership discussions.</p>
                <p className="mt-3 text-sm"><strong>Representative:</strong> Joyce Macklin</p>
                <p className="text-sm"><strong>Email:</strong> <a href="mailto:projectwings44@gmail.com" className="text-primary hover:underline">projectwings44@gmail.com</a></p>
                <p className="text-sm"><strong>EIN:</strong> 92-0651328</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Workforce partnerships</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Employers can offer job-shadow days, interviews, training placements, or roles suitable for returning workers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">In-kind support</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Childcare support, transportation passes, space, laptops, program materials, and food for cohorts. These supports can increase completion rates.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button asChild>
                <a href="mailto:projectwings44@gmail.com?subject=Project%20Wings%20—%20Inquiry">
                  <Mail className="mr-2 h-4 w-4" /> Start a conversation
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
