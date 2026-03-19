import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import gylfhBanner from "@/assets/gylfh-banner.jpg";
import gylfhLogo from "@/assets/gylfh-logo.png";

export default function GYLFH() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="GYLFH" subtitle="Global Youth Leaders For Humanity" />

      {/* Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={gylfhBanner} alt="GYLFH Banner" className="h-full w-full object-cover" />
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <img src={gylfhLogo} alt="GYLFH Logo" className="mb-8 h-32 w-32 object-contain" />
            <h2 className="font-display text-3xl font-bold text-foreground">Global Youth Leaders For Humanity</h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              GYLFH builds ethical, globally minded young leaders through workshops and advocacy across four continents. The program equips youth with leadership skills, cross-cultural understanding, and the tools to drive positive change in their communities.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { title: "Leadership Workshops", desc: "Hands-on sessions developing critical thinking, public speaking, and ethical decision-making." },
              { title: "Global Advocacy", desc: "Youth-led campaigns addressing social justice, education access, and community empowerment." },
              { title: "Cross-Cultural Exchange", desc: "Connecting young leaders across continents to share perspectives and collaborate on solutions." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
