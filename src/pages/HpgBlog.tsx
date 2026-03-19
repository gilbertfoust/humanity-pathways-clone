import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Loader2 } from "lucide-react";

interface BlogPost {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  thumbnail: string;
  content: string;
}

const TUMBLR_RSS = "https://humanitypathwaysglobal.tumblr.com/rss";
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(TUMBLR_RSS)}`;

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

export default function HpgBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(RSS2JSON_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ok" && data.items) {
          setPosts(data.items);
        } else {
          setError("Could not load blog posts.");
        }
      })
      .catch(() => setError("Could not load blog posts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Blog" subtitle="Stories, updates, and insights from our global community" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button asChild variant="outline">
                <a href="https://humanitypathwaysglobal.tumblr.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Visit our Tumblr
                </a>
              </Button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No posts yet. Check back soon!</p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const image = post.thumbnail || extractFirstImage(post.content || post.description);
              const excerpt = stripHtml(post.description).slice(0, 180);
              const date = new Date(post.pubDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <motion.div
                  key={post.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                      {image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={image}
                            alt={post.title || "Blog post"}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3" />
                          {date}
                        </div>
                        {post.title && (
                          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        )}
                        {excerpt && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{excerpt}…</p>
                        )}
                        <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
                          Read more <ExternalLink className="ml-1 h-3 w-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              );
            })}
          </div>

          {posts.length > 0 && (
            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <a href="https://humanitypathwaysglobal.tumblr.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> View all posts on Tumblr
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
