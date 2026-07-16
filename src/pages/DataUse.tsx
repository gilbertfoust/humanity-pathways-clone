import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export default function DataUse() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Data Use" subtitle="How HPG uses the information submitted through this site" />
      <main className="bg-background py-16">
        <article className="prose prose-neutral mx-auto max-w-3xl px-4 font-body text-foreground/90">
          <p className="text-sm text-muted-foreground">
            This page is maintained by Humanity Pathways Global (HPG). It complements the{" "}
            <a href="/privacy">Privacy</a> page by describing, in plain language, how
            information submitted through this site is used.
          </p>

          <h2 className="font-display">Purposes of use</h2>
          <ul>
            <li>
              <strong>Responding to inquiries.</strong> Contact form submissions are used
              to reply to your question and to route it to the appropriate HPG team.
            </li>
            <li>
              <strong>Newsletter.</strong> Newsletter subscriptions are used to send you
              program updates. You can unsubscribe from any email at any time.
            </li>
            <li>
              <strong>Applications.</strong> Volunteer, sponsorship, and board application
              data is used to evaluate your submission, communicate with you about it, and
              coordinate next steps internally.
            </li>
            <li>
              <strong>Operations and integrity.</strong> Timestamps, reference IDs, and
              hashed IPs are used for auditing, deduplication, and spam prevention.
            </li>
          </ul>

          <h2 className="font-display">Storage and access</h2>
          <p>
            Submissions are stored in HPG's backend database, protected by row-level
            security policies that restrict access to authorized HPG service accounts.
            Notification and acknowledgement emails are queued to HPG staff mailboxes
            and to the submitter's email address.
          </p>

          <h2 className="font-display">Sharing</h2>
          <p>
            HPG does not sell your information. Submitted data is shared only with the
            service providers required to operate this site — for example, our backend
            (Lovable Cloud / Supabase), transactional email delivery, and, where used,
            an internal task board (Trello) that receives a webhook summary of new
            submissions. External donation platforms and Stripe process their own
            transactions under their own privacy terms.
          </p>

          <h2 className="font-display">Retention</h2>
          <p>
            Submissions are retained for as long as they are useful for the purpose they
            were submitted (for example, ongoing correspondence, an active application,
            or your newsletter subscription). You may request deletion of your
            submissions at any time through the <a href="/contact-us">Contact Us</a> page.
          </p>

          <h2 className="font-display">Your control</h2>
          <ul>
            <li>Unsubscribe from marketing emails via the link in any HPG email.</li>
            <li>Request access to, correction of, or deletion of your data by contacting HPG.</li>
            <li>Choose not to submit optional fields on any public form.</li>
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
}
