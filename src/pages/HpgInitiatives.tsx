import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

import gylfhLogo from "@/assets/logos/gylfh-logo.png";
import nazareneLogo from "@/assets/logos/nazarene-mission-logo.png";
import megabridgeLogo from "@/assets/logos/megabridge-logo.png";
import santeLogo from "@/assets/logos/sante-vie-logo.png";
import cubaLogo from "@/assets/logos/cuba-congo-logo.png";
import triumphantLogo from "@/assets/logos/triumphant-ph-logo.png";
import wingsLogo from "@/assets/logos/project-wings-logo.png";
import hopeLogo from "@/assets/logos/hope-good-life-logo.png";
import seishinLogo from "@/assets/logos/seishin-plus-logo.png";
import cpbiLogo from "@/assets/logos/cpbi-logo.png";
import academyLogo from "@/assets/logos/executive-academy-logo.png";
import humbleLogo from "@/assets/logos/humble-pathways-logo.png";
import mkcfLogo from "@/assets/logos/mkcf-logo.png";
import stemLogo from "@/assets/logos/stem-robotics-logo.png";
import rainrootLogo from "@/assets/logos/rainroot-wata-logo.png";
import humaneLogo from "@/assets/logos/humane-initiative-logo.png";

const filters = ["All", "Africa", "USA", "Asia / Global"];

const initiatives = [
  { name: "GYLFH", logo: gylfhLogo, location: "International", region: "Asia / Global", desc: "Building ethical, globally minded young leaders through workshops and advocacy across four continents.", href: "/gylfh" },
  { name: "Youth Development Program", logo: nazareneLogo, location: "Luanda, Angola", region: "Africa", desc: "Empowering Angolan youth through leadership, education, and advocacy initiatives.", href: "/nazarene-mission" },
  { name: "MegaBridge Kenya", logo: megabridgeLogo, location: "Kenya", region: "Africa", desc: "Strengthening educational infrastructure and community empowerment through capacity building in East Africa.", href: "/megabridge-kenya" },
  { name: "Santé Vie Meilleure", logo: santeLogo, location: "Togo", region: "Africa", desc: "Advancing health education and access, improving outcomes for underserved communities through clinics and outreach.", href: "/sante-vie-meilleure" },
  { name: "CUBA Congo", logo: cubaLogo, location: "Congo", region: "Africa", desc: "Empowering youth and enhancing community health, focusing on advocacy and essential services.", href: "/cuba-congo" },
  { name: "Triumphant Philippines", logo: triumphantLogo, location: "Philippines", region: "Asia / Global", desc: "Driving local empowerment through education, youth leadership, and community-building.", href: "/triumphant-philippines" },
  { name: "Project Wings", logo: wingsLogo, location: "Chicago, USA", region: "USA", desc: "Providing safe shelter, empowerment, and reintegration support for women in the Chicago region.", href: "/project-wings" },
  { name: "Hope for a Good Life", logo: hopeLogo, location: "Rwanda", region: "Africa", desc: "Nurturing sustainable youth and community development through education and skill-building.", href: "/hope-for-a-good-life" },
  { name: "Seishin Plus", logo: seishinLogo, location: "United States", region: "USA", desc: "Promoting civic engagement and community service across the U.S. to build resilience.", href: "/seishin-plus" },
  { name: "CPBI", logo: cpbiLogo, location: "Global", region: "Asia / Global", desc: "Facilitating community-centered initiatives and conflict-sensitive programming across regions.", href: "/cpbi" },
  { name: "HPG Executive Academy", logo: academyLogo, location: "International", region: "Asia / Global", desc: "Equipping future leaders worldwide with advanced leadership and professional skills.", href: "/hpg-executive-academy" },
  { name: "Humble Pathways", logo: humbleLogo, location: "United States", region: "USA", desc: "Supporting mental health professionals and communities through AI-powered tools and culturally grounded wellness.", href: "/humble-pathways" },
  { name: "MKCF Sierra Leone", logo: mkcfLogo, location: "Sierra Leone", region: "Africa", desc: "Improving the lives of orphaned, abandoned, and vulnerable children through care and education.", href: "/mkcf-sierra-leone" },
  { name: "Youth STEM Robotics", logo: stemLogo, location: "West Africa", region: "Africa", desc: "Cultivating STEM fluency in youth through ICT labs, mobile kits, and digital literacy training.", href: "/youth-stem-robotics" },
  { name: "Rainroot WATA", logo: rainrootLogo, location: "West Africa", region: "Africa", desc: "Providing clean water and ecological sanitation through gravity-driven, modular treatment systems.", href: "/rainroot-wata" },
  { name: "Humane Initiative", logo: humaneLogo, location: "South Sudan", region: "Africa", desc: "Supporting girl-child education on sexual reproductive health, rights, and empowerment.", href: "/humane-initiative" },
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
              >
                <Link
                  to={item.href}
                  className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="h-16 w-16 object-contain"
                    loading="lazy"
                    width={64}
                    height={64}
                  />
                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.location}</p>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground">{item.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.desc}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">Learn More →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
