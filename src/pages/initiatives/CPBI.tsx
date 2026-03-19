import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function CPBI() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="CPBI" subtitle="Global 🕊️" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Community-Centered Initiatives</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">CPBI facilitates community-centered initiatives and conflict-sensitive programming across regions worldwide. The program works at the intersection of peacebuilding, community development, and social cohesion to create lasting positive change.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Through dialogue facilitation, capacity building, and collaborative programming, CPBI helps communities navigate complex challenges and build resilient, inclusive societies.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
