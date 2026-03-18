import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import hero6 from "@/assets/hero-6.jpg";

const slides = [
  { image: hero1, title: "Help Us Make an Impact" },
  { image: hero2, title: "Help Us Expand Our Reach" },
  { image: hero3, title: "Support Our Mission" },
  { image: hero4, title: "Volunteer Today" },
  { image: hero5, title: "Every Community Matters" },
  { image: hero6, title: "Join Our Team" },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ marginTop: "var(--nav-height)" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/30" />
        </motion.div>
      </AnimatePresence>

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl font-light tracking-wide text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {slides[current].title}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-3 w-3 rounded-full border-2 border-primary-foreground/60 transition-all ${
              i === current ? "bg-primary-foreground" : "bg-transparent"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
