import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export default function Accessibility() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHero title="Accessibility" subtitle="Our approach to making this website usable for everyone" />
      <main className="bg-background py-16">
        <article className="prose prose-neutral mx-auto max-w-3xl px-4 font-body text-foreground/90">
          <p className="text-sm text-muted-foreground">
            This page is maintained by Humanity Pathways Global (HPG). It describes the
            accessibility features currently implemented in the site's code and how to
            report issues.
          </p>

          <h2 className="font-display">What we do today</h2>
          <ul>
            <li>Semantic HTML landmarks, headings, and lists throughout pages.</li>
            <li>Keyboard-operable navigation, forms, dialogs, and menus.</li>
            <li>ARIA labels on icon-only controls, social links, and interactive markers.</li>
            <li>Focus-visible styles inherited from the site's design tokens.</li>
            <li>Descriptive alt text on content images.</li>
            <li>
              Reduced-motion support: the staff and board globe pauses its auto-rotation
              and other decorative motion when your operating system requests reduced motion.
            </li>
            <li>
              Fallback experiences: if the interactive globe fails to load, the full team
              directory remains available as a searchable, filterable list.
            </li>
            <li>Responsive layouts that adapt to small screens and support browser zoom.</li>
          </ul>

          <h2 className="font-display">Known limitations</h2>
          <p>
            Some embedded third-party content (for example the Tumblr blog feed and
            Mapbox map tiles) is rendered by external services. We work to keep our own
            wrappers accessible, but we do not control the internal markup of these
            embeds. Instagram content is not embedded on this site; the Instagram
            section is a plain link to our external profile.
          </p>

          <h2 className="font-display">Report a barrier</h2>
          <p>
            If you encounter an accessibility barrier on this site, please use the{" "}
            <a href="/contact-us">Contact Us</a> page and describe the page, the issue,
            and the assistive technology or browser you were using. We will follow up as
            soon as we reasonably can.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
