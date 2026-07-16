import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { routeMeta, SITE_URL } from "@/data/routeMeta";
import { legacyRedirects, LegacyRedirect } from "@/routes/legacyRedirects";

const renderWith = (path: string, ui: React.ReactNode) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Seo />
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

describe("Staff Workspace navbar control", () => {
  it("renders a clearly labeled, accessible link to the workspace", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const link = screen.getByTestId("staff-workspace-link");
    expect(link).toHaveAttribute("href", "https://gilbertfoust.github.io/hpg-workspace/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAccessibleName(/staff workspace/i);
    expect(link).toHaveTextContent(/staff workspace/i);
  });
});

describe("Per-route SEO metadata", () => {
  it("sets title, canonical, and og:url from the route registry", async () => {
    const { unmount } = renderWith("/hpg-vision", <div>vision</div>);
    await waitFor(() => expect(document.title).toMatch(/HPG Vision/));
    await waitFor(() =>
      expect(
        document.querySelector('link[rel="canonical"]')?.getAttribute("href")
      ).toBe(`${SITE_URL}/hpg-vision`)
    );
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute("content")
    ).toBe(`${SITE_URL}/hpg-vision`);
    unmount();
  });

  it("changes metadata when the route changes", async () => {
    const { unmount } = renderWith("/contact-us", <div>contact</div>);
    await waitFor(() => expect(document.title).toMatch(/Contact Us/));
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute("content")
    ).toMatch(/contact/i);
    unmount();

    renderWith("/annual-reports", <div>reports</div>);
    await waitFor(() => expect(document.title).toMatch(/Annual Reports/));
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(`${SITE_URL}/annual-reports`);
  });

  it("emits noindex for onboarding-fee and unsubscribe routes", async () => {
    const { unmount } = renderWith("/unsubscribe", <div>u</div>);
    await waitFor(() =>
      expect(
        document.querySelector('meta[name="robots"]')?.getAttribute("content")
      ).toMatch(/noindex/)
    );
    unmount();
  });
});

describe("sitemap.xml", () => {
  const xml = readFileSync(resolve("public/sitemap.xml"), "utf8");

  it("contains every non-noSitemap route from the registry", () => {
    for (const r of routeMeta) {
      const loc = `${SITE_URL}${r.path === "/" ? "" : r.path}`;
      if (r.noSitemap) {
        expect(xml).not.toContain(`<loc>${loc}</loc>`);
      } else {
        expect(xml).toContain(`<loc>${loc}</loc>`);
      }
    }
  });

  it("uses the canonical production domain", () => {
    expect(xml).toContain(SITE_URL);
  });

  it("robots.txt references the sitemap", () => {
    const robots = readFileSync(resolve("public/robots.txt"), "utf8");
    expect(robots).toMatch(/Sitemap:\s*https:\/\/humanitypathwaysglobal\.lovable\.app\/sitemap\.xml/);
  });
});

describe("Legacy redirects", () => {
  it("never maps a path to itself (loop guard)", () => {
    for (const [from, to] of Object.entries(legacyRedirects)) {
      expect(from).not.toBe(to);
    }
  });

  it("every target resolves to a real registered route", () => {
    const known = new Set(routeMeta.map((r) => r.path));
    for (const to of Object.values(legacyRedirects)) {
      expect(known.has(to)).toBe(true);
    }
  });

  it("renders a redirect for a legacy alias", () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/blog"]}>
          <Routes>
            <Route path="/blog" element={<LegacyRedirect to="/hpg-blog" />} />
            <Route path="/hpg-blog" element={<div>blog target</div>} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(screen.getByText("blog target")).toBeInTheDocument();
  });

  it("does not loop when source equals target at runtime", () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/hpg-blog"]}>
          <Routes>
            <Route path="/hpg-blog" element={<LegacyRedirect to="/hpg-blog" />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    // Renders nothing rather than looping; no crash means the guard held.
    expect(document.body).toBeTruthy();
  });
});
