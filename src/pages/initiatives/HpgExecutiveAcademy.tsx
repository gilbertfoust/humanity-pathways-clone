import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function HpgExecutiveAcademy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Executive Academy" subtitle="International 🎓" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Advanced Leadership & Professional Skills</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">The HPG Executive Academy equips future leaders worldwide with advanced leadership and professional skills through intensive training programs, mentorship, and executive education curricula.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Participants gain expertise in strategic planning, organizational management, nonprofit governance, and impact measurement — preparing them to lead mission-driven organizations with excellence and integrity.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
