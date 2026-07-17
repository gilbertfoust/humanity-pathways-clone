import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ExternalLink, Download, AlertTriangle, Info, Sparkles } from "lucide-react";
import {
  annualReports,
  impactReports,
  type AnnualReport,
  type ImpactReport,
} from "@/data/annualReports";

function Badge({ label, tone }: { label: string; tone: "warn" | "muted" | "info" }) {
  const cls =
    tone === "warn"
      ? "bg-accent/20 text-accent-foreground ring-1 ring-accent/60"
      : tone === "info"
        ? "bg-primary/10 text-primary ring-1 ring-primary/40"
        : "bg-muted text-muted-foreground ring-1 ring-border";
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide " +
        cls
      }
    >
      {label}
    </span>
  );
}

function ImpactReportCard({ r }: { r: ImpactReport }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            <Sparkles className="mt-1 h-7 w-7 shrink-0 text-primary" aria-hidden />
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {r.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Reporting period: {r.period}
              </p>
              {r.meta && <p className="text-xs text-muted-foreground">{r.meta}</p>}
            </div>
          </div>
          <div
            className="flex flex-wrap gap-2"
            aria-label={`Report status badges for ${r.title}`}
          >
            {r.badges.map((b) => (
              <Badge key={b} label={b} tone="info" />
            ))}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {r.description}
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild variant="default">
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${r.title} PDF in a new tab`}
            >
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
              View PDF
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={r.href} download aria-label={`Download ${r.title} PDF`}>
              <Download className="mr-2 h-4 w-4" aria-hidden />
              Download PDF
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportCard({ r }: { r: AnnualReport }) {
  const flagged = r.preliminary || r.unaudited;
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            <FileText className="mt-1 h-7 w-7 shrink-0 text-primary" aria-hidden />
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {r.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Reporting period: {r.period}
              </p>
              {r.meta && <p className="text-xs text-muted-foreground">{r.meta}</p>}
            </div>
          </div>
          <div
            className="flex flex-wrap gap-2"
            aria-label={`Report status badges for ${r.title}`}
          >
            {r.preliminary && <Badge label="Preliminary" tone="warn" />}
            {r.unaudited && <Badge label="Unaudited" tone="warn" />}
            {!r.preliminary && !r.unaudited && (
              <Badge label={r.status} tone="muted" />
            )}
          </div>
        </div>

        {flagged && (
          <div
            role="note"
            aria-label={`Preliminary and unaudited notice for ${r.title}`}
            className="flex items-start gap-3 rounded-md border border-accent/40 bg-accent/10 p-3 text-sm text-foreground"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <p>
              This report is <strong>preliminary and unaudited</strong>. It is
              management-prepared and is not an independent accountant's report and not a
              substitute for an IRS Form 990-series filing, a state filing, or a bank
              statement.
            </p>
          </div>
        )}

        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Scope:</span> {r.scopeSummary}
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild variant="default">
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${r.title} PDF in a new tab`}
            >
              <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
              View PDF
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={r.href} download aria-label={`Download ${r.title} PDF`}>
              <Download className="mr-2 h-4 w-4" aria-hidden />
              Download PDF
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnnualReports() {
  const sortedFinancials = annualReports.slice().sort((a, b) => b.year - a.year);
  const nothingPublished = sortedFinancials.length === 0 && impactReports.length === 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Reports & Impact"
        subtitle="HPG's impact reporting and financial accountability publications, housed together"
      />
      <main className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          {nothingPublished ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground" aria-hidden />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  No reports are published yet
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Humanity Pathways Global has not yet posted a report on this site.
                  When a report is finalized, it will be listed here for public download.
                </p>
                <Button asChild className="mt-2">
                  <Link to="/contact-us" aria-label="Contact Humanity Pathways Global">
                    <Mail className="mr-2 h-4 w-4" aria-hidden />
                    Contact Us
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <section
                aria-label="Library overview"
                className="mb-8 rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-foreground"
              >
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <p>
                    The <strong>impact report</strong> documents organizational
                    capacity, program delivery, and evidence gaps for the reporting
                    period, while the <strong>annual financial reports</strong>{" "}
                    document the accounting results and internal controls. Both are
                    management-prepared and are not independent evaluations or audits.
                  </p>
                </div>
              </section>

              {impactReports.length > 0 && (
                <section aria-label="Impact Reports" className="mb-12">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Impact Reports
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Evidence-based summaries of program delivery and organizational
                    development.
                  </p>
                  <ul className="mt-6 space-y-6" aria-label="Available impact reports">
                    {impactReports.map((r) => (
                      <li key={r.id}>
                        <ImpactReportCard r={r} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {sortedFinancials.length > 0 && (
                <section aria-label="Annual Financial Reports">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Annual Financial Reports
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Preliminary, management-prepared financial statements for each
                    reporting year.
                  </p>

                  <section
                    aria-label="Publication disclosure"
                    className="mt-4 mb-6 rounded-lg border border-accent/40 bg-accent/10 p-5 text-sm leading-relaxed text-foreground"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                      <p>
                        <strong>Publication disclosure.</strong> Both financial reports
                        listed here are{" "}
                        <strong>management-prepared preliminary publications</strong>{" "}
                        released for public transparency. They are not independent
                        accountant's reports and are not substitutes for an IRS Form
                        990-series filing, a state filing, or a bank statement. Each
                        report will be reissued after closing and governance approval
                        work is completed.
                      </p>
                    </div>
                  </section>

                  <ul className="space-y-6" aria-label="Available annual financial reports">
                    {sortedFinancials.map((r) => (
                      <li key={r.href}>
                        <ReportCard r={r} />
                      </li>
                    ))}
                  </ul>

                  <section
                    aria-label="Comparison of reporting years"
                    className="mt-10 rounded-lg border border-border bg-card p-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      How the 2024 and 2025 reports differ
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Both reports are preliminary and unaudited, but the underlying
                      coverage is different:
                    </p>
                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-md border border-border bg-background p-4">
                        <dt className="font-semibold text-foreground">2024</dt>
                        <dd className="mt-1 text-sm text-muted-foreground">
                          Known-item only, with{" "}
                          <strong>incomplete historical bank coverage</strong>. Amounts
                          reflect only activity that could be controlled and reconciled to
                          available source records.
                        </dd>
                      </div>
                      <div className="rounded-md border border-border bg-background p-4">
                        <dt className="font-semibold text-foreground">2025</dt>
                        <dd className="mt-1 text-sm text-muted-foreground">
                          <strong>Complete connected bank coverage</strong> for the period,
                          but <strong>documentation and governance approvals remain open</strong>.
                          Presentation may change as those items are completed.
                        </dd>
                      </div>
                    </dl>
                  </section>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
