import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const tiers = [
  { tier: "1", entry: "Junior Specialist", requirements: "Orientation, Core Certifications, 1,000 Hours", cert: "Certified Specialist", advancement: "Specialist" },
  { tier: "2", entry: "Specialist", requirements: "Dept-Specific Certs, Mentorship, 1,000 Hours", cert: "Certified Director", advancement: "Director" },
  { tier: "3", entry: "Director", requirements: "Advanced Leadership, Capstone Project, 1,000 Hours", cert: "Certified Departmental VP", advancement: "Departmental VP" },
];

const coreCerts = [
  { dept: "Finance", cert: "Financial Management Essentials", emoji: "💵" },
  { dept: "Grant Writing", cert: "Fundraising Essentials", emoji: "✍️" },
  { dept: "Program Staff", cert: "Program Management for Nonprofits", emoji: "🧩" },
  { dept: "Marketing", cert: "Nonprofit Marketing and Communications", emoji: "📣" },
  { dept: "HR", cert: "Human Resources for Nonprofits", emoji: "🧑‍💼" },
  { dept: "Tech", cert: "IT Essentials for Nonprofits", emoji: "🖥️" },
];

export default function HpgExecutiveAcademy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="✨ HPG Executive Professional Academy" subtitle="Empowering the Next Generation of Global Leaders" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm">
            <p className="text-muted-foreground leading-relaxed">
              The HPG Executive Professional Academy (EPA) is designed to nurture leadership, innovation, and operational excellence among HPG volunteers, specialists, and directors. Whether you're stepping into nonprofit leadership for the first time or sharpening your professional edge, this Academy is your launchpad to impactful service and dynamic career growth.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 rounded-lg bg-primary p-8 text-center">
            <h2 className="font-display text-xl font-bold text-primary-foreground">🌟 Our Mission</h2>
            <p className="mt-4 text-primary-foreground/80 italic max-w-2xl mx-auto">
              "To equip emerging professionals with the skills, certifications, and leadership experience necessary to drive HPG's global initiatives — and to become the future stewards of change within our organization and beyond."
            </p>
          </motion.div>

          {/* Program Structure */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">🚀 Program Structure: Your Leadership Journey</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-foreground">Tier</th>
                  <th className="px-3 py-3 text-left font-semibold text-foreground">Entry Title</th>
                  <th className="px-3 py-3 text-left font-semibold text-foreground">Requirements</th>
                  <th className="px-3 py-3 text-left font-semibold text-foreground">Certification</th>
                  <th className="px-3 py-3 text-left font-semibold text-foreground">Advancement</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((row) => (
                  <tr key={row.tier} className="border-t border-border">
                    <td className="px-3 py-3 font-bold text-foreground">{row.tier}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.entry}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.requirements}</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.cert}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{row.advancement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Orientation */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">📚 Orientation Phase (First 30 Days)</h2>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Mandatory Core Certifications (via NonprofitReady.org):</p>
            <p className="mt-1">✅ Nonprofit Essentials Certification (for everyone!)</p>
            <p className="mt-1">✅ Specialization Certification (based on your department):</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coreCerts.map((c) => (
              <Card key={c.dept}>
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{c.dept}</p>
                    <p className="text-xs text-muted-foreground">{c.cert}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Milestones */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">🏁 Program Expectations</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>🔵 <strong>USCIS E-Verify Volunteers:</strong> Minimum 20+ hours/week, 1,000 hours to advance</li>
                <li>⚪ <strong>Non-E-Verify Volunteers:</strong> Flexible hours, still 1,000 hours to advance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">🏆 Recognition and Advancement</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>🥇 Official HPG Certificate</li>
                <li>🎖️ Digital Certification Badge (LinkedIn-ready!)</li>
                <li>✨ Recognition at Annual HPG Honors Ceremony</li>
              </ul>
            </div>
          </div>

          {/* Tracking */}
          <div className="mt-12 rounded-lg bg-muted p-8">
            <h3 className="font-display text-xl font-bold text-foreground">🧭 Tracking Your Progress</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✅ Certification Tracker (Internal System)</li>
              <li>⏱️ Hour Log Submission Portal</li>
              <li>🤝 Quarterly Mentor Check-ins</li>
            </ul>
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 text-center space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">🚨 Ready to Begin?</h2>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Complete your NonprofitReady Orientation Courses</li>
              <li>2. Meet your Academy Mentor to set leadership goals</li>
              <li>3. Start logging your 1,000-hour journey!</li>
            </ol>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
