import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const focusAreas = [
  {
    title: "Education and Skill Development",
    integration: "Through equitable access to quality education, we lay the groundwork for self-sustaining communities.",
    steps: "Establish vocational schools, literacy programs, and provide scholarship opportunities to marginalized communities.",
  },
  {
    title: "Economic Empowerment",
    integration: "By providing the tools for economic stability, we aim to unlock the inherent potential within each individual.",
    steps: "Microloan programs, financial literacy workshops, and job placement services.",
  },
  {
    title: "Human Rights and Social Justice",
    integration: "We believe that respect for human dignity and social equity are cornerstones for any thriving community.",
    steps: "Legal aid clinics, advocacy campaigns for equal educational and economic opportunities, mental health support.",
  },
  {
    title: "Community Development",
    integration: "Our holistic approach ties each element together, aiming for an overall upliftment of the communities we serve.",
    steps: "Healthcare clinics, community centers, local governance training, and infrastructure projects like clean water systems.",
  },
];

const breakdown = [
  "Education and Skill Development: Tackling the problem of educational inequality and lack of access to vocational training.",
  "Economic Empowerment: Addressing the issue of financial instability and lack of economic opportunities in marginalized communities.",
  "Human Rights and Social Justice: Seeking to remedy social inequities, discrimination, and lack of access to justice.",
  "Community Development: Aiming to improve the overall quality of life within the community, focusing on healthcare, infrastructure, and governance.",
];

export default function HpgVision() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Mission" subtitle="Creating self-sustaining communities through holistic empowerment" />

      {/* Mission Statement */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-xl leading-relaxed text-foreground/80 italic md:text-2xl"
          >
            "Our mission at Humanity Pathways Global is to create self-sustaining communities by empowering individuals through equitable access to education, economic resources, and social justice. We are committed to nurturing holistic community development that respects human dignity and unlocks potential."
          </motion.blockquote>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">
            Integration of Focus Areas
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {focusAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg bg-card p-8 shadow-sm"
              >
                <h3 className="mb-3 font-display text-xl font-bold text-foreground">
                  {i + 1}. {area.title}
                </h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Mission Integration:</span> {area.integration}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Actionable Steps:</span> {area.steps}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tying it Together */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">Tying it All Together</h2>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            Programs within HPG are designed to be interconnected. For example, graduates from vocational schools (Education and Skill Development) are given access to microloans (Economic Empowerment) to start small businesses, provided they attend workshops on social justice and human rights, thus contributing to overall Community Development.
          </p>
          <p className="mb-10 text-muted-foreground leading-relaxed">
            By intertwining these four areas in our mission, we create a comprehensive model for change — tackling root issues in a systemic way, rather than solely isolated interventions.
          </p>

          <h3 className="mb-6 font-display text-2xl font-bold text-foreground">Here's a breakdown:</h3>
          <ul className="space-y-4">
            {breakdown.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 text-muted-foreground"
              >
                <span className="font-bold text-primary">{i + 1}.</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          <p className="mt-8 text-muted-foreground leading-relaxed">
            By weaving these focus areas into a holistic program, we aim to create a cycle of positive change: education leads to economic stability, which is bolstered by a fair and just social environment, ultimately contributing to the well-being and advancement of the entire community.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
