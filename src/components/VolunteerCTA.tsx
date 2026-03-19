import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import volunteerImg from "@/assets/volunteer-cta.jpg";

export default function VolunteerCTA() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={volunteerImg}
        alt="Volunteers working together"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/70" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-4 py-20 text-center lg:py-28"
      >
        <h2 className="font-display text-3xl font-semibold text-primary-foreground md:text-5xl">
          🌐 Make an Impact from Anywhere
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
          Lend your time, your skills, and your heart… right from home! Join
          HPG's global team of virtual volunteers supporting humanitarian
          projects around the world.
        </p>
        <p className="mt-4 text-lg font-bold text-accent">
          Because change doesn't wait, and neither should you!
        </p>
        <Link
          to="/volunteer-application"
          className="mt-8 inline-block rounded bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Volunteer
        </Link>
      </motion.div>
    </section>
  );
}
