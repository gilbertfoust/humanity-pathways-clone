import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
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

describe("Annual Reports empty state", () => {
  it("has no reports listed in the repository", () => {
    expect(annualReports).toHaveLength(0);
  });

  it("shows the empty state and a contact path when no reports exist", () => {
    renderAt("/annual-reports", <AnnualReports />);
    expect(screen.getByText(/no annual reports are published yet/i)).toBeInTheDocument();
    const contact = screen.getByRole("link", { name: /contact humanity pathways global/i });
    expect(contact).toHaveAttribute("href", "/contact-us");
    // No fabricated report entries rendered.
    expect(screen.queryByRole("link", { name: /download/i })).not.toBeInTheDocument();
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

// local import to avoid top-of-file churn
import { within } from "@testing-library/react";
