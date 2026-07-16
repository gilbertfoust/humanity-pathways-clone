import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Terms of Use" subtitle="Terms that apply when you use this website" />
      <main className="bg-background py-16">
        <article className="prose prose-neutral mx-auto max-w-3xl px-4 font-body text-foreground/90">
          <p className="text-sm text-muted-foreground">
            This page is maintained by Humanity Pathways Global (HPG). It describes the
            terms that apply to your use of this website. It is not a contract for
            services and is not legal advice.
          </p>

          <h2 className="font-display">Using this site</h2>
          <p>
            You may browse the public pages of this site and use its public forms to
            contact HPG, subscribe to the newsletter, or submit a volunteer, sponsorship,
            or board application. You agree to provide accurate information and not to
            attempt to disrupt, overload, or probe the site or its backend services.
          </p>

          <h2 className="font-display">Form submissions</h2>
          <p>
            Public forms include automated spam controls — including honeypot fields,
            input validation, and per-IP rate limiting — that may reject submissions that
            look automated. A submission is considered received only after you see the
            on-screen success confirmation with a reference ID. Receipt of a submission
            does not itself create any commitment by HPG.
          </p>

          <h2 className="font-display">Third-party services</h2>
          <p>
            Some features of this site rely on third parties, including Mapbox for map
            tiles, Tumblr for the public blog feed, Stripe for onboarding-fee payments,
            and external donation platforms (Zeffy, Every.org, and the Rwanda donation
            portal). This site also links out to our Instagram profile, but does not
            embed Instagram posts. Your use of those services is governed by their own
            terms.
          </p>

          <h2 className="font-display">Content and trademarks</h2>
          <p>
            Text, imagery, and program names on this site are the property of HPG or
            their respective owners. You may not copy or redistribute site content in a
            way that misrepresents HPG or its partners.
          </p>

          <h2 className="font-display">No warranty</h2>
          <p>
            This site is provided on an "as is" basis. HPG does not guarantee that the
            site will be uninterrupted, error-free, or free of harmful components, and
            makes no representations about the accuracy of third-party content embedded
            on the site.
          </p>

          <h2 className="font-display">Solicitation notice</h2>
          <p>
            HPG is currently registered to solicit in Michigan and Illinois and is not
            actively soliciting donations from residents of other states at this time,
            as also stated in the site footer.
          </p>

          <h2 className="font-display">Changes and contact</h2>
          <p>
            HPG may update these terms as the site evolves. Questions can be sent through
            the <a href="/contact-us">Contact Us</a> page.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
