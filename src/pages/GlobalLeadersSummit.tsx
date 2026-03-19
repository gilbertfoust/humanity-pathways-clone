import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function GlobalLeadersSummit() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Global Leaders Summit" subtitle="Empowering the next generation of change-makers" />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg bg-card p-8 shadow-sm"
          >
            <h2 className="font-display text-2xl font-bold text-foreground">Next Gen Virtual Teen Summit</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The Global Leaders Summit brings together youth from around the world for workshops, mentorship sessions, and collaborative projects focused on leadership development, social justice, and community impact.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Details for the next summit will be announced soon. Check back for registration information, speaker lineup, and event schedule.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
