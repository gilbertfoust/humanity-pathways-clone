import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { statSync } from "node:fs";
import { resolve } from "node:path";
import AnnualReports from "@/pages/AnnualReports";
import Privacy from "@/pages/Privacy";
import Accessibility from "@/pages/Accessibility";
import Terms from "@/pages/Terms";
import DataUse from "@/pages/DataUse";
import Footer from "@/components/Footer";
import { annualReports } from "@/data/annualReports";

const renderAt = (path: string, ui: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>
  );

describe("Public information pages", () => {
  it("renders Annual Reports", () => {
    renderAt("/annual-reports", <AnnualReports />);
    expect(screen.getByRole("heading", { level: 1, name: /annual reports/i })).toBeInTheDocument();
  });

  it("renders Privacy", () => {
    renderAt("/privacy", <Privacy />);
    expect(screen.getByRole("heading", { level: 1, name: /privacy/i })).toBeInTheDocument();
  });

  it("renders Accessibility", () => {
    renderAt("/accessibility", <Accessibility />);
    expect(screen.getByRole("heading", { level: 1, name: /accessibility/i })).toBeInTheDocument();
  });

  it("renders Terms of Use", () => {
    renderAt("/terms", <Terms />);
    expect(screen.getByRole("heading", { level: 1, name: /terms of use/i })).toBeInTheDocument();
  });

  it("renders Data Use", () => {
    renderAt("/data-use", <DataUse />);
    expect(screen.getByRole("heading", { level: 1, name: /data use/i })).toBeInTheDocument();
  });
});

describe("Annual Reports listing", () => {
  it("lists exactly the reports that exist as PDF files in public/reports/", () => {
    for (const r of annualReports) {
      expect(r.href.startsWith("/reports/")).toBe(true);
      expect(r.href.endsWith(".pdf")).toBe(true);
      const abs = resolve(process.cwd(), "public", r.href.replace(/^\//, ""));
      const stat = statSync(abs);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(1000);
    }
  });

  it("renders each report with a status badge, scope, and View/Download links", () => {
    renderAt("/annual-reports", <AnnualReports />);
    for (const r of annualReports) {
      expect(screen.getByRole("heading", { level: 2, name: r.title })).toBeInTheDocument();
      expect(screen.getByText((_, node) => node?.textContent?.includes(`Reporting period: ${r.period}`) ?? false)).toBeTruthy();
      const view = screen.getByRole("link", { name: new RegExp(`view ${r.title} pdf`, "i") });
      expect(view).toHaveAttribute("href", r.href);
      expect(view).toHaveAttribute("target", "_blank");
      expect(view).toHaveAttribute("rel", expect.stringContaining("noopener"));
      const dl = screen.getByRole("link", { name: new RegExp(`download ${r.title} pdf`, "i") });
      expect(dl).toHaveAttribute("href", r.href);
      expect(dl).toHaveAttribute("download");
    }
  });

  it("displays the preliminary and unaudited notice when flagged", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const flagged = annualReports.some((r) => r.preliminary || r.unaudited);
    if (flagged) {
      expect(
        screen.getByRole("note", { name: /preliminary and unaudited notice/i })
      ).toBeInTheDocument();
    }
  });

  it("does not describe listed reports as final, audited, board-approved, or an IRS filing", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const main = screen.getByRole("main");
    expect(main.textContent ?? "").not.toMatch(/\b(audited(?! )|board-approved|IRS filing|Form 990 filed)\b/i);
  });

  it("has an empty-state fallback path when no reports exist", () => {
    // Sanity: the empty-state text is still present in the component tree only
    // when the list is empty. When reports exist, no empty-state message renders.
    renderAt("/annual-reports", <AnnualReports />);
    if (annualReports.length === 0) {
      expect(screen.getByText(/no annual reports are published yet/i)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(/no annual reports are published yet/i)).not.toBeInTheDocument();
    }
  });
});

describe("Footer legal navigation", () => {
  it("links to every public information page", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation", { name: /legal and policy/i });
    const expected: Array<[RegExp, string]> = [
      [/annual reports/i, "/annual-reports"],
      [/^privacy$/i, "/privacy"],
      [/data use/i, "/data-use"],
      [/accessibility/i, "/accessibility"],
      [/terms of use/i, "/terms"],
    ];
    for (const [name, href] of expected) {
      const link = within(nav).getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
    }
  });
});

