import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import sponsorImg from "@/assets/fiscal-sponsorship.jpg";

export default function FiscalSponsorship() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={sponsorImg}
        alt="Community partnership"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/60" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-4 py-20 text-center lg:py-28"
      >
        <h2 className="font-display text-3xl font-semibold text-primary-foreground md:text-5xl">
          🌐 Have a Project That Serves the Community?
        </h2>
        <p className="mt-6 text-xl font-bold text-accent">
          Apply for Fiscal Sponsorship and Grow With Us
        </p>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
          Join a network of purpose-driven leaders transforming education,
          service, and impact — with our support behind you!
        </p>
        <Link
          to="/hpg-sponsorship"
          className="mt-8 inline-block rounded bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Apply Here
        </Link>
      </motion.div>
    </section>
  );
}
