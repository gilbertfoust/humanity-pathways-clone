// Central registry of annual reports actually available in this repository.
// Add entries here ONLY when a corresponding file is committed to /public/reports/.
// If this array is empty, the Annual Reports page renders an empty state and
// points visitors to the Contact page.

export interface AnnualReport {
  year: number;
  title: string;
  /** Path relative to site root, e.g. "/reports/2024-annual-report.pdf" */
  href: string;
  /** Optional plain-text description of the file (size, format). */
  meta?: string;
}

export const annualReports: AnnualReport[] = [];
