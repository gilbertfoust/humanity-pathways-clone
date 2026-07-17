// Central list of public routes with SEO metadata. Consumed by the
// sitemap generator and per-route <Seo> components.

export const SITE_URL = "https://humanitypathwaysglobal.lovable.app";
export const SITE_NAME = "Humanity Pathways Global";

export interface RouteMeta {
  /** Router path (must match a <Route path> in App.tsx). */
  path: string;
  title: string;
  description: string;
  /** changefreq for sitemap.xml */
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: string;
  /** If true, omit from sitemap.xml (aliases, thank-you pages, etc.). */
  noSitemap?: boolean;
  /** If true, add noindex meta on that page. */
  noindex?: boolean;
}

export const routeMeta: RouteMeta[] = [
  { path: "/", title: `${SITE_NAME} — Empowering communities worldwide`, description: "Humanity Pathways Global creates self-sustaining communities through education, economic empowerment, human rights, and community development.", changefreq: "weekly", priority: "1.0" },
  { path: "/hpg-vision", title: `HPG Vision | ${SITE_NAME}`, description: "Our mission is to build self-sustaining communities through equitable access to education, economic resources, and social justice." },
  { path: "/hpg-initiatives", title: `HPG Initiatives | ${SITE_NAME}`, description: "Explore the regional initiatives that make up HPG's global portfolio across Africa, Asia, the Americas, and beyond." },
  { path: "/hpg-staff", title: `HPG Staff | ${SITE_NAME}`, description: "Meet the international staff behind Humanity Pathways Global, plotted on an interactive globe and searchable directory." },
  { path: "/hpg-board-of-directors", title: `HPG Board of Directors | ${SITE_NAME}`, description: "Meet the HPG board members who guide governance, strategy, and accountability across our global programs." },
  { path: "/hpg-sponsorship", title: `HPG Sponsorship | ${SITE_NAME}`, description: "Partner with HPG as a fiscal sponsor or corporate sponsor to support programs, initiatives, and grantees." },
  { path: "/hpg-blog", title: `HPG Blog | ${SITE_NAME}`, description: "Stories, updates, and reflections from Humanity Pathways Global." },
  { path: "/global-leaders-summit", title: `Global Leaders Summit | ${SITE_NAME}`, description: "Details on HPG's Next Gen Virtual Teen Summit and related global leadership events." },
  { path: "/contact-us", title: `Contact Us | ${SITE_NAME}`, description: "Get in touch with Humanity Pathways Global by email or through our secure contact form." },
  { path: "/volunteer-application", title: `Volunteer Application | ${SITE_NAME}`, description: "Apply to volunteer with Humanity Pathways Global through our multi-step application." },
  { path: "/sponsorship-application", title: `Sponsorship Application | ${SITE_NAME}`, description: "Apply for HPG fiscal sponsorship or partner as an organizational sponsor." },
  { path: "/board-application", title: `Board Application | ${SITE_NAME}`, description: "Apply to serve on the Humanity Pathways Global Board of Directors." },
  { path: "/gylfh", title: `Global Youth Leaders for Humanity (GYLFH) | ${SITE_NAME}`, description: "HPG's flagship youth leadership initiative shaping the next generation of humanitarians." },
  { path: "/nazarene-mission", title: `Youth Development Program Angola | ${SITE_NAME}`, description: "HPG's Angola youth development program in partnership with local mission partners in Luanda and Viana." },
  { path: "/megabridge-kenya", title: `MegaBridge Kenya | ${SITE_NAME}`, description: "HPG's MegaBridge Kenya initiative supporting community development and youth programs in Kenya." },
  { path: "/sante-vie-meilleure", title: `Santé Vie Meilleure Togo (SM-VM) | ${SITE_NAME}`, description: "Health and quality-of-life initiative operating in Togo under the HPG umbrella." },
  { path: "/cuba-congo", title: `CUBA Congo | ${SITE_NAME}`, description: "HPG's community upliftment initiative in the Democratic Republic of the Congo." },
  { path: "/triumphant-philippines", title: `Triumphant Philippines | ${SITE_NAME}`, description: "Disaster relief and community resilience initiative in the Philippines." },
  { path: "/project-wings", title: `Project Wings | ${SITE_NAME}`, description: "Project Wings supports youth education and mentorship under the HPG umbrella." },
  { path: "/hope-for-a-good-life", title: `Hope for a Good Life (Rwanda) | ${SITE_NAME}`, description: "HPG partner initiative supporting vulnerable communities in Rwanda." },
  { path: "/seishin-plus", title: `Seishin Plus | ${SITE_NAME}`, description: "Mental wellness and holistic development program operating under the HPG umbrella." },
  { path: "/cpbi", title: `CPBI | ${SITE_NAME}`, description: "Community Peace Building Initiative under Humanity Pathways Global." },
  { path: "/hpg-executive-academy", title: `HPG Executive Academy | ${SITE_NAME}`, description: "HPG's internal leadership development and certification academy." },
  { path: "/humble-pathways", title: `Humble Pathways | ${SITE_NAME}`, description: "Community-driven initiative operating under the HPG umbrella." },
  { path: "/mkcf-sierra-leone", title: `MKCF Sierra Leone | ${SITE_NAME}`, description: "HPG partner initiative supporting community development in Sierra Leone." },
  { path: "/youth-stem-robotics", title: `Youth STEM & Robotics | ${SITE_NAME}`, description: "HPG initiative expanding STEM and robotics access for underserved youth." },
  { path: "/rainroot-wata", title: `Rainroot WATA | ${SITE_NAME}`, description: "Water access and sanitation initiative under the HPG umbrella." },
  { path: "/humane-initiative", title: `Humane Initiative South Sudan | ${SITE_NAME}`, description: "HPG partner initiative supporting communities in South Sudan." },
  { path: "/hpg-onboarding-fee", title: `HPG Onboarding Fee | ${SITE_NAME}`, description: "Secure onboarding-fee checkout for new HPG program participants and partners.", noindex: true, noSitemap: true },
  { path: "/hpg-onboarding-fee/thank-you", title: `Thank You | ${SITE_NAME}`, description: "Onboarding-fee payment confirmation.", noindex: true, noSitemap: true },
  { path: "/unsubscribe", title: `Unsubscribe | ${SITE_NAME}`, description: "Manage or cancel your HPG email subscription.", noindex: true, noSitemap: true },
  { path: "/annual-reports", title: `Reports & Impact | ${SITE_NAME}`, description: "Humanity Pathways Global's impact reports and annual financial reports, housed together for public transparency." },
  { path: "/privacy", title: `Privacy | ${SITE_NAME}`, description: "How HPG's website handles information submitted through its public forms." },
  { path: "/accessibility", title: `Accessibility | ${SITE_NAME}`, description: "HPG's approach to keeping this website usable for everyone." },
  { path: "/terms", title: `Terms of Use | ${SITE_NAME}`, description: "Terms that apply to your use of the Humanity Pathways Global website." },
  { path: "/data-use", title: `Data Use | ${SITE_NAME}`, description: "How HPG uses information submitted through this site." },
];

export const routeMetaByPath: Record<string, RouteMeta> = Object.fromEntries(
  routeMeta.map((r) => [r.path, r])
);
