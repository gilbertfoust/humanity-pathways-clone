import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InstagramFeed from "@/components/InstagramFeed";

const IG_URL = "https://www.instagram.com/humanity_pathways_global";

describe("InstagramFeed (link-only fallback)", () => {
  it("does not inject the Instagram embed script", () => {
    render(<InstagramFeed />);
    const scripts = document.querySelectorAll(
      'script[src*="instagram.com/embed.js"]'
    );
    expect(scripts.length).toBe(0);
  });

  it("renders no fake post grid — only a small number of external links", () => {
    render(<InstagramFeed />);
    const igLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[href]")
    ).filter((a) => a.href.startsWith("https://www.instagram.com/"));
    // Handle + primary CTA button = 2 links. A fake 6-tile grid would push this to 8+.
    expect(igLinks.length).toBeLessThanOrEqual(3);
    expect(igLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("shows a correctly labeled external profile link", () => {
    render(<InstagramFeed />);
    const link = screen.getByTestId("instagram-profile-link");
    expect(link).toHaveAttribute("href", IG_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAccessibleName(/instagram/i);
    expect(link).toHaveAccessibleName(/new tab/i);
  });

  it("states clearly that posts are not embedded on this page", () => {
    render(<InstagramFeed />);
    expect(
      screen.getByText(/not embedded on this page/i)
    ).toBeInTheDocument();
  });

  it("does not describe itself as a live feed of recent posts", () => {
    render(<InstagramFeed />);
    const body = document.body.textContent ?? "";
    expect(body).not.toMatch(/recent posts?/i);
    expect(body).not.toMatch(/live feed/i);
  });
});
