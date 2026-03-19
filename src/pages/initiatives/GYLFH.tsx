import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gylfhBanner from "@/assets/gylfh-banner.jpg";
import gylfhLogo from "@/assets/gylfh-logo.png";
import { ExternalLink, Mail, Users, Globe, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DONATE_URL =
  "https://www.every.org/humanity-pathways-global?suggestedAmounts=50%2C250%2C500%2C1000%2C10000&theme_color=2f6a87&designation=Global+Youth+Leaders+for+Humanity#/donate";

const programElements = [
  { num: 1, title: "Cross-cultural immersion", desc: "Guided conversations with international peers" },
  { num: 2, title: "Professional workshops", desc: "Diplomacy, communication, advocacy, economics" },
  { num: 3, title: "Mentorship", desc: "Consistent guidance from experienced adults" },
  { num: 4, title: "Language learning", desc: "Optional tracks by region and interest" },
  { num: 5, title: "Community activism", desc: "Youth-led local advocacy and service" },
  { num: 6, title: "Field experiences", desc: "Career, civic, and cultural visits" },
  { num: 7, title: "Continuous feedback", desc: "Iteration using mentor and participant input" },
  { num: 8, title: "Alumni network", desc: "Ongoing connection after completion" },
  { num: 9, title: "Student exchange pathway", desc: "Planning for future in-person exchanges" },
  { num: 10, title: "Hands-on projects", desc: "Real-world work with deliverables" },
];

const suggestedGiving = [
  { amount: "$50", desc: "Supplies and local session needs" },
  { amount: "$250", desc: "Helps support one workshop session" },
  { amount: "$1,000", desc: "Helps support a youth project kit" },
  { amount: "$10,000", desc: "Helps underwrite a full cohort cycle" },
];

export default function GYLFH() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img src={gylfhBanner} alt="GYLFH Banner" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex items-center justify-center pt-[var(--nav-height)]">
          <div className="text-center px-4">
            <p className="text-sm uppercase tracking-widest text-primary-foreground/70">
              Youth diplomacy • Leadership • Community projects
            </p>
            <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold text-primary-foreground">
              Equip young leaders to serve locally, connect globally, and lead with skill.
            </h1>
          </div>
        </div>
      </section>

      {/* Subtitle + CTA */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <img src={gylfhLogo} alt="GYLFH Logo" className="mx-auto mb-6 h-24 w-24 object-contain" />
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Support training that combines diplomacy workshops, cross-cultural exchange, mentorship, and hands-on projects.
            Gifts are directed to delivery, materials, coordination, and reporting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Give on Every.org
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/volunteer-application">Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-muted py-12">
        <div className="mx-auto max-w-4xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Program design", value: "10 elements" },
            { label: "Delivery format", value: "Hybrid" },
            { label: "Reporting", value: "Quarterly" },
            { label: "Stewardship", value: "HPG FSO" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What support enables */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-display text-3xl font-bold text-foreground text-center">What support enables</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <BookOpen className="h-6 w-6 text-accent" />,
                title: "Diplomacy learning",
                desc: "Workshops on communication, conflict navigation, civic leadership, and public speaking—so participants practice responsible influence.",
              },
              {
                icon: <Globe className="h-6 w-6 text-accent" />,
                title: "Cross-cultural exchange",
                desc: "Structured collaboration with peers in other places, with facilitation and clear learning goals.",
              },
              {
                icon: <Users className="h-6 w-6 text-accent" />,
                title: "Hands-on projects",
                desc: "Youth-led projects that translate training into action—planning, budgeting, execution, and reflection with mentor feedback.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-3">{item.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggested Giving */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-2xl font-bold text-foreground text-center">Suggested giving</h2>
          <div className="mt-8 space-y-3">
            {suggestedGiving.map((g) => (
              <div key={g.amount} className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm">
                <span className="font-bold text-accent text-lg">{g.amount}</span>
                <span className="text-sm text-muted-foreground">{g.desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">Donate</a>
            </Button>
          </div>
        </div>
      </section>

      {/* 10 Elements */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-3xl font-bold text-foreground text-center">
            10 elements that shape the experience
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {programElements.map((el, i) => (
              <motion.div
                key={el.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 rounded-lg border border-border bg-card p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {el.num}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">{el.title}</h3>
                  <p className="text-sm text-muted-foreground">{el.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to sponsor */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Ready to sponsor the next cohort?</h2>
          <p className="mt-4 text-primary-foreground/80 leading-relaxed">
            Support can fund workshops, mentoring, project materials, facilitation, and reporting.
            Donors receive milestone updates as the cohort progresses.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">Donate now</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <a href="mailto:development@humanitypathwaysglobal.com?subject=GYLFH%20Cohort%20Sponsorship%20Inquiry">
                <Mail className="mr-2 h-4 w-4" /> Sponsor a cohort
              </a>
            </Button>
          </div>
          <Separator className="my-8 bg-primary-foreground/20" />
          <div className="text-left text-sm text-primary-foreground/70 space-y-1">
            <p className="font-semibold text-primary-foreground">Transparency</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Funds processed through Humanity Pathways Global</li>
              <li>Quarterly outputs and narrative updates</li>
              <li>Safeguarding and partner coordination as programs scale</li>
            </ul>
            <p className="mt-4 text-xs">Note: HPG is currently registered to solicit in Michigan and Illinois.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
