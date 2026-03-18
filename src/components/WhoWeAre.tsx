import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import umbrellaImg from "@/assets/who-umbrella.jpg";
import teamImg from "@/assets/who-team.jpg";
import youthImg from "@/assets/who-youth.jpg";

const cards = [
  {
    image: umbrellaImg,
    title: "The HPG Umbrella",
    description:
      "At Humanity Pathways Global, our commitment goes beyond basic education to include vocational training and leadership development, empowering communities to overcome economic and social inequalities. Through global partnerships we strive to ensure that essential services are accessible to all.",
    link: "/hpg-vision",
    linkText: "Get Our Vision",
  },
  {
    image: teamImg,
    title: "Our Team",
    description:
      "Meet the driving force behind Humanity Pathways Global — our dedicated team. Comprised of passionate educators, visionary leaders, and community advocates, our team is united by a common goal: to empower and uplift. Each member brings unique expertise and an unwavering commitment to our mission.",
    link: "/hpg-staff",
    linkText: "Know Us",
  },
  {
    image: youthImg,
    title: "Global Youth Leaders For Humanity",
    description:
      "Global Youth Leaders for Humanity (GYLFH) is our first initiative under the HPG umbrella to mold the next generation of world changers. Focused on cultivating skills in leadership, diplomacy, and social advocacy, GYLFH prepares young leaders to tackle global challenges head-on.",
    link: "/gylfh",
    linkText: "See Our Impact",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

export default function WhoWeAre() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl font-light text-foreground md:text-5xl">
            Who We Are
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-muted-foreground/30" />
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="group text-center"
            >
              <Link to={card.link} className="block overflow-hidden rounded-sm">
                <img
                  src={card.image}
                  alt={card.title}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <h3 className="mt-6 font-display text-2xl font-medium text-foreground">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              <Link
                to={card.link}
                className="mt-4 inline-block border-b border-foreground/30 pb-0.5 text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-foreground"
              >
                {card.linkText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
