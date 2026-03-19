import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ProjectWings() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Project Wings" subtitle="Chicago, USA 🪽" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Safe Shelter & Empowerment</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Project Wings provides safe shelter, empowerment, and reintegration support for women in the Chicago region. The initiative addresses the critical need for transitional housing and comprehensive support services for women overcoming difficult circumstances.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Through housing assistance, job training, counseling, and community support networks, Project Wings helps women rebuild their lives with dignity and independence.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
