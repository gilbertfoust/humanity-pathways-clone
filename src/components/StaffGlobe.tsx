import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import createGlobe from "cobe";
import { Search } from "lucide-react";

type TeamMember = {
  name: string;
  title: string;
  dept: string;
  country: string;
  lat: number;
  lng: number;
  img?: string;
  type: "staff" | "board";
  committees?: string[];
};

const teamMembers: TeamMember[] = [
  { name: "Gilbert Foust", title: "CEO, Chairperson", dept: "Executive", country: "United States", lat: 42.33, lng: -83.05, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_5059.JPG", type: "staff" },
  { name: "Myron Mageto", title: "CFO, Executive VP, Treasurer", dept: "Finance", country: "United States", lat: 38.9, lng: -77.04, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/81d90cd6-4fe5-46c4-8499-ff53bc54c9b7.jpg", type: "staff", committees: ["Finance Committee Chair"] },
  { name: "Moreen C. Ronoh", title: "Chief Communications Officer, VP", dept: "Communications", country: "Kenya", lat: -1.29, lng: 36.82, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/0001.jpg", type: "staff" },
  { name: "Jimmy Shen", title: "CTO, VP", dept: "Technology", country: "China", lat: 31.23, lng: 121.47, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/IMG_9768.jpg", type: "staff" },
  { name: "Justina Chidinma Ubah", title: "General Counsel", dept: "Legal", country: "Nigeria", lat: 6.52, lng: 3.38, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Untitled%20Project%20(2).png", type: "staff" },
  { name: "Shawn McDonough", title: "Compliance Officer / CPO", dept: "Programs", country: "United States", lat: 41.88, lng: -87.63, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/unnamed.jpg", type: "staff", committees: ["Compliance Committee Chair"] },
  { name: "Amanda Emotoghan", title: "Chief Administrative Officer", dept: "Administration", country: "Nigeria", lat: 6.52, lng: 3.58, type: "staff" },
  { name: "Krisha Parekh", title: "Technology Research Specialist", dept: "Technology", country: "India", lat: 19.08, lng: 72.88, type: "staff" },
  { name: "William White", title: "Fundraising Director", dept: "Development/Fundraising", country: "United States", lat: 40.71, lng: -74.01, type: "staff", committees: ["Fund Development"] },
  { name: "Refa Bethanic Gea Ananda", title: "Human Resources Specialist", dept: "Executive", country: "Indonesia", lat: -6.21, lng: 106.85, type: "staff" },
  { name: "Kadar Sheikhmous", title: "Fund Development Committee", dept: "Communications", country: "Syria", lat: 33.51, lng: 36.29, type: "staff", committees: ["Fund Development"] },
  { name: "Nyon Oozi Jackline", title: "Accountant", dept: "Finance", country: "Uganda", lat: 0.35, lng: 32.58, type: "staff" },
  { name: "James Miller", title: "Advisory Committee", dept: "Advisory/Nominations", country: "United States", lat: 39.95, lng: -75.17, type: "staff", committees: ["Advisory Committee"] },
  { name: "Kashish Tuteja", title: "Nominations Committee", dept: "Advisory/Nominations", country: "India", lat: 28.61, lng: 77.21, type: "staff", committees: ["Nominations Committee"] },
  { name: "Josue Rios", title: "CMO", dept: "Communications", country: "Puerto Rico", lat: 18.47, lng: -66.11, type: "staff" },
  { name: "Kweku Quaye", title: "Financial Controller", dept: "Finance", country: "Canada / Ghana", lat: 5.6, lng: -0.19, type: "staff" },
  { name: "Christie Nelson", title: "CDO", dept: "Executive", country: "Canada", lat: 43.65, lng: -79.38, type: "staff" },
  { name: "David Nguyen", title: "Asia Regional Coordinator", dept: "Regional", country: "South Korea", lat: 37.57, lng: 126.98, type: "staff" },
  { name: "Gregorio Santi", title: "European Regional Coordinator", dept: "Regional", country: "Italy", lat: 41.9, lng: 12.5, type: "staff" },
  { name: "Maria Ramos", title: "Latin America Regional Coordinator", dept: "Regional", country: "Mexico", lat: 19.43, lng: -99.13, type: "staff" },
  { name: "Jane DeRosa", title: "Executive Assistant", dept: "Administration", country: "Puerto Rico", lat: 18.47, lng: -66.31, type: "staff" },
  { name: "Rodrigo Azeredo", title: "Vice-Chair", dept: "Executive", country: "Brazil", lat: -22.91, lng: -43.17, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/1560905290614.jpg", type: "board" },
  { name: "Anastasia Windi", title: "Secretary", dept: "Executive", country: "Indonesia", lat: -6.21, lng: 107.05, img: "https://img1.wsimg.com/isteam/ip/8d5502d6-d937-4d80-bd56-8074053e4d77/Anastasia%20Windy.jpg", type: "board" },
  { name: "Colin Hill", title: "Fund Development Chair / Nominations Chair", dept: "Development/Fundraising", country: "United States", lat: 33.75, lng: -84.39, type: "board", committees: ["Fund Development Chair", "Nominations Chair"] },
  { name: "Cheryl Hardcastle", title: "Compensations Committee", dept: "Executive", country: "Canada", lat: 42.28, lng: -82.96, type: "board", committees: ["Compensations Committee"] },
];

const departments = [
  "All Departments", "Executive", "Programs", "Finance", "Technology",
  "Communications", "Legal", "Development/Fundraising", "Administration",
  "Regional", "Advisory/Nominations",
];

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function Globe({ members, focusTarget }: { members: TeamMember[]; focusTarget: TeamMember | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.3);
  const widthRef = useRef(0);
  const focusRef = useRef<{ phi: number; theta: number } | null>(null);

  // Update focus target
  useEffect(() => {
    if (focusTarget) {
      focusRef.current = {
        phi: degToRad(90 - focusTarget.lat),
        theta: degToRad(-focusTarget.lng - 90),
      };
    }
  }, [focusTarget]);

  // Convert members to markers
  const markers = useMemo(() => {
    return members.map((m) => ({
      location: [m.lat, m.lng] as [number, number],
      size: m.img ? 0.08 : 0.05,
    }));
  }, [members]);

  useEffect(() => {
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
        widthRef.current = width;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    let animationId: number;

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.15, 0.2, 0.3],
      markerColor: [0.9, 0.75, 0.3],
      glowColor: [0.15, 0.2, 0.35],
      markers,
      onRender: (state) => {
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;

        // Smooth focus animation
        if (focusRef.current) {
          const distPhi = focusRef.current.phi - phiRef.current;
          const distTheta = focusRef.current.theta - thetaRef.current;
          phiRef.current += distPhi * 0.08;
          thetaRef.current += distTheta * 0.08;
          if (Math.abs(distPhi) < 0.01 && Math.abs(distTheta) < 0.01) {
            focusRef.current = null;
          }
        } else if (pointerInteracting.current === null) {
          // Auto-rotate when not interacting and not focusing
          phiRef.current += 0.003;
        }

        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.theta = thetaRef.current;
        state.markers = markers;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [markers]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ maxWidth: "100%", aspectRatio: "1" }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
            phiRef.current += (delta - (pointerInteracting.current - e.clientX + delta)) * 0;
          }
        }}
      />
    </div>
  );
}

export default function StaffGlobe() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [showStaff, setShowStaff] = useState(true);
  const [showBoard, setShowBoard] = useState(true);
  const [focusTarget, setFocusTarget] = useState<TeamMember | null>(null);

  const countries = useMemo(() => {
    const set = new Set(teamMembers.map((m) => m.country));
    return ["All Countries", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return teamMembers.filter((m) => {
      if (!showStaff && m.type === "staff") return false;
      if (!showBoard && m.type === "board") return false;
      if (deptFilter !== "All Departments" && m.dept !== deptFilter) return false;
      if (countryFilter !== "All Countries" && m.country !== countryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q) || m.country.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, deptFilter, countryFilter, showStaff, showBoard]);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-foreground">
          Humanity Pathways Global — Team
        </h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          {filtered.length} team member{filtered.length !== 1 ? "s" : ""} across{" "}
          {new Set(filtered.map((m) => m.country)).size} countries
        </p>

        <div className="flex flex-col gap-3 lg:flex-row" style={{ minHeight: "540px" }}>
          {/* Globe */}
          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-[hsl(210,29%,12%)]" style={{ minHeight: "420px" }}>
            <Globe members={filtered} focusTarget={focusTarget} />
          </div>

          {/* Panel */}
          <div className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card lg:w-[360px] lg:min-w-[300px] lg:max-w-[420px]">
            <div className="space-y-3 border-b border-border bg-muted/50 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-1.5 text-foreground">
                  <input type="checkbox" checked={showStaff} onChange={(e) => setShowStaff(e.target.checked)} className="accent-primary" />
                  Staff
                </label>
                <label className="flex items-center gap-1.5 text-foreground">
                  <input type="checkbox" checked={showBoard} onChange={(e) => setShowBoard(e.target.checked)} className="accent-primary" />
                  Board
                </label>
              </div>

              <div className="flex gap-2">
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground">
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground">
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <ul className="flex-1 overflow-auto">
              {filtered.length === 0 && (
                <li className="p-6 text-center text-sm text-muted-foreground">No team members match your filters.</li>
              )}
              {filtered.map((m) => (
                <li
                  key={m.name}
                  onClick={() => setFocusTarget(m)}
                  className="flex cursor-pointer gap-3 border-b border-border/50 p-3 transition-colors hover:bg-accent/10"
                >
                  {m.img ? (
                    <img src={m.img} alt={m.name} className="h-10 w-10 rounded-full border border-border object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded-full border border-border bg-background px-1.5 py-0.5 text-[11px] text-foreground">{m.dept}</span>
                      <span className="rounded-full border border-border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">{m.country}</span>
                      {m.type === "board" && (
                        <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] text-primary-foreground">Board</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
