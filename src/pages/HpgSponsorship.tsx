import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const provides = [
  "Fundraising Support: HPG actively seeks grants and donors to support approved initiatives.",
  "Grant Writing: Our team researches and submits applications on behalf of sponsored organizations.",
  "Donor & Corporate Outreach: We introduce organizations to potential funding partners.",
  "Fiscal Sponsorship (Model C FSO): Sponsored groups can operate under HPG's 501(c)(3) status.",
  "Strategic Mentorship: HPG guides organizations in donor relations, reporting, and impact measurement.",
];

const notList = [
  "No Guaranteed Funding: HPG works to raise funds but does not promise a fixed amount.",
  "Not an Instant Process: Fundraising and grant approvals can take 3-12 months.",
  "No Complete Financial Control: Sponsored organizations remain responsible for their own financial management.",
  "Not a Handout: Sponsored organizations must actively participate in fundraising, reporting, and compliance.",
];

const steps = [
  { title: "Step 1: Application & Review", items: ["Organizations submit an application detailing their mission, impact, and funding needs.", "HPG evaluates alignment with our values and fundraising potential.", "Selected organizations sign an agreement outlining sponsorship expectations."] },
  { title: "Step 2: Fundraising Strategy Development", items: ["HPG collaborates with the organization to create a tailored fundraising plan.", "We identify potential grants, donors, and funding sources.", "Organizations may receive training in donor engagement and impact storytelling."] },
  { title: "Step 3: Donor & Grant Outreach", items: ["HPG actively applies for grants and promotes the sponsored project to donors.", "Organizations may participate in fundraising campaigns and outreach efforts.", "Corporate sponsorships and partnership opportunities are explored."] },
  { title: "Step 4: Funding Allocation & Reporting", items: ["Funds received are distributed based on donor intent and sponsorship agreements.", "Organizations must submit reports demonstrating how funds were used.", "Transparency and compliance are required to maintain sponsorship status."] },
];

const faqs = [
  { q: "How does HPG sponsorship work?", a: "HPG fundraises on behalf of sponsored organizations by writing grants, seeking donors, and offering fiscal sponsorship." },
  { q: "Will I receive guaranteed funding?", a: "No. Funding is dependent on the success of our fundraising and grant applications." },
  { q: "How long does it take to receive funding?", a: "The process can take 3-6 months, depending on donor interest, grant cycles, and fundraising success." },
  { q: "What are the differences between Model A and Model C FSO?", a: "Model C FSO: HPG fundraises on behalf of an organization, but the organization maintains full independence. Model A: The organization operates under HPG's nonprofit status, gaining tax benefits and grant access." },
  { q: "Can individuals apply for sponsorship?", a: "No. HPG only sponsors registered organizations, social enterprises, and community initiatives that align with our mission." },
];

export default function HpgSponsorship() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Sponsorship" subtitle="Strategic partnerships for mission-driven organizations" />

      {/* What HPG Provides */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-5xl px-4">
          <p className="mb-10 text-center text-lg text-muted-foreground">
            HPG works with mission-driven organizations to secure funding through grant writing, donor outreach, and fiscal sponsorship. HPG does not provide direct funding but serves as a strategic partner.
          </p>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-display text-2xl font-bold text-foreground">🌍 What HPG Provides</h3>
              <ul className="space-y-3">
                {provides.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 text-primary">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-display text-2xl font-bold text-foreground">What Sponsorship is NOT</h3>
              <ul className="space-y-3">
                {notList.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 text-destructive">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">Step-by-Step Sponsorship Process</h2>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg bg-card p-6 shadow-sm"
              >
                <h3 className="mb-3 font-display text-xl font-bold text-foreground">{step.title}</h3>
                <ul className="space-y-2">
                  {step.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border bg-card px-4">
                <AccordionTrigger className="text-left font-medium text-foreground">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
