import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function MegaBridgeKenya() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="MegaBridge Kenya" subtitle="Kenya 🌉" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Strengthening Educational Infrastructure</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">MegaBridge Kenya strengthens educational infrastructure and community empowerment through capacity building in East Africa. The initiative focuses on bridging gaps in education access, teacher training, and school resources to create lasting impact.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">By partnering with Kenyan schools and community leaders, MegaBridge builds sustainable educational pathways that empower youth and strengthen communities from the ground up.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
