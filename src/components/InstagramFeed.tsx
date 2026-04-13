import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const IG_HANDLE = "humanity_pathways_global";
const IG_URL = `https://www.instagram.com/${IG_HANDLE}`;

const InstagramFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the SnapWidget free Instagram feed widget
    const script = document.createElement("script");
    script.src = "https://snapwidget.com/js/snapwidget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
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

        {/* Live Instagram feed via iframe embed */}
        <div ref={containerRef} className="flex justify-center">
          <iframe
            src={`https://snapwidget.com/embed/1086498`}
            className="snapwidget-widget w-full max-w-5xl border-0 overflow-hidden"
            allowTransparency
            style={{ border: "none", overflow: "hidden", height: 400 }}
            title="Instagram Feed"
            loading="lazy"
          />
        </div>

        {/* Fallback grid linking to IG profile */}
        <noscript>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <a
                key={i}
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <Instagram className="h-8 w-8 text-foreground/40" />
                </div>
              </a>
            ))}
          </div>
        </noscript>

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
