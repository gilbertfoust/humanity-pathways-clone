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
import { annualReports, impactReports } from "@/data/annualReports";

const renderAt = (path: string, ui: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>
  );

describe("Public information pages", () => {
  it("renders Reports & Impact", () => {
    renderAt("/annual-reports", <AnnualReports />);
    expect(
      screen.getByRole("heading", { level: 1, name: /reports & impact/i })
    ).toBeInTheDocument();
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

describe("Reports & Impact library", () => {
  it("every financial report PDF exists as a nonempty file", () => {
    for (const r of annualReports) {
      expect(r.href.startsWith("/reports/")).toBe(true);
      expect(r.href.endsWith(".pdf")).toBe(true);
      const abs = resolve(process.cwd(), "public", r.href.replace(/^\//, ""));
      const stat = statSync(abs);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(1000);
    }
  });

  it("every impact report PDF exists and is nontrivial", () => {
    expect(impactReports.length).toBeGreaterThan(0);
    for (const r of impactReports) {
      expect(r.href.startsWith("/reports/")).toBe(true);
      expect(r.href.endsWith(".pdf")).toBe(true);
      const abs = resolve(process.cwd(), "public", r.href.replace(/^\//, ""));
      const stat = statSync(abs);
      expect(stat.isFile()).toBe(true);
      expect(stat.size).toBeGreaterThan(5000);
    }
  });

  it("renders an Impact Reports section containing the 2024-2025 report card with badges and links", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const impactSection = screen.getByRole("region", { name: /^impact reports$/i });
    for (const r of impactReports) {
      expect(
        within(impactSection).getByRole("heading", { level: 3, name: r.title })
      ).toBeInTheDocument();
      const badges = within(impactSection).getByLabelText(
        new RegExp(`report status badges for ${r.title}`, "i")
      );
      expect(within(badges).getByText(/management-prepared/i)).toBeInTheDocument();
      expect(within(badges).getByText(/impact report/i)).toBeInTheDocument();
      const view = within(impactSection).getByRole("link", {
        name: new RegExp(`view ${r.title} pdf`, "i"),
      });
      expect(view).toHaveAttribute("href", r.href);
      expect(view).toHaveAttribute("target", "_blank");
      const dl = within(impactSection).getByRole("link", {
        name: new RegExp(`download ${r.title} pdf`, "i"),
      });
      expect(dl).toHaveAttribute("href", r.href);
      expect(dl).toHaveAttribute("download");
    }
  });

  it("renders an Annual Financial Reports section with each report, badges, and view/download links", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const section = screen.getByRole("region", { name: /annual financial reports/i });
    for (const r of annualReports) {
      expect(
        within(section).getByRole("heading", { level: 3, name: r.title })
      ).toBeInTheDocument();
      const view = within(section).getByRole("link", {
        name: new RegExp(`view ${r.title} pdf`, "i"),
      });
      expect(view).toHaveAttribute("href", r.href);
      expect(view).toHaveAttribute("target", "_blank");
      expect(view).toHaveAttribute("rel", expect.stringContaining("noopener"));
      const dl = within(section).getByRole("link", {
        name: new RegExp(`download ${r.title} pdf`, "i"),
      });
      expect(dl).toHaveAttribute("href", r.href);
      expect(dl).toHaveAttribute("download");
    }
  });

  it("shows the preliminary/unaudited notice for each flagged financial report", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const flaggedCount = annualReports.filter((r) => r.preliminary || r.unaudited).length;
    const notes = screen.queryAllByRole("note", { name: /preliminary and unaudited notice/i });
    expect(notes.length).toBe(flaggedCount);
  });

  it("includes both 2024 and 2025 financial entries with stable hrefs", () => {
    const byYear = Object.fromEntries(annualReports.map((r) => [r.year, r]));
    expect(byYear[2024].href).toBe(
      "/reports/HPG_2024_Preliminary_Annual_Financial_Report.pdf"
    );
    expect(byYear[2025].href).toBe(
      "/reports/HPG_2025_Preliminary_Annual_Financial_Report.pdf"
    );
  });

  it("sorts newer financial reports first (2025 before 2024)", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const section = screen.getByRole("region", { name: /annual financial reports/i });
    const headings = within(section)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent ?? "");
    const i2025 = headings.findIndex((t) => t.includes("2025 Preliminary"));
    const i2024 = headings.findIndex((t) => t.includes("2024 Preliminary"));
    expect(i2025).toBeGreaterThanOrEqual(0);
    expect(i2024).toBeGreaterThan(i2025);
  });

  it("renders separate Preliminary and Unaudited badges for each financial report", () => {
    renderAt("/annual-reports", <AnnualReports />);
    for (const r of annualReports.filter((x) => x.preliminary && x.unaudited)) {
      const group = screen.getByLabelText(
        new RegExp(`report status badges for ${r.title}`, "i")
      );
      expect(within(group).getByText(/^preliminary$/i)).toBeInTheDocument();
      expect(within(group).getByText(/^unaudited$/i)).toBeInTheDocument();
    }
  });

  it("shows the library overview note, publication disclosure, and 2024-vs-2025 comparison", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const overview = screen.getByRole("region", { name: /library overview/i });
    expect(overview.textContent ?? "").toMatch(/impact report/i);
    expect(overview.textContent ?? "").toMatch(/annual financial reports/i);

    const disclosure = screen.getByRole("region", { name: /publication disclosure/i });
    expect(disclosure.textContent ?? "").toMatch(
      /management-prepared preliminary publications/i
    );
    expect(disclosure.textContent ?? "").toMatch(/reissued/i);

    const compare = screen.getByRole("region", { name: /comparison of reporting years/i });
    expect(compare.textContent ?? "").toMatch(/incomplete historical bank coverage/i);
    expect(compare.textContent ?? "").toMatch(/complete connected bank coverage/i);
    expect(compare.textContent ?? "").toMatch(/documentation and governance approvals remain open/i);
  });

  it("does not describe listed reports as final, audited, board-approved, or an IRS filing", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const main = screen.getByRole("main");
    expect(main.textContent ?? "").not.toMatch(/\b(audited(?! )|board-approved|IRS filing|Form 990 filed)\b/i);
  });
});

describe("Footer legal navigation", () => {
  it("links to every public information page, using Reports & Impact label", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation", { name: /legal and policy/i });
    const expected: Array<[RegExp, string]> = [
      [/reports & impact/i, "/annual-reports"],
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
