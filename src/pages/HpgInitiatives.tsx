import { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const filters = ["All", "Africa", "USA", "Asia / Global"];

const initiatives = [
  { name: "GYLFH", emoji: "🌍", location: "International", region: "Asia / Global", desc: "Building ethical, globally minded young leaders through workshops and advocacy across four continents." },
  { name: "Nazarene Mission", emoji: "🦁", location: "Luanda, Angola", region: "Africa", desc: "Empowering Angolan communities through holistic ministry, education, and healthcare initiatives." },
  { name: "MegaBridge Kenya", emoji: "🌉", location: "Kenya", region: "Africa", desc: "Strengthening educational infrastructure and community empowerment through capacity building in East Africa." },
  { name: "Santé Vie Meilleure", emoji: "💧", location: "Togo", region: "Africa", desc: "Advancing health education and access, improving outcomes for underserved communities through clinics and outreach." },
  { name: "CUBA Congo", emoji: "👦🏽", location: "Congo", region: "Africa", desc: "Empowering youth and enhancing community health, focusing on advocacy and essential services." },
  { name: "Triumphant Philippines", emoji: "🏝️", location: "Philippines", region: "Asia / Global", desc: "Driving local empowerment through education, youth leadership, and community-building." },
  { name: "Project Wings", emoji: "🪽", location: "Chicago, USA", region: "USA", desc: "Providing safe shelter, empowerment, and reintegration support for women in the Chicago region." },
  { name: "Hope for a Good Life", emoji: "🌱", location: "Rwanda", region: "Africa", desc: "Nurturing sustainable youth and community development through education and skill-building." },
  { name: "Seishin Plus", emoji: "🗽", location: "United States", region: "USA", desc: "Promoting civic engagement and community service across the U.S. to build resilience." },
  { name: "CPBI", emoji: "🕊️", location: "Global", region: "Asia / Global", desc: "Facilitating community-centered initiatives and conflict-sensitive programming across regions." },
  { name: "HPG Executive Academy", emoji: "🎓", location: "International", region: "Asia / Global", desc: "Equipping future leaders worldwide with advanced leadership and professional skills." },
];

export default function HpgInitiatives() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? initiatives : initiatives.filter((i) => i.region === active);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Initiatives" subtitle="Programs driving change across the globe" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Filter Tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <span className="text-4xl">{item.emoji}</span>
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.location}</p>
                <h3 className="mt-1 font-display text-xl font-bold text-foreground">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
