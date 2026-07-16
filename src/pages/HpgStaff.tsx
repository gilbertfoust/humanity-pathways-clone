import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import TeamExplorer from "@/components/TeamExplorer";
import { motion } from "framer-motion";
import { CABINET, STAFF } from "@/data/team";

export default function HpgStaff() {
  const directory = STAFF.filter((m) => !m.isCabinet);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Staff" subtitle="Meet the team driving our global mission" />

      {/* Executive Cabinet */}
      <section className="bg-background py-20" aria-labelledby="cabinet-heading">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            id="cabinet-heading"
            className="mb-12 text-center font-display text-3xl font-bold text-foreground"
          >
            Executive Cabinet
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {CABINET.map((person, i) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    loading="lazy"
                    className="mx-auto h-48 w-48 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-foreground shadow-md"
                  >
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                  {person.name}
                </h3>
                <p className="text-sm font-medium text-primary">{person.title}</p>
                {person.bio && (
                  <p className="mt-2 text-sm text-muted-foreground">{person.bio}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Globe + Directory */}
      <TeamExplorer scope="all" title="Global Team" subtitle="Explore staff and board" />

      {/* Static Staff Directory (non-cabinet) */}
      <section className="bg-muted py-20" aria-labelledby="staff-directory-heading">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            id="staff-directory-heading"
            className="mb-10 text-center font-display text-3xl font-bold text-foreground"
          >
            Staff Directory
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {directory.map((person, i) => (
              <motion.li
                key={person.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg bg-card p-4 shadow-sm"
              >
                <a
                  href={`#p=${person.id}`}
                  onClick={(e) => {
                    // Update URL search param for deep link + scroll to explorer
                    e.preventDefault();
                    const url = new URL(window.location.href);
                    url.searchParams.set("p", person.id);
                    window.history.replaceState(
                      window.history.state,
                      "",
                      url.toString()
                    );
                    document
                      .getElementById("hpg-team-heading")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    // Force TeamExplorer to pick it up
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <h4 className="font-display text-base font-bold text-foreground">
                    {person.name}
                  </h4>
                  <p className="text-xs text-primary">{person.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {person.dept} · {person.country}
                  </p>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
