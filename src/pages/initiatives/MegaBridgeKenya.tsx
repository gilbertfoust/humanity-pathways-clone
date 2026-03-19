import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Droplets, Sun, TreePine, Stethoscope, Wheat, Zap } from "lucide-react";

const projects = [
  { icon: <Droplets className="h-6 w-6 text-accent" />, title: "Gatumbi Water Project", desc: "Bringing clean water to 3,000 people with minimal environmental waste and community-managed operations." },
  { icon: <Sun className="h-6 w-6 text-accent" />, title: "Solar Panel Access Project", desc: "Providing 10,000 households with affordable clean energy using a flexible daily PAYG model." },
  { icon: <TreePine className="h-6 w-6 text-accent" />, title: "Greening Schools Initiative", desc: "Planting indigenous and fruit trees in 10,000 schools to improve ecosystems, provide food, and create shade." },
  { icon: <Stethoscope className="h-6 w-6 text-accent" />, title: "Miomponi Community Clinic", desc: "A 30,000-person capacity rural clinic designed for affordability, sanitation, and rapid deployment within 12 months of funding." },
  { icon: <Wheat className="h-6 w-6 text-accent" />, title: "Kiburine Farmer Support", desc: "Helping peasant farmers increase income by 40-50% through value-added processing and post-harvest support systems." },
  { icon: <Zap className="h-6 w-6 text-accent" />, title: "Off-Grid School Solar Project", desc: "Bringing sustainable energy and power resilience to 25 schools in Tharaka Nithi County." },
];

const impact = [
  "1.2M trees planted through agroforestry",
  "400K trees in Mount Kenya forest restoration",
  "900+ women empowered via goat-keeping",
  "100 beehives distributed for conservation",
  "15,000 farmers trained in sustainable agriculture",
  "5,000 farmers received free seeds",
  ">90% project success rate across all programs",
];

export default function MegaBridgeKenya() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Megabridge Foundation" subtitle="Empowering Communities Across Kenya and East Africa" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">About Us</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Megabridge Foundation is a registered nonprofit organization in Kenya dedicated to improving lives through sustainable development. From water access to healthcare, education, and environmental restoration, our goal is to build self-reliant, thriving communities throughout East Africa.
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Mission: To empower communities by improving access to health, education, clean energy, sustainable agriculture, and environmental stewardship.
            </p>
          </motion.div>

          {/* Flagship Projects */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Flagship Projects</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
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

          {/* Impact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 rounded-lg bg-primary p-8">
            <h2 className="font-display text-2xl font-bold text-primary-foreground">Our Impact</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {impact.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-primary-foreground/80">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <div className="mt-16 text-center space-y-3">
            <h2 className="font-display text-2xl font-bold text-foreground">To Contribute To Us Truly Doing The Work</h2>
            <p className="text-sm text-muted-foreground">
              Our U.S.-based fiscal sponsor, <strong>Humanity Pathways Global</strong>, enables tax-deductible contributions and global collaboration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button asChild size="lg">
                <a href="mailto:development@humanitypathwaysglobal.com?subject=MegaBridge%20Kenya%20Support">
                  <Mail className="mr-2 h-4 w-4" /> Contact Development
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Location: Nairobi, Kenya • Fiscal Sponsor: Humanity Pathways Global, Detroit, MI, USA
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
