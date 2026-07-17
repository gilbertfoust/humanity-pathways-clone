import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ExternalLink, Download, AlertTriangle } from "lucide-react";
import { annualReports } from "@/data/annualReports";

export default function AnnualReports() {
  const sorted = annualReports.slice().sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Annual Reports"
        subtitle="A public record of Humanity Pathways Global's yearly reporting"
      />
      <main className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          {sorted.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground" aria-hidden />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  No annual reports are published yet
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Humanity Pathways Global has not yet posted an annual report on this
                  site. When a report is finalized, it will be listed here for public
                  download. In the meantime, please reach out with any questions about
                  our programs, governance, or activities.
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
            <ul className="space-y-6" aria-label="Available annual reports">
              {sorted.map((r) => {
                const flagged = r.preliminary || r.unaudited;
                return (
                  <li key={r.href}>
                    <Card>
                      <CardContent className="flex flex-col gap-4 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-4">
                            <FileText
                              className="mt-1 h-7 w-7 shrink-0 text-primary"
                              aria-hidden
                            />
                            <div>
                              <h2 className="font-display text-xl font-semibold text-foreground">
                                {r.title}
                              </h2>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Reporting period: {r.period}
                              </p>
                              {r.meta && (
                                <p className="text-xs text-muted-foreground">{r.meta}</p>
                              )}
                            </div>
                          </div>
                          <span
                            className={
                              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide " +
                              (flagged
                                ? "bg-accent/20 text-accent-foreground ring-1 ring-accent/60"
                                : "bg-muted text-muted-foreground")
                            }
                            aria-label={`Report status: ${r.status}`}
                          >
                            {r.status}
                          </span>
                        </div>

                        {flagged && (
                          <div
                            role="note"
                            aria-label="Preliminary and unaudited notice"
                            className="flex items-start gap-3 rounded-md border border-accent/40 bg-accent/10 p-3 text-sm text-foreground"
                          >
                            <AlertTriangle
                              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                              aria-hidden
                            />
                            <p>
                              This report is <strong>preliminary and unaudited</strong>.
                              It is management-prepared and is not an independent
                              accountant's report and not a substitute for an IRS Form
                              990-series filing, a state filing, or a bank statement.
                            </p>
                          </div>
                        )}

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          <span className="font-semibold text-foreground">Scope:</span>{" "}
                          {r.scopeSummary}
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
                            <a
                              href={r.href}
                              download
                              aria-label={`Download ${r.title} PDF`}
                            >
                              <Download className="mr-2 h-4 w-4" aria-hidden />
                              Download PDF
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
