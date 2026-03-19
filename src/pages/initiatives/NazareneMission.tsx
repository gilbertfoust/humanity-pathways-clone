import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function NazareneMission() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Nazarene Mission" subtitle="Luanda, Angola 🦁" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Empowering Angolan Communities</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Nazarene Mission empowers Angolan communities through holistic ministry, education, and healthcare initiatives. Working in Luanda, the program addresses critical needs by providing access to quality education, health services, and spiritual support for underserved populations.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Through partnerships with local churches and community organizations, Nazarene Mission creates sustainable pathways for community development, focusing on youth education, maternal health, and vocational training.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
