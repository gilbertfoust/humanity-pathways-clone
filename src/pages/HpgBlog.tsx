import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export default function HpgBlog() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="HPG Blog" subtitle="Stories, updates, and insights from our global community" />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-lg text-muted-foreground">
            Blog posts coming soon. Stay tuned for stories from the field, organizational updates, and insights on community development.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
