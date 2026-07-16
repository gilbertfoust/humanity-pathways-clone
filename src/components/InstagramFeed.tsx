import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Instagram section.
 *
 * This site does not have a configured Instagram Graph API token or
 * third-party feed provider, so we do NOT render or imply a live feed.
 * Instead, this component is an honest "follow us on Instagram" panel
 * with a single external link to the official profile. It intentionally
 * does not inject Instagram's embed.js.
 */
const IG_HANDLE = "humanity_pathways_global";
const IG_URL = `https://www.instagram.com/${IG_HANDLE}`;

const InstagramFeed = () => {
  return (
    <section className="bg-background py-16" aria-labelledby="instagram-heading">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 p-10 text-center shadow-sm"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Instagram className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2
            id="instagram-heading"
            className="font-display text-3xl font-bold text-foreground"
          >
            Follow us on Instagram
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Our current posts, stories, and reels live on our official
            Instagram profile. Visit{" "}
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
              data-testid="instagram-handle-link"
            >
              @{IG_HANDLE}
            </a>{" "}
            to see the latest updates from Humanity Pathways Global.
          </p>

          <div className="mt-8">
            <Button asChild size="lg">
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open @${IG_HANDLE} on Instagram (opens in a new tab)`}
                data-testid="instagram-profile-link"
              >
                <Instagram className="mr-2 h-4 w-4" aria-hidden="true" />
                Visit @{IG_HANDLE} on Instagram
                <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/80">
            Posts are hosted on Instagram and are not embedded on this
            page. Following the link above opens Instagram in a new tab
            under Instagram's own privacy and cookie policies.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
