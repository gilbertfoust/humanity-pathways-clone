import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Cpu, Monitor, Wifi, GraduationCap } from "lucide-react";

const programs = [
  { icon: <Cpu className="h-6 w-6 text-accent" />, title: "Mobile STEM Kits", desc: "Deploying portable robotics and science kits to schools lacking permanent lab infrastructure." },
  { icon: <Monitor className="h-6 w-6 text-accent" />, title: "ICT Lab Equipment", desc: "Equipping underserved schools with computer labs and modern information technology resources." },
  { icon: <Wifi className="h-6 w-6 text-accent" />, title: "Digital Literacy & Internet Access", desc: "Providing internet connectivity and foundational digital skills training for students and teachers." },
  { icon: <GraduationCap className="h-6 w-6 text-accent" />, title: "STEM Teacher Training", desc: "Capacity building for educators to integrate robotics, coding, and scientific inquiry into curricula." },
];

export default function YouthSTEMRobotics() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Youth STEM Robotics Program" subtitle="West Africa • Building Tomorrow's Innovators" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">About the Program</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The Youth STEM Robotics Program aims to cultivate a generation of youth who are fluent in STEM disciplines across West Africa. By equipping underserved schools with ICT labs, mobile STEM kits, internet access, and digital literacy training, we're building the foundation for innovation and economic opportunity.
            </p>
          </motion.div>

          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Program Components</h2>
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

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 rounded-lg bg-muted p-8 text-center">
            <p className="text-sm text-muted-foreground">Programs are designed to be scalable, sustainable, and community-driven.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Robotics", "Coding", "Digital Literacy", "Teacher Training", "ICT Infrastructure"].map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{tag}</span>
              ))}
            </div>
          </motion.div>

          <div className="mt-12 text-center space-y-3">
            <h2 className="font-display text-2xl font-bold text-foreground">Support STEM in West Africa</h2>
            <p className="text-sm text-muted-foreground">
              Fiscal Sponsor: <strong>Humanity Pathways Global</strong>, Detroit, MI, USA
            </p>
            <Button asChild size="lg">
              <a href="mailto:development@humanitypathwaysglobal.com?subject=Youth%20STEM%20Robotics%20Support">
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
