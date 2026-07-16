// Centralized team roster for the Staff page, Board page, and interactive globe.
// This is the single source of truth — do not duplicate members in page code.

export type TeamKind = "staff" | "board";

export type TeamMember = {
  /** stable slug id, used for URL deep linking */
  id: string;
  name: string;
  /** Job title (staff) or board title (e.g. "Chairperson") */
  title: string;
  kind: TeamKind;
  /** Functional department (e.g. Executive, Finance) */
  dept: string;
  /** Committee memberships (chair roles included) */
  committees: string[];
  country: string;
  region: TeamRegion;
  /** [lng, lat] — omitted for members without a mapped location */
  coordinates?: [number, number];
  photo?: string;
  bio?: string;
  /** True for Executive Cabinet listing on the Staff page */
  isCabinet?: boolean;
  /** True for the Executive Committee listing on the Board page */
  isExecutive?: boolean;
};

export const REGIONS = [
  "North America",
  "Latin America & Caribbean",
  "Europe",
  "Africa",
  "Middle East",
  "Asia",
  "Oceania",
] as const;
export type TeamRegion = (typeof REGIONS)[number];

const COUNTRY_REGION: Record<string, TeamRegion> = {
  "United States": "North America",
  Canada: "North America",
  "Canada / Ghana": "North America",
  Mexico: "Latin America & Caribbean",
  Brazil: "Latin America & Caribbean",
  "Puerto Rico": "Latin America & Caribbean",
  Italy: "Europe",
  Kenya: "Africa",
  Nigeria: "Africa",
  Uganda: "Africa",
  Ghana: "Africa",
  Syria: "Middle East",
  China: "Asia",
  India: "Asia",
  Indonesia: "Asia",
  "South Korea": "Asia",
};

export function regionForCountry(country: string): TeamRegion {
  return COUNTRY_REGION[country] ?? "Asia";
}

const PHOTO = {
  gilbert:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_5059.JPG",
  myron:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/81d90cd6-4fe5-46c4-8499-ff53bc54c9b7.jpg",
  moreen:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/0001.jpg",
  jimmy:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_9768.jpg",
  justina:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Untitled%20Project%20(2).png",
  shawn:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/unnamed.jpg",
  rodrigo:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/1560905290614.jpg",
  anastasia:
    "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Anastasia%20Windy.jpg",
} as const;

// Slug helper — keep pure and predictable so ids are stable.
export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Seed = Omit<TeamMember, "id" | "region"> & { region?: TeamRegion };

const seed: Seed[] = [
  // ── Executive Cabinet (Staff) ─────────────────────────
  {
    name: "Gilbert Foust",
    title: "Chief Executive Officer, Chairperson",
    kind: "staff",
    dept: "Executive",
    country: "United States",
    coordinates: [-83.05, 42.33],
    photo: PHOTO.gilbert,
    committees: [],
    isCabinet: true,
    isExecutive: true,
    bio: "Gilbert Foust earned an AA & BA in International Studies and an MA in Professional Communications. His professional experience encompasses two decades of international community project development.",
  },
  {
    name: "Myron Mageto",
    title: "Chief Financial Officer, Executive VP, Treasurer",
    kind: "staff",
    dept: "Finance",
    country: "United States",
    coordinates: [-77.04, 38.9],
    photo: PHOTO.myron,
    committees: ["Finance Committee Chair"],
    isCabinet: true,
    isExecutive: true,
    bio: "Mr. Mageto attained a B.A. in Theological Studies and graduate studies in International Management. He made significant contributions to NATO and the U.S. Departments of State and Defense.",
  },
  {
    name: "Moreen C. Ronoh",
    title: "Chief Communications Officer, VP",
    kind: "staff",
    dept: "Communications",
    country: "Kenya",
    coordinates: [36.82, -1.29],
    photo: PHOTO.moreen,
    committees: [],
    isCabinet: true,
    bio: "Moreen is a passionate storyteller with experience in marketing and digital strategy. She is the founder of Unlimited Sis Initiative, dedicated to menstrual and mental health equity.",
  },
  {
    name: "Jimmy Shen",
    title: "Chief Technology Officer, VP",
    kind: "staff",
    dept: "Technology",
    country: "China",
    coordinates: [121.47, 31.23],
    photo: PHOTO.jimmy,
    committees: [],
    isCabinet: true,
    bio: "Jimmy Shen has a Masters in Computer Science and Electronics Engineering from Shanghai University. He oversees HPG IT sub-departments with over 40 specialists.",
  },
  {
    name: "Justina Chidinma Ubah",
    title: "General Counsel",
    kind: "staff",
    dept: "Legal",
    country: "Nigeria",
    coordinates: [3.38, 6.52],
    photo: PHOTO.justina,
    committees: [],
    isCabinet: true,
    bio: "Justina is a passionate legal professional specializing in family law and child welfare advocacy. A graduate of the University of Ilorin.",
  },
  {
    name: "Shawn McDonough",
    title: "Compliance Officer / Chief Program Officer",
    kind: "staff",
    dept: "Programs",
    country: "United States",
    coordinates: [-87.63, 41.88],
    photo: PHOTO.shawn,
    committees: ["Compliance Committee Chair"],
    isCabinet: true,
    isExecutive: true,
    bio: "Shawn McDonough has over three decades of experience addressing complex business challenges on a global scale, with leadership roles across retail, IT, banking, automotive, and nonprofits.",
  },
  // ── Staff Directory ──────────────────────────────────
  { name: "Amanda Emotoghan", title: "Chief Administrative Officer", kind: "staff", dept: "Administration", country: "Nigeria", coordinates: [3.58, 6.52], committees: [] },
  { name: "Krisha Parekh", title: "Technology Research Specialist", kind: "staff", dept: "Technology", country: "India", coordinates: [72.88, 19.08], committees: [] },
  { name: "William White", title: "Fundraising Director", kind: "staff", dept: "Development/Fundraising", country: "United States", coordinates: [-74.01, 40.71], committees: ["Fund Development"] },
  { name: "Refa Bethanic Gea Ananda", title: "Human Resources Specialist", kind: "staff", dept: "Executive", country: "Indonesia", coordinates: [106.85, -6.21], committees: [] },
  { name: "Kadar Sheikhmous", title: "Fund Development Committee", kind: "staff", dept: "Communications", country: "Syria", coordinates: [36.29, 33.51], committees: ["Fund Development"] },
  { name: "Nyon Oozi Jackline", title: "Accountant", kind: "staff", dept: "Finance", country: "Uganda", coordinates: [32.58, 0.35], committees: [] },
  { name: "James Miller", title: "Advisory Committee", kind: "staff", dept: "Advisory/Nominations", country: "United States", coordinates: [-75.17, 39.95], committees: ["Advisory Committee"] },
  { name: "Kashish Tuteja", title: "Nominations Committee", kind: "staff", dept: "Advisory/Nominations", country: "India", coordinates: [77.21, 28.61], committees: ["Nominations Committee"] },
  { name: "Josue Rios", title: "Chief Marketing Officer", kind: "staff", dept: "Communications", country: "Puerto Rico", coordinates: [-66.11, 18.47], committees: [] },
  { name: "Kweku Quaye", title: "Financial Controller", kind: "staff", dept: "Finance", country: "Canada / Ghana", coordinates: [-0.19, 5.6], committees: [] },
  { name: "Christie Nelson", title: "Chief Development Officer", kind: "staff", dept: "Executive", country: "Canada", coordinates: [-79.38, 43.65], committees: ["Nominations Committee"] },
  { name: "David Nguyen", title: "Asia Regional Coordinator", kind: "staff", dept: "Regional", country: "South Korea", coordinates: [126.98, 37.57], committees: [] },
  { name: "Gregorio Santi", title: "European Regional Coordinator", kind: "staff", dept: "Regional", country: "Italy", coordinates: [12.5, 41.9], committees: [] },
  { name: "Maria Ramos", title: "Latin America Regional Coordinator", kind: "staff", dept: "Regional", country: "Mexico", coordinates: [-99.13, 19.43], committees: [] },
  { name: "Jane DeRosa", title: "Executive Assistant", kind: "staff", dept: "Administration", country: "Puerto Rico", coordinates: [-66.31, 18.47], committees: [] },

  // ── Board of Directors ───────────────────────────────
  {
    name: "Rodrigo Azeredo",
    title: "Vice-Chair",
    kind: "board",
    dept: "Executive",
    country: "Brazil",
    coordinates: [-43.17, -22.91],
    photo: PHOTO.rodrigo,
    committees: [],
    isExecutive: true,
    bio: "Rodrigo Azeredo is a seasoned Compliance and Risk Management professional with over 20 years of global expertise in corporate integrity, governance, and operational resilience. Fluent in English, Spanish, and Portuguese.",
  },
  {
    name: "Anastasia Windi",
    title: "Secretary",
    kind: "board",
    dept: "Executive",
    country: "Indonesia",
    coordinates: [107.05, -6.21],
    photo: PHOTO.anastasia,
    committees: [],
    isExecutive: true,
    bio: "Anastasia contributes governance and administrative leadership as Board Secretary, supporting Humanity Pathways Global's international initiatives.",
  },
  {
    name: "Colin Hill",
    title: "Board Member",
    kind: "board",
    dept: "Development/Fundraising",
    country: "United States",
    coordinates: [-84.39, 33.75],
    committees: ["Fund Development Chair", "Nominations Chair"],
  },
  {
    name: "Cheryl Hardcastle",
    title: "Board Member",
    kind: "board",
    dept: "Executive",
    country: "Canada",
    coordinates: [-82.96, 42.28],
    committees: ["Compensations Committee"],
  },
  {
    name: "Robert Williams",
    title: "Board Member",
    kind: "board",
    dept: "Advisory/Nominations",
    country: "United States",
    committees: ["Advisory Committee"],
  },
  {
    name: "Gaurav Kaushik",
    title: "Board Member",
    kind: "board",
    dept: "Finance",
    country: "India",
    committees: ["Finance Committee"],
  },
];

/** Deduplicate by slug id — last wins. */
function build(): TeamMember[] {
  const map = new Map<string, TeamMember>();
  for (const s of seed) {
    const id = slugify(s.name);
    map.set(id, {
      ...s,
      id,
      region: s.region ?? regionForCountry(s.country),
    });
  }
  return Array.from(map.values());
}

export const TEAM: TeamMember[] = build();

export const DEPARTMENTS = Array.from(new Set(TEAM.map((m) => m.dept))).sort();
export const COMMITTEES = Array.from(
  new Set(TEAM.flatMap((m) => m.committees).filter(Boolean))
).sort();
export const COUNTRIES = Array.from(new Set(TEAM.map((m) => m.country))).sort();

export const CABINET = TEAM.filter((m) => m.isCabinet);
export const STAFF = TEAM.filter((m) => m.kind === "staff");
export const BOARD = TEAM.filter((m) => m.kind === "board");
export const EXECUTIVE_COMMITTEE = TEAM.filter(
  (m) => m.isExecutive && (m.kind === "board" || m.isCabinet)
);

export function getMemberById(id: string): TeamMember | undefined {
  return TEAM.find((m) => m.id === id);
}
