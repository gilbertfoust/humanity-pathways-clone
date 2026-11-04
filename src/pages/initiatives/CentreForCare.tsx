import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const zeffyUrl = "https://www.zeffy.com/en-US/donation-form/centre-for-care";

export default function CentreForCare() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Centre for Care" subtitle="Supporting vulnerable children and families in Gokwe, Zimbabwe" />
      <main className="bg-background py-16">
        <div className="mx-auto max-w-4xl space-y-8 px-4">
          <section className="rounded-lg border border-border bg-card p-8">
            <h2 className="font-display text-2xl font-bold text-foreground">About Centre for Care</h2>
            <p className="mt-4 text-muted-foreground">
              Centre for Care is a Zimbabwean community organization working to support vulnerable
              children and households in Gokwe. Its fundraising priorities include school-fee
              assistance and a supplementary school feeding programme.
            </p>
          </section>
          <section className="rounded-lg border border-border bg-card p-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Support Centre for Care</h2>
            <p className="mt-4 text-muted-foreground">
              Contributions to the Centre for Care campaign are processed through Zeffy
              under Humanity Pathways Global's fiscal sponsorship arrangements.
            </p>
            <a href={zeffyUrl} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-block rounded bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
              Donate to Centre for Care through Zeffy
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Your donation will open the dedicated Centre for Care campaign in a new tab.
            </p>
          </section>
          <section className="rounded-lg border border-border bg-card p-8">
            <h2 className="font-display text-xl font-bold text-foreground">Organization contacts</h2>
            <p className="mt-3 text-muted-foreground">Executive Director: Allen Benhura</p>
            <p className="mt-2 text-muted-foreground">Chairman: Barnabas Rusere</p>
            <p className="mt-3"><a className="text-primary underline" href="mailto:info@centreforcare.org">info@centreforcare.org</a></p>
          </section>
          <Link to="/hpg-initiatives" className="inline-block text-primary underline">View all initiatives</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
