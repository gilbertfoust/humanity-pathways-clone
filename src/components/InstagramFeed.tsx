import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const IG_HANDLE = "humanity_pathways_global";
const IG_URL = `https://www.instagram.com/${IG_HANDLE}`;

// Use Instagram's oEmbed to show a live profile embed
const InstagramFeed = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Instagram embed script
    if (!(window as any).instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        (window as any).instgrm?.Embeds?.process();
        setLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      (window as any).instgrm.Embeds.process();
      setLoaded(true);
    }
  }, []);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Instagram className="h-6 w-6 text-foreground" />
            <h2 className="font-display text-3xl font-bold text-foreground">Instagram</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Follow{" "}
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              @{IG_HANDLE}
            </a>{" "}
            for the latest updates
          </p>
        </motion.div>

        {/* Grid of recent IG post embeds — shows placeholder tiles that link to the profile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.a
              key={i}
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300">
                <Instagram className="h-8 w-8 text-foreground/40 group-hover:text-foreground/70 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <a href={IG_URL} target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-4 w-4" />
              Follow us on Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
