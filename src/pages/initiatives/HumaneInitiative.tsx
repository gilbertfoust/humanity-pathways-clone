import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Heart, BookOpen, Shield, Users } from "lucide-react";

const programs = [
  { icon: <Heart className="h-6 w-6 text-accent" />, title: "Sexual & Reproductive Health Education", desc: "Age-appropriate education on sexual health, reproduction, and bodily autonomy for girls in Central Equatoria." },
  { icon: <BookOpen className="h-6 w-6 text-accent" />, title: "Girl-Child Education", desc: "Supporting girl-child education on sex, reproduction, and human rights to break cycles of misinformation." },
  { icon: <Shield className="h-6 w-6 text-accent" />, title: "Rights & Protection", desc: "Advocating for girls' rights and providing safe spaces for discussion, support, and empowerment." },
  { icon: <Users className="h-6 w-6 text-accent" />, title: "Community Engagement", desc: "Working with families, community leaders, and local institutions to create supportive environments." },
];

export default function HumaneInitiative() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Humane Initiative" subtitle="South Sudan • Girls' Health, Rights & Education" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">About Humane Initiative</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Humane Initiative South Sudan focuses on Sexual Reproductive Health for girls in Central Equatoria. By supporting girl-child education on sex, reproduction, and human rights, we work to empower young women with the knowledge and support they need to make informed decisions about their health and futures.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {[
              { label: "Region", value: "Central Equatoria" },
              { label: "Country", value: "South Sudan" },
              { label: "Focus", value: "Girls' SRH & Rights" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-muted p-4">
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Our Programs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {programs.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
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

          <div className="mt-16 text-center space-y-3">
            <h2 className="font-display text-2xl font-bold text-foreground">Support Girls' Education</h2>
            <p className="text-sm text-muted-foreground">
              Fiscal Sponsor: <strong>Humanity Pathways Global</strong>, Detroit, MI, USA
            </p>
            <Button asChild size="lg">
              <a href="mailto:development@humanitypathwaysglobal.com?subject=Humane%20Initiative%20South%20Sudan">
                <Mail className="mr-2 h-4 w-4" /> Contact Development
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
