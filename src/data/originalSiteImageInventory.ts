// AUTO-CURATED from scripts/data/original-site-image-inventory.json.
// Each entry documents an image that was recovered from the original
// humanitypathwaysglobal.com site and is now served locally from
// /images/original-hpg/. Do NOT reintroduce the original wsimg.com URL
// in rendered components — the local_path is the only public reference.

export interface OriginalSiteImage {
  /** stable id used to look this up from components */
  id: string;
  /** short human description of what the image shows */
  description: string;
  /** original page path on humanitypathwaysglobal.com */
  originalPage: string;
  /** original section/heading or person name from the source site */
  originalContext: string;
  /** canonical original source URL (kept only for provenance) */
  sourceUrl: string;
  /** local site-relative path (served from /public) */
  localPath: string;
  /** target clone route(s) where this image is used */
  targetRoutes: string[];
  status: "migrated" | "unavailable";
  /** truthful note if status !== "migrated" */
  note?: string;
}

export const originalSiteImages: OriginalSiteImage[] = [
  // ── Homepage "Who We Are" cards ────────────────────────────
  {
    id: "home-umbrella",
    description: "HPG Umbrella card image (open umbrella / shared shelter).",
    originalPage: "/",
    originalContext: "The HPG Umbrella",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/1000_F_435350274_nEZviI4FPBeYBHMnspDdsbIW3o9bC.jpg",
    localPath:
      "/images/original-hpg/1000_F_435350274_nEZviI4FPBeYBHMnspDdsbIW3o9bC-cb0eb2a7.jpg",
    targetRoutes: ["/", "/hpg-vision"],
    status: "migrated",
  },
  {
    id: "home-team",
    description: "Original HPG team photograph used on the Our Team card.",
    originalPage: "/",
    originalContext: "Our Team",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Humanity%20Pathways%20Global.jpg",
    localPath: "/images/original-hpg/Humanity-Pathways-Global-d5ce2089.jpg",
    targetRoutes: ["/"],
    status: "migrated",
  },
  {
    id: "home-gylfh",
    description: "GYLFH youth-leadership card image on the homepage.",
    originalPage: "/",
    originalContext: "Global Youth Leaders For Humanity",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/AdobeStock_283724247.jpeg",
    localPath: "/images/original-hpg/AdobeStock_283724247-685fb4f3.jpeg",
    targetRoutes: ["/", "/gylfh"],
    status: "migrated",
  },
  {
    id: "home-volunteer",
    description: "\"Volunteer virtually\" call-to-action image on the homepage.",
    originalPage: "/",
    originalContext: "Make an Impact from Anywhere",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Volunteer%20Virtually%20with%20Humanity%20Pathways%20Glo.png",
    localPath:
      "/images/original-hpg/Volunteer-Virtually-with-Humanity-Pathways-Glo-ed4ec093.png",
    targetRoutes: ["/"],
    status: "migrated",
  },
  {
    id: "home-project",
    description: "\"Have a project that serves the community?\" homepage panel.",
    originalPage: "/",
    originalContext: "Have a Project That Serves the Community",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Untitled%20design%20(3).png",
    localPath: "/images/original-hpg/Untitled-design-3-6f93651d.png",
    targetRoutes: ["/"],
    status: "migrated",
  },
  {
    id: "home-help-our-cause",
    description: "\"Help Our Cause\" donation panel image from the homepage.",
    originalPage: "/",
    originalContext: "Help Our Cause",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_6631.jpeg",
    localPath: "/images/original-hpg/IMG_6631-3d9cb697.jpeg",
    targetRoutes: ["/"],
    status: "migrated",
  },
  {
    id: "site-hero-hands",
    description: "Site-wide hero background (hands / global collaboration).",
    originalPage: "/",
    originalContext: "Global hero background reused across most pages",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/AdobeStock_344059564.jpeg",
    localPath: "/images/original-hpg/AdobeStock_344059564-fdbcb8eb.jpeg",
    targetRoutes: ["/", "/hpg-vision", "/hpg-sponsorship", "/gylfh"],
    status: "migrated",
  },

  // ── Initiative pages ───────────────────────────────────────
  {
    id: "megabridge-community",
    description: "MegaBridge Kenya community program photograph.",
    originalPage: "/megabridge-kenya",
    originalContext: "MegaBridge Kenya",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_20180611_120650_1.jpg",
    localPath: "/images/original-hpg/IMG_20180611_120650_1-4c756518.jpg",
    targetRoutes: ["/megabridge-kenya", "/hpg-initiatives"],
    status: "migrated",
  },
  {
    id: "megabridge-2",
    description: "MegaBridge Kenya field program photograph.",
    originalPage: "/megabridge-kenya",
    originalContext: "MegaBridge Kenya",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_20180525_125223_1.jpg",
    localPath: "/images/original-hpg/IMG_20180525_125223_1-0b9f5ba8.jpg",
    targetRoutes: ["/megabridge-kenya"],
    status: "migrated",
  },
  {
    id: "megabridge-3",
    description: "MegaBridge Kenya volunteer photograph.",
    originalPage: "/megabridge-kenya",
    originalContext: "MegaBridge Kenya",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_20180731_152029.jpg",
    localPath: "/images/original-hpg/IMG_20180731_152029-f5c1613f.jpg",
    targetRoutes: ["/megabridge-kenya"],
    status: "migrated",
  },
  {
    id: "megabridge-forest",
    description: "Local community forestry work photograph (MegaBridge Kenya).",
    originalPage: "/megabridge-kenya",
    originalContext: "MegaBridge Kenya",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/local-man-working-in-teh-forest-300x206.jpg",
    localPath:
      "/images/original-hpg/local-man-working-in-teh-forest-300x206-cbf30131.jpg",
    targetRoutes: ["/megabridge-kenya"],
    status: "migrated",
  },
  {
    id: "triumphant-1",
    description: "Triumphant Philippines relief operation photograph.",
    originalPage: "/triumphant-philippines",
    originalContext: "Triumphant Philippines",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_20250520_161223.jpg",
    localPath: "/images/original-hpg/IMG_20250520_161223-b2dbe75b.jpg",
    targetRoutes: ["/triumphant-philippines"],
    status: "migrated",
  },
  {
    id: "triumphant-2",
    description: "Triumphant Philippines community photograph.",
    originalPage: "/triumphant-philippines",
    originalContext: "Triumphant Philippines",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_20250520_161413.jpg",
    localPath: "/images/original-hpg/IMG_20250520_161413-5b9bad87.jpg",
    targetRoutes: ["/triumphant-philippines", "/hpg-initiatives"],
    status: "migrated",
  },
  {
    id: "triumphant-3",
    description: "Triumphant Philippines partner-network photograph.",
    originalPage: "/triumphant-philippines",
    originalContext: "Triumphant Philippines",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Messenger_creation_671113942474140.jpeg",
    localPath:
      "/images/original-hpg/Messenger_creation_671113942474140-d8758d83.jpeg",
    targetRoutes: ["/triumphant-philippines"],
    status: "migrated",
  },
  {
    id: "triumphant-4",
    description: "Triumphant Philippines partner-network photograph.",
    originalPage: "/triumphant-philippines",
    originalContext: "Triumphant Philippines",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Messenger_creation_864E3535-75F6-4CAA-9932-F5.jpeg",
    localPath:
      "/images/original-hpg/Messenger_creation_864E3535-75F6-4CAA-9932-F5-125c0fd7.jpeg",
    targetRoutes: ["/triumphant-philippines"],
    status: "migrated",
  },
  {
    id: "project-wings",
    description: "Project Wings Soaring illustration used on the original site.",
    originalPage: "/project-wings",
    originalContext: "Project Wings Soaring",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/ChatGPT%20Image%20Nov%2028%2C%202025%2C%2001_00_44%20PM.png",
    localPath:
      "/images/original-hpg/ChatGPT-Image-Nov-28-2025-01_00_44-PM-e098d429.png",
    targetRoutes: ["/project-wings"],
    status: "migrated",
  },
  {
    id: "initiatives-illustration",
    description: "HPG Initiatives page illustration used on the original site.",
    originalPage: "/hpg-initiatives",
    originalContext: "HPG Initiatives",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/ChatGPT%20Image%20Jun%2016%2C%202026%2C%2011_07_52%20PM.png",
    localPath:
      "/images/original-hpg/ChatGPT-Image-Jun-16-2026-11_07_52-PM-48c9990c.png",
    targetRoutes: ["/hpg-initiatives"],
    status: "migrated",
  },
  {
    id: "initiatives-photo-1",
    description: "Initiative program photograph reused across the initiatives grid.",
    originalPage: "/hpg-initiatives",
    originalContext: "HPG Initiatives",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG-20230523-WA0095.jpg",
    localPath: "/images/original-hpg/IMG-20230523-WA0095-91e842bf.jpg",
    targetRoutes: ["/hpg-initiatives"],
    status: "migrated",
  },
  {
    id: "initiatives-photo-2",
    description: "Initiative program photograph reused across the initiatives grid.",
    originalPage: "/hpg-initiatives",
    originalContext: "HPG Initiatives",
    sourceUrl:
      "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_1446.JPG",
    localPath: "/images/original-hpg/IMG_1446-d204cecc.jpg",
    targetRoutes: ["/hpg-initiatives"],
    status: "migrated",
  },
];

/** Local paths of images the original site was unable to provide (kept for the audit). */
export const unavailableOriginalImages: Array<{ person: string; note: string }> = [
  { person: "Afua Amankwaah", note: "Original site card used a placeholder image." },
  { person: "Ifeowula Odunuga", note: "Original site card used a placeholder image." },
  { person: "Abdikadir Bule", note: "Original site card used a placeholder image." },
];
