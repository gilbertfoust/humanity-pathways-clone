import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, BookOpen, Shield, Heart, School, Users, Megaphone } from "lucide-react";

export default function NazareneMission() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Youth Development Program – Luanda, Angola" subtitle="Angola • Youth Advocacy • Education • Leadership" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto text-center">
              Empowering Angolan youth through leadership development, education support, and advocacy initiatives in Luanda and Viana — building the next generation of changemakers.
            </p>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Aligned with SDG 4 (Quality Education) and SDG 8 (Decent Work &amp; Economic Growth).
            </p>
          </motion.div>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Focus", value: "Youth Advocacy" },
              { label: "Base", value: "Luanda / Viana" },
              { label: "Approach", value: "Community-led" },
              { label: "Priority", value: "Education & Leadership" },
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
              { icon: <Megaphone className="h-6 w-6 text-accent" />, title: "Youth Advocacy & Leadership", desc: "Training young Angolans in civic engagement, community organizing, and leadership skills to drive positive change." },
              { icon: <BookOpen className="h-6 w-6 text-accent" />, title: "Education Support & Tutoring", desc: "School materials, after-school tutoring, and enrichment programs tied to neighborhood schools and youth centers in Viana." },
              { icon: <Users className="h-6 w-6 text-accent" />, title: "Community Empowerment", desc: "Building capacity among local organizations and families to create sustainable support networks for young people." },
              { icon: <Heart className="h-6 w-6 text-accent" />, title: "Health & Wellness", desc: "Basic hygiene education, psychosocial support, and safe-space activities for children and adolescents." },
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
              Angola's youth thrive when they have access to quality education, leadership opportunities, and supportive communities. Our work empowers young people in Luanda and Viana with the skills and confidence to advocate for themselves and their communities, while strengthening local institutions and creating pathways to meaningful employment.
            </p>
          </motion.div>

          {/* Get Involved */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Get Involved</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "Volunteer", desc: "Offer tutoring, mentorship, or help with youth leadership workshops.", cta: "I can help", href: "mailto:info@humanitypathwaysglobal.org?subject=Volunteer%20-%20Youth%20Development%20Angola" },
              { title: "Partner", desc: "Are you a school, youth center, or community group in Luanda/Viana? Let's collaborate.", cta: "Start a conversation", href: "mailto:info@humanitypathwaysglobal.org?subject=Partner%20-%20Youth%20Development%20Angola" },
              { title: "Donate", desc: "Fund school materials, leadership training, and youth advocacy programs.", cta: "Give / Contact", href: "/contact-us" },
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
