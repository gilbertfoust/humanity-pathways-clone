import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import TeamExplorer from "@/components/TeamExplorer";
import { motion } from "framer-motion";
import { BOARD, EXECUTIVE_COMMITTEE, TEAM } from "@/data/team";

export default function HpgBoard() {
  const committeeMembers = TEAM.filter((m) => m.committees.length > 0);
  const committeeChairs = committeeMembers.filter((m) =>
    m.committees.some((c) => /chair/i.test(c))
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Board of Directors" subtitle="Executive Committee & Board Members" />

      {/* Executive Committee */}
      <section className="bg-background py-20" aria-labelledby="exec-heading">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            id="exec-heading"
            className="mb-12 text-center font-display text-3xl font-bold text-foreground"
          >
            Executive Committee
          </h2>
          <div className="space-y-16">
            {EXECUTIVE_COMMITTEE.map((person, i) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col items-center gap-8 md:flex-row ${
                  i % 2 ? "md:flex-row-reverse" : ""
                }`}
              >
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    loading="lazy"
                    className="h-56 w-56 flex-shrink-0 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-56 w-56 flex-shrink-0 items-center justify-center rounded-full bg-primary text-5xl font-bold text-primary-foreground shadow-lg"
                  >
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {person.name}, {person.title}
                  </h3>
                  {person.bio && (
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {person.bio}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Explorer (globe scoped to board only) */}
      <TeamExplorer scope="board" title="Board Members Around the World" />

      {/* Committee Chairs */}
      <section className="bg-muted py-16" aria-labelledby="chairs-heading">
        <div className="mx-auto max-w-4xl px-4">
          <h2
            id="chairs-heading"
            className="mb-8 text-center font-display text-3xl font-bold text-foreground"
          >
            Board Committee Chairpersons
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {committeeChairs.map((c) => (
              <li key={c.id} className="rounded-lg bg-card p-5 shadow-sm">
                <h4 className="font-display text-lg font-bold text-foreground">
                  {c.name}
                </h4>
                <p className="text-sm text-primary">
                  {c.committees.filter((x) => /chair/i.test(x)).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Committee Members */}
      <section className="bg-background py-16" aria-labelledby="members-heading">
        <div className="mx-auto max-w-4xl px-4">
          <h2
            id="members-heading"
            className="mb-8 text-center font-display text-3xl font-bold text-foreground"
          >
            Board Committee Members
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {committeeMembers
              .filter((m) => !m.committees.some((c) => /chair/i.test(c)))
              .map((m) => (
                <li
                  key={m.id}
                  className="rounded-lg border border-border bg-card p-4 text-sm text-foreground"
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground"> — {m.committees.join(", ")}</span>
                </li>
              ))}
          </ul>

          {/* Full board roster fallback */}
          {BOARD.length > 0 && (
            <p className="mt-6 text-center text-xs text-muted-foreground">
              {BOARD.length} board member{BOARD.length !== 1 ? "s" : ""} in total.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
