import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Wrench, Trees, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const activities = [
  { icon: <Trash2 className="h-6 w-6 text-accent" />, title: "Neighborhood Cleanups", desc: "Trash pickup, graffiti removal, and beautification projects that restore dignity and safety to public spaces." },
  { icon: <Wrench className="h-6 w-6 text-accent" />, title: "Light Repairs", desc: "Volunteers repair fences, fix steps, paint porches, and perform small maintenance tasks for seniors and families in need." },
  { icon: <Trees className="h-6 w-6 text-accent" />, title: "Park Building", desc: "Help design and build play spaces and community gardens in underserved neighborhoods." },
  { icon: <Heart className="h-6 w-6 text-accent" />, title: "Hospital & Senior Visits", desc: "Bringing joy and companionship to hospital patients and nursing home residents through art, conversation, and time." },
];

export default function SeishinPlus() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="✨ Seishin Plus" subtitle="Community Service with Spirit • United States" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <p className="text-muted-foreground leading-relaxed">
              <strong>Seishin</strong> (精神) means "spirit" in Japanese — and that's exactly what drives this program.
              <strong> Seishin Plus</strong> is the heart of Humanity Pathways Global's local outreach across the United States.
              It's where compassion meets action, and where everyday people step up to make a tangible difference in the lives of others.
            </p>
          </motion.div>

          {/* What We Do */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">What We Do</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {activities.map((a) => (
              <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-3">{a.icon}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{a.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 rounded-lg bg-primary p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-primary-foreground">Mission</h2>
            <p className="mt-4 text-primary-foreground/80 italic max-w-2xl mx-auto">
              "To awaken the spirit of service in every community and to create a legacy of healing, helping, and human connection."
            </p>
          </motion.div>

          {/* How It Works */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">⚙️ How It Works</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>📌 Local teams form in major cities across the U.S.</li>
                <li>📆 Service events happen weekly, monthly, and on national holidays</li>
                <li>🛠️ All tools and materials are provided for volunteers</li>
                <li>📸 Each event is documented and shared to inspire others</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">💼 Who Can Join?</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>👨‍👩‍👧‍👦 Families &amp; youth groups</li>
                <li>🏫 School &amp; college service learners</li>
                <li>🏢 Corporate volunteer groups</li>
                <li>🧓 Retirees &amp; experienced professionals</li>
                <li>❤️ Anyone with a spirit of service</li>
              </ul>
            </div>
          </div>

          {/* Special Features */}
          <div className="mt-12 rounded-lg bg-muted p-8">
            <h3 className="font-display text-xl font-bold text-foreground">📣 Special Features</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>🎓 Volunteers can earn verified service hours</li>
              <li>🎖️ Seishin Plus badges and public recognition</li>
              <li>📕 Featured in the HPG Global Impact Magazine</li>
              <li>🫂 Mentorship for youth and first-time volunteers</li>
            </ul>
          </div>

          {/* Testimonial */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 border-l-4 border-accent pl-6 py-4">
            <p className="text-muted-foreground italic">
              "I never thought picking up trash with strangers on a Saturday would be so transformative. We didn't just clean the park — we revived a place where kids could feel safe again."
            </p>
            <p className="mt-2 text-xs font-semibold text-foreground">— Seishin Plus Volunteer, Detroit MI</p>
          </motion.div>

          {/* CTA */}
          <div className="mt-12 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">🚀 Ready to Activate Your Spirit?</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/volunteer-application">Sign up to volunteer</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:seishin@humanitypathwaysglobal.com">
                  <Mail className="mr-2 h-4 w-4" /> Contact us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
