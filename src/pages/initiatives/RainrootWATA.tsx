import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Droplets, TreePine, Recycle, MapPin } from "lucide-react";

const features = [
  { icon: <Droplets className="h-6 w-6 text-accent" />, title: "Gravity-Driven Water Treatment", desc: "A modular, gravity-driven ecological treatment chain that requires no electricity or complex machinery." },
  { icon: <TreePine className="h-6 w-6 text-accent" />, title: "Ecological Design", desc: "Systems adaptable to local topography, community scale, and available natural resources." },
  { icon: <Recycle className="h-6 w-6 text-accent" />, title: "Sustainable Sanitation", desc: "Integrated WASH (Water, Sanitation & Hygiene) solutions for long-term community health." },
  { icon: <MapPin className="h-6 w-6 text-accent" />, title: "Multi-Country Reach", desc: "Operating across Nigeria, Burkina Faso, Niger, Ghana (northern), and Sierra Leone." },
];

export default function RainrootWATA() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Rainroot WATA" subtitle="West Africa • Clean Water & Ecological Sanitation" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">About Rainroot WATA</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Rainroot WATA provides clean water and ecological sanitation across West Africa through a modular, gravity-driven treatment chain. Our systems are adaptable to local topography, community scale, and resource availability — delivering sustainable clean water without dependence on electricity or complex infrastructure.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {["Nigeria", "Burkina Faso", "Niger", "Ghana (North)", "Sierra Leone"].map((c) => (
              <div key={c} className="rounded-lg bg-muted p-3">
                <p className="text-sm font-bold text-foreground">{c}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">How It Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-3">{f.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center space-y-3">
            <h2 className="font-display text-2xl font-bold text-foreground">Support Clean Water Access</h2>
            <p className="text-sm text-muted-foreground">
              Fiscal Sponsor: <strong>Humanity Pathways Global</strong>, Detroit, MI, USA
            </p>
            <Button asChild size="lg">
              <a href="mailto:development@humanitypathwaysglobal.com?subject=Rainroot%20WATA%20Support">
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
