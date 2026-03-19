import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function HopeForAGoodLife() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Hope for a Good Life" subtitle="Rwanda 🌱" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Sustainable Youth & Community Development</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Hope for a Good Life nurtures sustainable youth and community development in Rwanda through education and skill-building programs. The initiative empowers Rwandan youth with practical skills, educational support, and mentorship to build brighter futures.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">By investing in education, vocational training, and community leadership, Hope for a Good Life creates lasting pathways out of poverty and toward self-sufficiency.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
