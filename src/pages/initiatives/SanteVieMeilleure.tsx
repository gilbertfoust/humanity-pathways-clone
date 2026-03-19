import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Heart, GraduationCap, Eye } from "lucide-react";

const DONATE_URL =
  "https://www.every.org/humanity-pathways-global?theme_color=05386B&designation=SM-VM+Togo&utm_campaign=donate-link#/donate";

export default function SanteVieMeilleure() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Santé Meilleure – Vie Meilleure" subtitle="Togo (Maritime Region) • Health, Dignity, Opportunity" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Support community-led health and opportunity in Togo.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Your gift could help fund asthma screening and follow-up care, expand disability-inclusive livelihoods, and pilot immersive learning through EON VR education.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Donate now
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Status", value: "Recognized of public utility" },
              { label: "Country", value: "Togo (Maritime)" },
              { label: "President", value: "Somabey Dossavi" },
              { label: "Email", value: "info@sm-vm.com" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-muted p-4">
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Programs */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">What you would support</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { icon: <Heart className="h-6 w-6 text-accent" />, title: "Asthma Screening & Care", desc: "Community-based asthma screening, follow-up visits, and medication support for underserved populations." },
              { icon: <Eye className="h-6 w-6 text-accent" />, title: "Disability-Inclusive Livelihoods", desc: "Expanding economic opportunity for people with disabilities through skills training and micro-enterprise support." },
              { icon: <GraduationCap className="h-6 w-6 text-accent" />, title: "EON VR Education Pilot", desc: "Immersive virtual reality learning for health, science, and technical education in community settings." },
            ].map((p) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-3">{p.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Design principles */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 rounded-lg bg-muted p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Programs are designed to be deliverable, measurable, and locally governed.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Health equity", "Local partnerships", "Youth & skills", "WASH supports"].map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Support SM-VM on Every.org
              </a>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              <Mail className="inline h-3 w-3 mr-1" />
              <a href="mailto:info@sm-vm.com" className="text-primary hover:underline">info@sm-vm.com</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
