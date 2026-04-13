import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Home, BookOpen, Heart, Users } from "lucide-react";

const programs = [
  { icon: <Home className="h-6 w-6 text-accent" />, title: "Safe Shelter & Care", desc: "Providing safe, nurturing environments for orphaned, abandoned, and vulnerable children in Sierra Leone." },
  { icon: <BookOpen className="h-6 w-6 text-accent" />, title: "Education Access", desc: "Ensuring every child has access to quality education, school supplies, and academic support." },
  { icon: <Heart className="h-6 w-6 text-accent" />, title: "Health & Nutrition", desc: "Comprehensive healthcare, nutrition programs, and psychosocial support for children's well-being." },
  { icon: <Users className="h-6 w-6 text-accent" />, title: "Community Integration", desc: "Programs to support family reunification and community-based care for vulnerable children." },
];

export default function MKCFSierraLeone() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Mohamed Kanu Children's Foundation" subtitle="Sierra Leone • Protecting Vulnerable Children" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">About MKCF</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The Mohamed Kanu Children's Foundation (MKCF) is dedicated to improving the lives of orphaned, abandoned, and vulnerable children in Sierra Leone. Through comprehensive care, education, and community support, MKCF works to ensure every child has the opportunity to thrive.
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Fiscal Sponsorship Goal: Grow and manage donor funds responsibly while meeting the legal and financial requirements expected by international supporters.
            </p>
          </motion.div>

          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">What We Do</h2>
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
            <h2 className="font-display text-2xl font-bold text-foreground">Support MKCF</h2>
            <p className="text-sm text-muted-foreground">
              Fiscal Sponsor: <strong>Humanity Pathways Global</strong>, Detroit, MI, USA
            </p>
            <Button asChild size="lg">
              <a href="mailto:development@humanitypathwaysglobal.com?subject=MKCF%20Sierra%20Leone%20Support">
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
