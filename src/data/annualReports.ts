// Central registry of annual reports actually available in this repository.
// Add entries here ONLY when a corresponding file is committed to /public/reports/.
// If this array is empty, the Annual Reports page renders an empty state and
// points visitors to the Contact page.

export interface AnnualReport {
  year: number;
  title: string;
  /** Path relative to site root, e.g. "/reports/2024-annual-report.pdf" */
  href: string;
  /** Reporting period, human-readable. */
  period: string;
  /** Short status label rendered as a badge (e.g. "Preliminary • Unaudited"). */
  status: string;
  /** Brief scope description. */
  scopeSummary: string;
  /** True when this is a preliminary (not final) release. */
  preliminary: boolean;
  /** True when the report has NOT been independently audited. */
  unaudited: boolean;
  /** Optional plain-text description of the file (size, format). */
  meta?: string;
}

export const annualReports: AnnualReport[] = [
  {
    year: 2025,
    title: "2025 Preliminary Annual Financial Report",
    href: "/reports/HPG_2025_Preliminary_Annual_Financial_Report.pdf",
    period: "January 1 – December 31, 2025",
    status: "Preliminary • Unaudited",
    scopeSummary:
      "Complete connected Relay operating checking history (account ending 7674) plus approved accrual and noncash entries and approved support for Humble Pathways, Project Wings Soaring, and Global Youth Leaders for Humanity. Bank reconciliation is reconciled and trial balance passes; documentation and governance approvals remain open.",
    preliminary: true,
    unaudited: true,
    meta: "PDF • Management-prepared",
  },
  {
    year: 2024,
    title: "2024 Preliminary Annual Financial Report",
    href: "/reports/HPG_2024_Preliminary_Annual_Financial_Report.pdf",
    period: "January 1 – December 31, 2024",
    status: "Preliminary • Unaudited",
    scopeSummary:
      "HPG-only known activity from the Relay operating checking account (ending 7674) plus approved accrual and noncash entries. Savings and sponsored-project subaccounts are excluded; historical bank backfill and opening/closing balances remain open.",
    preliminary: true,
    unaudited: true,
    meta: "PDF • Management-prepared",
  },
];
