import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, BookOpen, Shield, Heart, School } from "lucide-react";

export default function NazareneMission() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Missões Globais – Angola" subtitle="Angola • Children • Youth • Education • Health" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center">
              We strengthen community-led solutions for children and youth in Luanda/Viana through education support, hygiene &amp; health learning, and improvements to safe learning spaces.
            </p>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Informed by local needs and ongoing humanitarian actions with children's homes and schools in Viana.
            </p>
          </motion.div>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Focus Areas", value: "4" },
              { label: "Base", value: "Luanda / Viana" },
              { label: "Approach", value: "Community-led" },
              { label: "Priority", value: "Children & Youth" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-muted p-4">
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Core Programs */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Core Programs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { icon: <BookOpen className="h-6 w-6 text-accent" />, title: "School Support & Tutoring", desc: "School materials, after-school tutoring, and enrichment tied to neighborhood schools and children's centers in Viana." },
              { icon: <Shield className="h-6 w-6 text-accent" />, title: "Child & Youth Protection", desc: "Positive play, psychosocial support, and safe-space activities for children and adolescents living in vulnerable conditions." },
              { icon: <Heart className="h-6 w-6 text-accent" />, title: "Health & Hygiene Learning", desc: "Basic hygiene education and introductory health literacy delivered in age-appropriate ways." },
              { icon: <School className="h-6 w-6 text-accent" />, title: "Facilities Repair & Learning Environments", desc: "Light restoration and beautification alongside local institutions—clean-ups, painting, and small improvements." },
            ].map((p) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-3">{p.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Community Impact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 rounded-lg bg-muted p-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Community Impact</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Angola's children and youth thrive when schools are resourced, safe spaces are nurtured, and families are engaged. Our work focuses on practical supports that improve learning conditions and well-being while strengthening community institutions. We work respectfully alongside local organizations and schools in Viana.
            </p>
          </motion.div>

          {/* Get Involved */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Get Involved</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "Volunteer", desc: "Offer tutoring, youth activities, or help with facility beautification projects.", cta: "I can help", href: "mailto:info@humanitypathwaysglobal.org?subject=Volunteer%20-%20Missões%20Globais%20Angola" },
              { title: "Partner", desc: "Are you a school, children's home, or community group in Luanda/Viana? Let's co-design supports.", cta: "Start a conversation", href: "mailto:info@humanitypathwaysglobal.org?subject=Partner%20-%20Missões%20Globais%20Angola" },
              { title: "Donate", desc: "Fund school materials, hygiene kits, and small repairs that immediately improve learning.", cta: "Give / Contact", href: "/contact-us" },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  <Button asChild variant="outline" className="mt-4" size="sm">
                    <a href={item.href}>{item.cta}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p><Mail className="inline h-4 w-4 mr-1" /> <a href="mailto:info@humanitypathwaysglobal.org" className="text-primary hover:underline">info@humanitypathwaysglobal.org</a></p>
            <p className="mt-1">See local context: <a href="https://www.missoeshumanitarias.org/missao-angola/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">missoeshumanitarias.org</a></p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
