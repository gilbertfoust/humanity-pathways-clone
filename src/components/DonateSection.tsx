import { motion } from "framer-motion";
import donateImg from "@/assets/donate-cause.jpg";

export default function DonateSection() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={donateImg}
        alt="Community unity"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/75" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl px-4 py-20 text-center lg:py-28"
      >
        <h2 className="font-display text-3xl font-semibold text-primary-foreground md:text-5xl">
          Help Our Cause
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
          Your support and contributions will enable us to meet our goals and
          fund our mission.
        </p>
        <a
          href="https://www.zeffy.com/donation-form/532895b9-f579-4ba0-86e8-f39c75665988"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Donate
        </a>
      </motion.div>
    </section>
  );
}
