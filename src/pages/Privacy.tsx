import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Privacy" subtitle="How this website handles the information you share with us" />
      <main className="bg-background py-16">
        <article className="prose prose-neutral mx-auto max-w-3xl px-4 font-body text-foreground/90">
          <p className="text-sm text-muted-foreground">
            This page is maintained by Humanity Pathways Global (HPG) to describe the
            data practices visible in this website's code. It is not a certification and
            it is not legal advice.
          </p>

          <h2 className="font-display">What we collect</h2>
          <p>
            This site collects only the information you submit through its public forms:
          </p>
          <ul>
            <li>
              <strong>Contact form</strong> — name, email, optional phone, subject and message.
            </li>
            <li>
              <strong>Newsletter subscription</strong> — email address.
            </li>
            <li>
              <strong>Volunteer application</strong> — the fields shown on that form,
              including contact details, background, interests, and an optional resume link.
            </li>
            <li>
              <strong>Sponsorship application</strong> — the fields shown on that form,
              including organization details and sponsorship interests.
            </li>
            <li>
              <strong>Board application</strong> — the fields shown on that form,
              including professional background and motivation.
            </li>
          </ul>
          <p>
            When you submit a form, our server also records a submission timestamp, a
            reference ID, and a one-way hash of the requesting IP address. The hash is
            used only for spam prevention and rate limiting.
          </p>

          <h2 className="font-display">Where the data goes</h2>
          <p>
            Submissions are stored in HPG's backend database (hosted through Lovable
            Cloud, which uses Supabase infrastructure). Access is restricted by row-level
            security policies so that only authorized HPG service accounts can read the
            records. Notification and acknowledgement emails are queued to HPG staff and
            to the address you provided.
          </p>

          <h2 className="font-display">Email and unsubscribe</h2>
          <p>
            Acknowledgement and newsletter emails are sent from HPG's transactional email
            system. Every marketing email includes an unsubscribe link that removes your
            address from future sends. You can also request removal at any time by
            contacting us.
          </p>

          <h2 className="font-display">Cookies and tracking</h2>
          <p>
            This site does not set advertising cookies. Third-party embeds (such as
            social feeds or map tiles from Mapbox) may set their own cookies as required
            to render their content. External links open on their operators' own sites
            and are governed by those sites' policies.
          </p>

          <h2 className="font-display">Third-party services referenced by this site</h2>
          <ul>
            <li>Lovable Cloud / Supabase — database, authentication, and edge functions</li>
            <li>Mapbox — map tiles for the staff and board globe</li>
            <li>Tumblr — public blog feed embedded on the blog page</li>
            <li>Instagram — public feed embedded on the site</li>
            <li>Stripe — payment processing for the onboarding fee</li>
            <li>Zeffy, Every.org, and the Rwanda donation portal — external donation platforms linked from the site</li>
          </ul>

          <h2 className="font-display">Your choices</h2>
          <p>
            You can request access to, correction of, or deletion of information you
            submitted through this site by contacting HPG. We will respond as promptly
            as we reasonably can.
          </p>

          <h2 className="font-display">Contact</h2>
          <p>
            For any privacy question, please use the <a href="/contact-us">Contact Us</a> page.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
