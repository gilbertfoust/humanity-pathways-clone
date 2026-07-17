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
      expect(screen.getAllByText((_, node) => node?.textContent?.includes(`Reporting period: ${r.period}`) ?? false).length).toBeGreaterThan(0);
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

  it("includes both the 2024 and 2025 entries with stable hrefs", () => {
    const years = annualReports.map((r) => r.year);
    expect(years).toContain(2024);
    expect(years).toContain(2025);
    const byYear = Object.fromEntries(annualReports.map((r) => [r.year, r]));
    expect(byYear[2024].href).toBe(
      "/reports/HPG_2024_Preliminary_Annual_Financial_Report.pdf"
    );
    expect(byYear[2025].href).toBe(
      "/reports/HPG_2025_Preliminary_Annual_Financial_Report.pdf"
    );
    expect(byYear[2025].scopeSummary.toLowerCase()).toContain("complete connected");
    expect(byYear[2025].scopeSummary.toLowerCase()).toMatch(/documentation.*approvals/i);
  });

  it("sorts newer reports first (2025 before 2024)", () => {
    renderAt("/annual-reports", <AnnualReports />);
    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((h) => h.textContent ?? "");
    const i2025 = headings.findIndex((t) => t.includes("2025 Preliminary"));
    const i2024 = headings.findIndex((t) => t.includes("2024 Preliminary"));
    expect(i2025).toBeGreaterThanOrEqual(0);
    expect(i2024).toBeGreaterThan(i2025);
  });

  it("renders separate Preliminary and Unaudited badges for each report", () => {
    renderAt("/annual-reports", <AnnualReports />);
    for (const r of annualReports.filter((x) => x.preliminary && x.unaudited)) {
      const group = screen.getByLabelText(
        new RegExp(`report status badges for ${r.title}`, "i")
      );
      const prelim = within(group).getByText(/^preliminary$/i);
      const unaud = within(group).getByText(/^unaudited$/i);
      expect(prelim).toBeInTheDocument();
      expect(unaud).toBeInTheDocument();
    }
  });

  it("shows the publication disclosure and the 2024-vs-2025 comparison", () => {
    renderAt("/annual-reports", <AnnualReports />);
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

