import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function SeishinPlus() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Seishin Plus" subtitle="United States 🗽" />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Civic Engagement & Community Service</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Seishin Plus promotes civic engagement and community service across the United States to build resilience in local communities. The program inspires individuals to take active roles in their communities through volunteerism, advocacy, and service projects.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">By fostering a culture of service and civic participation, Seishin Plus strengthens the social fabric of communities and empowers individuals to drive meaningful change.</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
