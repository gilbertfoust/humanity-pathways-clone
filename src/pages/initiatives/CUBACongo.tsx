import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function CUBACongo() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="CUBA Congo" subtitle="Congo 👦🏽" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Empowering Youth & Community Health</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">CUBA Congo empowers youth and enhances community health in the Democratic Republic of Congo, focusing on advocacy and essential services. The program provides educational support, healthcare access, and leadership development for young people in underserved communities.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Through targeted interventions in health education, youth mentorship, and community advocacy, CUBA Congo creates pathways for sustainable development and empowerment.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
