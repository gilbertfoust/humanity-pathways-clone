import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Home, Building } from "lucide-react";

const DONATE_URL =
  "https://www.every.org/humanity-pathways-global?suggestedAmounts=50%2C250%2C500%2C1000%2C5000%2C10000&theme_color=05386B&designation=Triumphant+Philippines+Disaster+Relief&utm_campaign=donate-link#/donate";

const locations = [
  { location: "Kapalong, Davao del Norte", families: "909", persons: "2,881", homes: "₱27,270,000", support: "₱3,000,000", total: "₱30,270,000" },
  { location: "Agusan del Sur", families: "5,201", persons: "18,710", homes: "₱156,030,000", support: "₱15,000,000", total: "₱171,030,000" },
  { location: "Cebu (Cebu City & Mandaue)", families: "817", persons: "3,352", homes: "₱24,510,000", support: "₱10,000,000", total: "₱34,510,000" },
  { location: "Sarangani (Maasim)", families: "337", persons: "1,685", homes: "₱10,110,000", support: "₱3,000,000", total: "₱13,110,000" },
];

export default function TriumphantPhilippines() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero
        title="Triumphant Philippines"
        subtitle="Urgent: Help communities recover after 2025 floods and landslides"
      />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed">
              Support is requested to help rebuild damaged homes and restore community support spaces affected across
              <strong> Kapalong (Davao del Norte), Agusan del Sur, Cebu, and Sarangani</strong>.
            </p>
            <Button asChild size="lg" className="mt-6">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Donate now
              </a>
            </Button>
          </motion.div>

          {/* Key Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "7,264", label: "Families affected" },
              { value: "26,628", label: "Persons affected" },
              { value: "₱248.9M", label: "Estimated total (PHP)" },
              { value: "₱30,000", label: "Per family assumption" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Location Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 overflow-x-auto">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Impact by Location</h3>
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-foreground">Location</th>
                  <th className="px-3 py-3 text-right font-semibold text-foreground">Families</th>
                  <th className="px-3 py-3 text-right font-semibold text-foreground">Persons</th>
                  <th className="px-3 py-3 text-right font-semibold text-foreground">Total (PHP)</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((row) => (
                  <tr key={row.location} className="border-t border-border">
                    <td className="px-3 py-3 font-medium text-foreground">{row.location}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{row.families}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{row.persons}</td>
                    <td className="px-3 py-3 text-right font-semibold text-foreground">{row.total}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-foreground bg-muted">
                  <td className="px-3 py-3 font-bold text-foreground">Total</td>
                  <td className="px-3 py-3 text-right font-bold text-foreground">7,264</td>
                  <td className="px-3 py-3 text-right font-bold text-foreground">26,628</td>
                  <td className="px-3 py-3 text-right font-bold text-foreground">₱248,920,000</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          {/* Recovery Plan */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Recovery plan highlights</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <Home className="h-6 w-6 text-accent mb-3" />
                <h3 className="font-display text-lg font-bold text-foreground">Track 1: Homes</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Repairs and rebuilding support based on the per-family estimate (₱30,000 per family). Includes materials, labor support, and shelter recovery.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Building className="h-6 w-6 text-accent mb-3" />
                <h3 className="font-display text-lg font-bold text-foreground">Track 2: Community support spaces</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Restoration of damaged facilities and equipment that enable ongoing community support activities. Includes facility repair, equipment replacement, and community use.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Donate to recovery
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
