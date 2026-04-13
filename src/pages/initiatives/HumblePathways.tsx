import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Brain, Heart, Smartphone, Shield } from "lucide-react";

const programs = [
  { icon: <Brain className="h-6 w-6 text-accent" />, title: "AI-Powered Documentation Tools", desc: "Supporting mental health professionals with intelligent documentation that reduces burnout and administrative burden." },
  { icon: <Heart className="h-6 w-6 text-accent" />, title: "Burnout Prevention Strategies", desc: "Evidence-based programs for community members and caregivers to build resilience and sustain well-being." },
  { icon: <Smartphone className="h-6 w-6 text-accent" />, title: "Digital Wellness Resources", desc: "Culturally grounded digital tools promoting mental health awareness, self-care, and healthy technology use." },
  { icon: <Shield className="h-6 w-6 text-accent" />, title: "Culturally Grounded Healing", desc: "Holistic approaches to mental health that honor diverse cultural practices and community wisdom." },
];

export default function HumblePathways() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Humble Pathways" subtitle="Mental Health, Healing & Digital Wellness • United States" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">About Humble Pathways</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Humble Pathways is dedicated to supporting mental health professionals and community members through AI-powered documentation tools, burnout prevention strategies, and culturally grounded wellness resources. We believe that healing starts with accessible, compassionate support systems.
            </p>
          </motion.div>

          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Core Programs</h2>
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
            <h2 className="font-display text-2xl font-bold text-foreground">Get Involved</h2>
            <p className="text-sm text-muted-foreground">
              Fiscal Sponsor: <strong>Humanity Pathways Global</strong>, Detroit, MI, USA
            </p>
            <Button asChild size="lg">
              <a href="mailto:development@humanitypathwaysglobal.com?subject=Humble%20Pathways%20Inquiry">
                <Mail className="mr-2 h-4 w-4" /> Contact Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
