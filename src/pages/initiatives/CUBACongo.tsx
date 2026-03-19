import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, BookOpen, Laptop, Apple, Sprout, Users, Globe } from "lucide-react";

const budget = [
  { component: "Education & Literacy", budget: "$7,500", outcome: "250 children learn to read, write, and rejoin school" },
  { component: "Digital Literacy", budget: "$1,500", outcome: "150+ youth gain IT skills and digital confidence" },
  { component: "Nutrition & Clothing", budget: "$5,000", outcome: "Daily meals and clothes improve dignity and health" },
  { component: "Family Micro-Grants", budget: "$2,100", outcome: "15 families start businesses; 60 children reintegrated" },
];

const solutions = [
  { icon: <BookOpen className="h-5 w-5 text-accent" />, title: "Education", desc: "Literacy classes in French, English, Lingala; school reintegration." },
  { icon: <Laptop className="h-5 w-5 text-accent" />, title: "Digital Literacy", desc: "Computer training for 21st-century skills." },
  { icon: <Apple className="h-5 w-5 text-accent" />, title: "Nutrition & Hygiene", desc: "Daily meals, clean clothing, and hygiene support." },
  { icon: <Sprout className="h-5 w-5 text-accent" />, title: "Urban Farming", desc: "3-month crop cycles (maize, peanuts) for food and income." },
  { icon: <Users className="h-5 w-5 text-accent" />, title: "Family Empowerment", desc: "Micro-grants for parents to launch small businesses." },
  { icon: <Globe className="h-5 w-5 text-accent" />, title: "Community Integration", desc: "Local leaders, volunteers, and churches involved in support." },
];

export default function CUBACongo() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="CUBA Congo" subtitle="Congolais Unis pour Bâtir l'Avenir • Kinshasa, DRC" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          {/* Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              <strong>CUBA</strong> is a grassroots nonprofit in Kinshasa, Democratic Republic of Congo, established on July 2, 2020. Our mission is to unite Congolese communities in supporting the integral development of children, youth, and families—especially the most vulnerable.
            </p>
            <p className="mt-3 text-muted-foreground">
              We operate primarily in <strong>Maluku District</strong>, focusing on education, social welfare, and sustainable livelihoods. Our vision: street children transformed into learners, leaders, and changemakers.
            </p>
          </motion.div>

          {/* Flagship Project */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">
            Flagship Project: Assistance for Children and Youth
          </h2>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Target: 250 street-connected children • Duration: 2 years
          </div>

          {/* Solutions */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {s.icon}
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Budget Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 overflow-x-auto">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Project Summary Table</h3>
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Component</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Budget</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((row) => (
                  <tr key={row.component} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{row.component}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.budget}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Contact */}
          <div className="mt-16 text-center space-y-3">
            <h2 className="font-display text-2xl font-bold text-foreground">Let's Partner for Change</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CUBA invites philanthropic foundations, embassies, companies, and changemakers to invest in this transformative effort. Every dollar builds literacy, feeds a child, or creates a family livelihood.
            </p>
            <Button asChild size="lg" className="mt-4">
              <a href="mailto:organizationfund@gmail.com?subject=CUBA%20Congo%20Partnership">
                <Mail className="mr-2 h-4 w-4" /> Contact Patrick Bwelo
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Website: <a href="https://www.cubaong.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cubaong.com</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
