import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const executives = [
  {
    name: "Gilbert Foust",
    role: "Chairperson",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_5059.JPG",
    bio: "Gilbert Foust earned an AA & BA in International Studies, and a MA in Professional Communications. His professional experience encompasses two decades of international community project development. His proficiency in linguistics, coupled with 30 years of leadership and mentorship experience forms the backbone of HPG's educational initiatives.",
  },
  {
    name: "Rodrigo Azeredo",
    role: "Vice-Chair",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/1560905290614.jpg",
    bio: "Rodrigo Azeredo is a seasoned Compliance and Risk Management professional with over 20 years of global expertise in corporate integrity, governance, and operational resilience. Fluent in English, Spanish, and Portuguese, his MBA and legal background equip him to guide boards through complex regulatory landscapes.",
  },
  {
    name: "Myron Mageto",
    role: "Treasurer",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/81d90cd6-4fe5-46c4-8499-ff53bc54c9b7.jpg",
    bio: "Mr. Mageto attained a B.A. in Theological Studies and graduate studies in International Management. He made contributions to NATO as a TVET advisor and the U.S. Departments of State and Defense. With intercultural engagement spanning over 70 countries, his experiences yield strategic insight for HPG.",
  },
  {
    name: "Anastasia Windi",
    role: "Secretary",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Anastasia%20Windy.jpg",
    bio: "Since our founding, Humanity Pathways Global has helped thousands of individuals and families in our community. From providing emergency assistance to helping people find stable housing, we are proud of the impact we have made.",
  },
  {
    name: "Shawn McDonough",
    role: "Board Member",
    img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/unnamed.jpg",
    bio: "Shawn McDonough is a seasoned senior executive with over three decades of experience. He worked in Europe for 10 years and extensively across Asia, bringing a comprehensive global perspective to HPG.",
  },
];

const committees = [
  { chair: "Colin Hill", role: "Fund Development Chair / Nominations Chair" },
  { chair: "Cheryl Hardcastle", role: "Compensations Committee" },
  { chair: "Myron Mageto", role: "Finance Committee Chair" },
  { chair: "Shawn McDonough", role: "Compliance Committee Chair" },
];

const members = [
  "Kadar Sheikhmous — Fund Development",
  "James Miller — Advisory Committee",
  "William White — Fund Development",
  "Kashish Tuteja — Nominations Committee",
  "Christie Nelson — Nominations Chair",
  "Robert Williams — Advisory Committee",
  "Gaurav Kaushik — Finance Committee",
];

export default function HpgBoard() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Board of Directors" subtitle="Executive Committee & Board Members" />

      {/* Executive Committee */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">Executive Committee</h2>
          <div className="space-y-16">
            {executives.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col items-center gap-8 md:flex-row ${i % 2 ? "md:flex-row-reverse" : ""}`}
              >
                <img
                  src={person.img}
                  alt={person.name}
                  className="h-56 w-56 flex-shrink-0 rounded-full object-cover shadow-lg"
                />
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">{person.name}, {person.role}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Chairs */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">Board Committee Chairpersons</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {committees.map((c) => (
              <div key={c.chair + c.role} className="rounded-lg bg-card p-5 shadow-sm">
                <h4 className="font-display text-lg font-bold text-foreground">{c.chair}</h4>
                <p className="text-sm text-primary">{c.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Members */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">Board Committee Members</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {members.map((m) => (
              <li key={m} className="rounded-lg border border-border bg-card p-4 text-sm text-foreground">{m}</li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
