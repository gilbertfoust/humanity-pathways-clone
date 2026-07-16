// Runs before `vite dev` and `vite build`; writes public/sitemap.xml
// from the central route registry in src/data/routeMeta.ts.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { routeMeta, SITE_URL } from "../src/data/routeMeta.ts";

const now = new Date().toISOString().slice(0, 10);

const entries = routeMeta.filter((r) => !r.noSitemap);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${SITE_URL}${e.path === "/" ? "" : e.path}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      `    <changefreq>${e.changefreq ?? "monthly"}</changefreq>`,
      `    <priority>${e.priority ?? "0.7"}</priority>`,
      `  </url>`,
    ].join("\n")
  ),
  `</urlset>`,
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
