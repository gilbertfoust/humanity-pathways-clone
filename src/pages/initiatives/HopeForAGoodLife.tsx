import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, BookOpen, Shield, Stethoscope, Wallet } from "lucide-react";

const DONATE_URL = "https://hopeforagoodlife.org/donation.php";

const pillars = [
  { icon: <BookOpen className="h-6 w-6 text-accent" />, title: "Education Sponsorship", desc: "School fees and supplies that help children remain enrolled and supported.", bullets: ["Uniforms and learning materials", "Support to reduce dropout risk"] },
  { icon: <Shield className="h-6 w-6 text-accent" />, title: "Street Children & Youth Development", desc: "Psychosocial counseling, basic needs, and reintegration support with families.", bullets: ["Outreach and follow-up", "Family reunification support"] },
  { icon: <Stethoscope className="h-6 w-6 text-accent" />, title: "Health & Nutrition", desc: "Access to care for vulnerable youth; support that addresses wellbeing and resilience.", bullets: ["Medical visits and access support", "Nutrition and wellbeing guidance"] },
  { icon: <Wallet className="h-6 w-6 text-accent" />, title: "Economic & Financial Development", desc: "Skills, savings practices, and market-linked training so households can build stable income (often centered on women and youth).", bullets: [] },
];

export default function HopeForAGoodLife() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Hope for a Good Life (HGL)" subtitle="Bugesera District, Rwanda • Children • Youth • Women" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Community-led support that helps families move from survival to stability.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              HGL is a local NGO in Bugesera, Rwanda, supporting vulnerable children, youth, and women through education sponsorship, rehabilitation for street-connected youth, health and nutrition support, and economic strengthening.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Donate (HGL)
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://hopeforagoodlife.org/" target="_blank" rel="noopener noreferrer">Visit HGL site</a>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Prefer to coordinate a grant, in-kind support, or pooled giving? Email{" "}
              <a href="mailto:development@humanitypathwaysglobal.com?subject=HGL%20Rwanda%20Support" className="text-primary hover:underline font-semibold">development@humanitypathwaysglobal.com</a>
            </p>
          </motion.div>

          {/* Quick Facts */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Started", value: "2016" },
              { label: "Legal Personality", value: "No350/RGB/NGO/LP/11/2018" },
              { label: "Base", value: "Nyamata, Bugesera" },
              { label: "Contact", value: "info@hopeforagoodlife.org" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-muted p-4">
                <p className="text-sm font-bold text-foreground break-all">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Mission & Vision */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-foreground">Mission, vision, and local collaboration</h2>
            <p className="mt-4 text-sm text-muted-foreground"><strong>Mission:</strong> Support people facing harsh life conditions by meeting basic and psychosocial needs, providing education and skills, restoring hope, and helping reintegrate participants as valued members of society.</p>
            <p className="mt-2 text-sm text-muted-foreground"><strong>Vision:</strong> Every person lives with dignity and flourishes fully in every society.</p>
            <p className="mt-2 text-sm text-muted-foreground"><strong>Values:</strong> Dignity, compassion, tolerance, humility, integrity.</p>
          </motion.div>

          {/* Four Pillars */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Four ways support reaches families</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {pillars.map((p) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-3">{p.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                    {p.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {p.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Activity highlight */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 rounded-lg bg-accent/10 border border-accent/30 p-6 text-center">
            <p className="text-sm text-foreground">
              <strong>2024 Activity Note:</strong> HGL's 2024 activity report documents <strong>124</strong> street-connected children who received psychosocial counseling over a three-month period.
            </p>
          </motion.div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Donate to HGL
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
