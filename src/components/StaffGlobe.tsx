import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Search } from "lucide-react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2lsYmVydGZvdXN0IiwiYSI6ImNtZTIyYnI1cDBtdXIyaW9saWI5bmV5cTMifQ.NZE2WIrkVbvVoopIaPXmkQ";

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

function createPhotoMarkerEl(member: TeamMember): HTMLElement {
  const el = document.createElement("div");
  el.className = "staff-globe-marker";
  el.style.cssText = `
    width: 48px; height: 48px; border-radius: 50%; border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer; overflow: hidden;
    background: hsl(var(--primary)); display: flex; align-items: center; justify-content: center;
  `;
  if (member.img) {
    const img = document.createElement("img");
    img.src = member.img;
    img.alt = member.name;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    el.appendChild(img);
  } else {
    const initials = member.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
    el.innerHTML = `<span style="color:white;font-weight:700;font-size:14px;">${initials}</span>`;
  }
  return el;
}

function createClusterMarkerEl(count: number): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = `
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.85); border: 2px solid rgba(0,0,0,0.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: flex; align-items: center;
    justify-content: center; cursor: pointer;
    font-weight: 600; font-size: 14px; color: #333;
  `;
  el.textContent = String(count);
  return el;
}

function MapboxGlobe({ members, focusTarget }: { members: TeamMember[]; focusTarget: TeamMember | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [20, 20],
      zoom: 1.8,
      projection: "globe",
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(186, 210, 235)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.02,
        "space-color": "rgb(40, 50, 70)",
        "star-intensity": 0.15,
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when members change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Simple clustering: group nearby members
    const clusters: { members: TeamMember[]; lat: number; lng: number }[] = [];
    const used = new Set<number>();
    const THRESHOLD = 5; // degrees

    members.forEach((m, i) => {
      if (used.has(i)) return;
      const group: TeamMember[] = [m];
      used.add(i);
      members.forEach((m2, j) => {
        if (used.has(j)) return;
        if (Math.abs(m.lat - m2.lat) < THRESHOLD && Math.abs(m.lng - m2.lng) < THRESHOLD) {
          group.push(m2);
          used.add(j);
        }
      });
      const avgLat = group.reduce((s, g) => s + g.lat, 0) / group.length;
      const avgLng = group.reduce((s, g) => s + g.lng, 0) / group.length;
      clusters.push({ members: group, lat: avgLat, lng: avgLng });
    });

    clusters.forEach((cluster) => {
      let el: HTMLElement;
      if (cluster.members.length === 1) {
        el = createPhotoMarkerEl(cluster.members[0]);
      } else {
        // If any member has an image, show the first one with image; otherwise show count
        const withImg = cluster.members.find((m) => m.img);
        if (withImg && cluster.members.length <= 2) {
          el = createPhotoMarkerEl(withImg);
        } else {
          el = createClusterMarkerEl(cluster.members.length);
        }
      }

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([cluster.lng, cluster.lat])
        .addTo(map);

      // Popup with names
      const popupHtml = cluster.members
        .map((m) => `<strong>${m.name}</strong><br/><span style="font-size:12px;color:#666">${m.title}</span>`)
        .join("<hr style='margin:4px 0;border-color:#eee'/>");
      marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml));

      markersRef.current.push(marker);
    });
  }, [members]);

  // Fly to focus target
  useEffect(() => {
    if (!focusTarget || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [focusTarget.lng, focusTarget.lat],
      zoom: 4,
      duration: 1500,
    });
  }, [focusTarget]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-xl"
      style={{ minHeight: "420px" }}
    />
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
          <div className="flex-1 overflow-hidden rounded-xl border border-border" style={{ minHeight: "420px" }}>
            <MapboxGlobe members={filtered} focusTarget={focusTarget} />
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
