import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function SanteVieMeilleure() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Santé Vie Meilleure" subtitle="Togo 💧" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Advancing Health Education & Access</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Santé Vie Meilleure advances health education and access, improving outcomes for underserved communities in Togo through clinics and outreach programs. The initiative addresses critical healthcare gaps by providing medical services, health education, and preventive care.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Through community health workers and mobile clinics, the program reaches remote areas, delivering essential healthcare services and empowering communities to take charge of their health outcomes.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
