import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function TriumphantPhilippines() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Triumphant Philippines" subtitle="Philippines 🏝️" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Driving Local Empowerment</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Triumphant Philippines drives local empowerment through education, youth leadership, and community-building across the Philippine islands. The initiative creates opportunities for young Filipinos to develop leadership skills and contribute to their communities.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Through educational programs, mentorship networks, and community development projects, Triumphant Philippines is building a generation of empowered leaders committed to positive change.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
