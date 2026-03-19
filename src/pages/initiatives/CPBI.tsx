import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ExternalLink, Calendar, FileText, Shield, Users, Music } from "lucide-react";

const eventTypes = [
  { icon: <FileText className="h-5 w-5 text-accent" />, title: "Workshops & Trainings", desc: "Perfect for nonprofit staff development, union education sessions, and youth empowerment days." },
  { icon: <Users className="h-5 w-5 text-accent" />, title: "Family & Cultural Events", desc: "Birthday celebrations, quinceañeras, cultural nights, reunions — hosted with dignity and affordability." },
  { icon: <Music className="h-5 w-5 text-accent" />, title: "Civic Forums & Advocacy", desc: "Local organizing, town halls, campaign events — let your voice echo in a space that supports the people." },
  { icon: <Shield className="h-5 w-5 text-accent" />, title: "Memorials & Community Healing", desc: "Gather to honor lives lost and uplift spirits with compassion and care in your time of need." },
];

const rentalSteps = [
  "🗓️ Check Availability: View the online calendar.",
  "📝 Submit Rental Contract: Fill out your booking request form.",
  "💳 Make Your Payment: Pay the rental fee securely online.",
  "📄 Insurance: Upload proof of liability insurance (minimum $2M general / $25K personal injury).",
  "👮 Security: Hire security through our union-partnered agency (Arms Security Corp).",
  "💵 Security Deposit: Submit a $500 deposit directly to the UAW Local 551 Financial Secretary.",
  "🎉 Host Your Event! We'll confirm once all documents are received.",
];

export default function CPBI() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Community Purpose Booking Intl. (CPBI)" subtitle="VenueSpace by HPG – Community Event Space for Impact" />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg bg-card p-8 shadow-sm text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Affordable, Accessible Event Spaces for Nonprofits, Union Members &amp; Communities
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              <strong>VenueSpace by Humanity Pathways Global</strong> provides affordable, union-operated event space rentals in partnership with Local Unions and community partners. Whether you're hosting a community forum, nonprofit fundraiser, wedding, memorial, or youth event — our venues are for the people.
            </p>
          </motion.div>

          {/* Who We Serve */}
          <div className="mt-12 rounded-lg bg-muted p-8">
            <h3 className="font-display text-xl font-bold text-foreground">🎯 Who We Serve</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✅ Local Union Members and Their Families</li>
              <li>✅ Community-Based Nonprofits and Charities</li>
              <li>✅ Faith-Based &amp; Mutual Aid Organizations</li>
              <li>✅ Local Residents Hosting Milestone Events</li>
              <li>✅ Civic and Advocacy Groups</li>
            </ul>
          </div>

          {/* Flagship Venue */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 rounded-lg bg-primary p-8 text-center">
            <h3 className="font-display text-xl font-bold text-primary-foreground">📍 Our Flagship Venue</h3>
            <p className="mt-2 text-lg font-semibold text-primary-foreground">UAW Local 551 Union Hall</p>
            <p className="text-primary-foreground/80">13550 South Torrence Avenue</p>
            <p className="text-primary-foreground/80">Chicago, Illinois 60633, USA</p>
            <p className="mt-3 text-sm text-primary-foreground/70">
              This versatile space supports a variety of setups and comes equipped for events ranging from community cookouts to professional workshops.
            </p>
          </motion.div>

          {/* Rental Process */}
          <h3 className="mt-12 font-display text-xl font-bold text-foreground">🛠️ Rental Process (Step-by-Step)</h3>
          <ol className="mt-4 space-y-2">
            {rentalSteps.map((step, i) => (
              <li key={i} className="rounded-lg bg-card border border-border p-3 text-sm text-muted-foreground">{step}</li>
            ))}
          </ol>

          {/* Event Types */}
          <h2 className="mt-16 font-display text-2xl font-bold text-foreground text-center">Types of Events We Support</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {eventTypes.map((e) => (
              <Card key={e.title}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {e.icon}
                    <h3 className="font-semibold text-foreground">{e.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{e.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">📬 Ready to Book?</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href="https://venuespacebooking.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> VenueSpaceBooking.com
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:venues@humanitypathwaysglobal.com">
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
