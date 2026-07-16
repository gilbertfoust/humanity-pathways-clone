import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail } from "lucide-react";
import { annualReports } from "@/data/annualReports";

export default function AnnualReports() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Annual Reports"
        subtitle="A public record of Humanity Pathways Global's yearly reporting"
      />
      <main className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4">
          {annualReports.length === 0 ? (
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
            <ul className="space-y-4" aria-label="Available annual reports">
              {annualReports
                .slice()
                .sort((a, b) => b.year - a.year)
                .map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-primary" aria-hidden />
                        <div>
                          <p className="font-display text-lg font-semibold text-foreground">
                            {r.title}
                          </p>
                          {r.meta && (
                            <p className="text-xs text-muted-foreground">{r.meta}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-primary">Download</span>
                    </a>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
