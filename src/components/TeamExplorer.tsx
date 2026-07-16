import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useSearchParams } from "react-router-dom";
import mapboxgl, { type GeoJSONSource, type LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Search, RotateCcw, MapIcon, List, X, Users2 } from "lucide-react";
import {
  TEAM,
  DEPARTMENTS,
  COMMITTEES,
  COUNTRIES,
  REGIONS,
  type TeamMember,
  getMemberById,
} from "@/data/team";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2lsYmVydGZvdXN0IiwiYSI6ImNtZTIyYnI1cDBtdXIyaW9saWI5bmV5cTMifQ.NZE2WIrkVbvVoopIaPXmkQ";

mapboxgl.accessToken = MAPBOX_TOKEN;

const INITIAL_CENTER: [number, number] = [20, 20];
const INITIAL_ZOOM = 1.6;

type KindFilter = "all" | "staff" | "board";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Build a GeoJSON FeatureCollection from the members that have coordinates. */
function toFeatureCollection(members: TeamMember[]) {
  return {
    type: "FeatureCollection" as const,
    features: members
      .filter((m) => m.coordinates)
      .map((m) => ({
        type: "Feature" as const,
        properties: { id: m.id, name: m.name, kind: m.kind, dept: m.dept },
        geometry: {
          type: "Point" as const,
          coordinates: m.coordinates as [number, number],
        },
      })),
  };
}

/** Build a DOM element for an individual (unclustered) photo marker. */
function createPhotoMarkerEl(
  member: TeamMember,
  onActivate: () => void,
  isSelected: boolean
): HTMLElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "hpg-team-marker";
  btn.setAttribute(
    "aria-label",
    `${member.name}, ${member.title}, ${member.country}. Open profile.`
  );
  btn.dataset.memberId = member.id;
  btn.style.cssText = `
    all: unset;
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; border-radius: 9999px;
    border: 3px solid ${isSelected ? "hsl(var(--accent))" : "white"};
    box-shadow: 0 2px 10px rgba(0,0,0,0.35);
    cursor: pointer; overflow: hidden;
    background: hsl(var(--primary));
    color: white; font-weight: 700; font-size: 13px;
    outline-offset: 3px;
  `;
  if (member.photo) {
    const img = document.createElement("img");
    img.src = member.photo;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    btn.appendChild(img);
  } else {
    btn.textContent = initials(member.name);
  }
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    onActivate();
  });
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  });
  return btn;
}

interface GlobeProps {
  members: TeamMember[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onLoaded: () => void;
  onError: (err: Error) => void;
  paused: boolean;
  setPaused: (p: boolean) => void;
  resetToken: number;
}

/** Encapsulates all Mapbox lifecycle. */
function TeamGlobe({
  members,
  selectedId,
  onSelect,
  onLoaded,
  onError,
  paused,
  setPaused,
  resetToken,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const styleReadyRef = useRef(false);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const spinRef = useRef<number | null>(null);
  const selectedIdRef = useRef(selectedId);
  const membersRef = useRef(members);
  const onSelectRef = useRef(onSelect);
  const setPausedRef = useRef(setPaused);

  selectedIdRef.current = selectedId;
  membersRef.current = members;
  onSelectRef.current = onSelect;
  setPausedRef.current = setPaused;

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !styleReadyRef.current) return;
    const source = map.getSource("team") as GeoJSONSource | undefined;
    if (!source) return;

    // Ask supercluster which points are visible at this zoom.
    const rendered = map.querySourceFeatures("team");
    const seen = new Set<string>();

    for (const feat of rendered) {
      const props = feat.properties || {};
      if (props.cluster) continue;
      const id = props.id as string;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const member = membersRef.current.find((m) => m.id === id);
      if (!member || !member.coordinates) continue;

      let marker = markersRef.current.get(id);
      const isSelected = selectedIdRef.current === id;

      if (!marker) {
        const el = createPhotoMarkerEl(
          member,
          () => onSelectRef.current(id),
          isSelected
        );
        marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat(member.coordinates)
          .addTo(map);
        markersRef.current.set(id, marker);
      } else {
        // Update selection styling in place
        const el = marker.getElement();
        el.style.border = `3px solid ${isSelected ? "hsl(var(--accent))" : "white"}`;
      }
    }

    // Remove markers for members no longer visible or no longer in filter.
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }
  }, []);

  // Initialize the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        projection: "globe",
        attributionControl: true,
      });
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
      return;
    }
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: false }), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");

    map.on("error", (e) => {
      // Surface catastrophic style/network errors to the parent
      console.error("Mapbox error", e && e.error);
    });

    map.on("style.load", () => {
      try {
        map.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(40, 50, 70)",
          "star-intensity": 0.15,
        });

        map.addSource("team", {
          type: "geojson",
          data: toFeatureCollection(membersRef.current),
          cluster: true,
          clusterRadius: 45,
          clusterMaxZoom: 6,
        });

        map.addLayer({
          id: "team-clusters",
          type: "circle",
          source: "team",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "hsl(210, 40%, 96%)",
            "circle-stroke-color": "hsl(210, 20%, 40%)",
            "circle-stroke-width": 2,
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              5,
              26,
              10,
              32,
            ],
            "circle-opacity": 0.95,
          },
        });

        map.addLayer({
          id: "team-cluster-count",
          type: "symbol",
          source: "team",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-size": 13,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          },
          paint: { "text-color": "#111" },
        });

        // Invisible hit-target layer for unclustered points so keyboard/mouse
        // clicks on the underlying map still register at low zooms before the
        // DOM marker is placed.
        map.addLayer({
          id: "team-points",
          type: "circle",
          source: "team",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": 12,
            "circle-color": "hsl(var(--primary))",
            "circle-opacity": 0,
          },
        });

        map.on("click", "team-clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["team-clusters"],
          });
          const clusterId = features[0]?.properties?.cluster_id;
          const src = map.getSource("team") as GeoJSONSource | undefined;
          if (!src || typeof clusterId !== "number") return;
          src.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            const geom = features[0].geometry as { coordinates: [number, number] };
            map.easeTo({
              center: geom.coordinates as LngLatLike,
              zoom,
              duration: 800,
            });
          });
        });

        map.on("click", "team-points", (e) => {
          const id = e.features?.[0]?.properties?.id as string | undefined;
          if (id) onSelectRef.current(id);
        });

        for (const layerId of ["team-clusters", "team-points"]) {
          map.on("mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
          });
        }

        map.on("moveend", renderMarkers);
        map.on("sourcedata", (e) => {
          if (e.sourceId === "team" && e.isSourceLoaded) renderMarkers();
        });

        styleReadyRef.current = true;
        renderMarkers();
        onLoaded();
      } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    });

    // Pause auto-rotation on any interaction
    const pause = () => setPausedRef.current(true);
    const canvas = map.getCanvasContainer();
    canvas.addEventListener("mousedown", pause);
    canvas.addEventListener("touchstart", pause, { passive: true });
    canvas.addEventListener("wheel", pause, { passive: true });
    canvas.addEventListener("mousemove", pause, { passive: true });
    canvas.addEventListener("keydown", pause);
    canvas.addEventListener("focusin", pause);

    return () => {
      canvas.removeEventListener("mousedown", pause);
      canvas.removeEventListener("touchstart", pause);
      canvas.removeEventListener("wheel", pause);
      canvas.removeEventListener("mousemove", pause);
      canvas.removeEventListener("keydown", pause);
      canvas.removeEventListener("focusin", pause);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      styleReadyRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update source data when filtered members change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReadyRef.current) return;
    const src = map.getSource("team") as GeoJSONSource | undefined;
    if (src) {
      src.setData(toFeatureCollection(members));
      renderMarkers();
    }
  }, [members, renderMarkers]);

  // Fly-to on selection change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const member = getMemberById(selectedId);
    if (!member?.coordinates) return;
    map.easeTo({
      center: member.coordinates,
      zoom: Math.max(map.getZoom(), 3.5),
      duration: prefersReducedMotion() ? 0 : 1200,
    });
    // Refresh marker outlines for selection
    renderMarkers();
  }, [selectedId, renderMarkers]);

  // Reset view
  useEffect(() => {
    if (resetToken === 0) return;
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      duration: prefersReducedMotion() ? 0 : 900,
    });
  }, [resetToken]);

  // Auto-rotation loop — respects paused + reduced motion
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (paused || prefersReducedMotion()) return;

    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!mapRef.current) return;
      if (mapRef.current.getZoom() < 3) {
        const center = mapRef.current.getCenter();
        center.lng -= dt * 4; // ~4°/s
        mapRef.current.setCenter(center);
      }
      spinRef.current = requestAnimationFrame(tick);
    };
    spinRef.current = requestAnimationFrame(tick);
    return () => {
      if (spinRef.current !== null) cancelAnimationFrame(spinRef.current);
      spinRef.current = null;
    };
  }, [paused]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive globe showing HPG team members"
      className="h-full w-full"
      style={{ minHeight: "420px" }}
    />
  );
}

// ────────────────────────────────────────────────────────────────
// Exported explorer — used by both the Staff and Board pages
// ────────────────────────────────────────────────────────────────

export interface TeamExplorerProps {
  /** Restrict to a subset (e.g., only board) — defaults to all team members */
  scope?: "all" | "staff" | "board";
  /** Section title */
  title?: string;
  /** Subtitle line */
  subtitle?: string;
}

export default function TeamExplorer({
  scope = "all",
  title = "Humanity Pathways Global — Team",
  subtitle,
}: TeamExplorerProps) {
  const scoped = useMemo(
    () => (scope === "all" ? TEAM : TEAM.filter((m) => m.kind === scope)),
    [scope]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSelected = searchParams.get("p");

  const [selectedId, setSelectedIdState] = useState<string | null>(
    urlSelected && scoped.some((m) => m.id === urlSelected) ? urlSelected : null
  );
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<KindFilter>(
    scope === "all" ? "all" : (scope as KindFilter)
  );
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [committeeFilter, setCommitteeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);
  const [rotationPaused, setRotationPaused] = useState<boolean>(() =>
    prefersReducedMotion()
  );
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [resetToken, setResetToken] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // React to prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => {
      if (mq.matches) setRotationPaused(true);
    };
    // Some jsdom envs lack addEventListener on MediaQueryList
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scoped.filter((m) => {
      if (kindFilter !== "all" && m.kind !== kindFilter) return false;
      if (deptFilter !== "all" && m.dept !== deptFilter) return false;
      if (
        committeeFilter !== "all" &&
        !m.committees.some((c) => c === committeeFilter)
      )
        return false;
      if (regionFilter !== "all" && m.region !== regionFilter) return false;
      if (countryFilter !== "all" && m.country !== countryFilter) return false;
      if (q) {
        const hay = `${m.name} ${m.title} ${m.dept} ${m.country} ${m.committees.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    scoped,
    kindFilter,
    deptFilter,
    committeeFilter,
    regionFilter,
    countryFilter,
    search,
  ]);

  const countriesTotal = useMemo(
    () => new Set(filtered.map((m) => m.country)).size,
    [filtered]
  );

  const setSelectedId = useCallback(
    (id: string | null) => {
      setSelectedIdState(id);
      const next = new URLSearchParams(searchParams);
      if (id) next.set("p", id);
      else next.delete("p");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const selectedMember = selectedId ? getMemberById(selectedId) ?? null : null;

  const resetView = () => {
    setSearch("");
    setKindFilter(scope === "all" ? "all" : (scope as KindFilter));
    setDeptFilter("all");
    setCommitteeFilter("all");
    setRegionFilter("all");
    setCountryFilter("all");
    setSelectedId(null);
    setResetToken((t) => t + 1);
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[data-role="team-item"]') ??
        []
    );
    const idx = items.findIndex((el) => el === document.activeElement);
    const next = e.key === "ArrowDown"
      ? items[Math.min(items.length - 1, idx + 1)]
      : items[Math.max(0, idx - 1)];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  return (
    <section
      className="bg-background py-16"
      aria-labelledby="hpg-team-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2
          id="hpg-team-heading"
          className="mb-2 text-center font-display text-3xl font-bold text-foreground"
        >
          {title}
        </h2>
        <p
          className="mb-6 text-center text-sm text-muted-foreground"
          aria-live="polite"
        >
          {subtitle ? `${subtitle} · ` : ""}
          <span data-testid="team-total">
            {filtered.length} team member{filtered.length !== 1 ? "s" : ""}
          </span>
          {" across "}
          <span data-testid="team-country-total">
            {countriesTotal} countr{countriesTotal !== 1 ? "ies" : "y"}
          </span>
        </p>

        {/* Mobile view toggle */}
        <div
          role="tablist"
          aria-label="View toggle"
          className="mb-3 flex justify-center gap-1 lg:hidden"
        >
          <button
            role="tab"
            aria-selected={mobileView === "map"}
            onClick={() => setMobileView("map")}
            className={`inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm ${
              mobileView === "map"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            }`}
          >
            <MapIcon className="h-4 w-4" aria-hidden="true" /> Map
          </button>
          <button
            role="tab"
            aria-selected={mobileView === "list"}
            onClick={() => setMobileView("list")}
            className={`inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm ${
              mobileView === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            }`}
          >
            <List className="h-4 w-4" aria-hidden="true" /> List
          </button>
        </div>

        <div
          className="flex flex-col gap-3 lg:flex-row"
          style={{ minHeight: "540px" }}
        >
          {/* Globe */}
          <div
            className={`relative flex-1 overflow-hidden rounded-xl border border-border ${
              mobileView === "list" ? "hidden lg:block" : ""
            }`}
            style={{ minHeight: "420px" }}
          >
            {mapError ? (
              <div
                role="alert"
                className="flex h-full min-h-[420px] flex-col items-center justify-center gap-2 bg-muted/40 p-6 text-center"
              >
                <Users2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <p className="font-medium text-foreground">
                  The interactive map couldn't load.
                </p>
                <p className="max-w-md text-sm text-muted-foreground">
                  You can still browse the team using the directory on the right.
                </p>
              </div>
            ) : (
              <>
                {!mapReady && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div
                        className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
                        aria-hidden="true"
                      />
                      <span className="text-sm">Loading globe…</span>
                    </div>
                  </div>
                )}
                <TeamGlobe
                  members={filtered}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onLoaded={() => setMapReady(true)}
                  onError={(err) => {
                    console.error(err);
                    setMapError(err);
                    setMapReady(true);
                  }}
                  paused={rotationPaused}
                  setPaused={setRotationPaused}
                  resetToken={resetToken}
                />
                <div className="absolute bottom-3 left-3 z-10 flex gap-2">
                  <button
                    type="button"
                    onClick={resetView}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background/90 px-3 py-1.5 text-sm text-foreground shadow-sm backdrop-blur hover:bg-background"
                    aria-label="Reset globe view and filters"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotationPaused((p) => !p)}
                    aria-pressed={!rotationPaused}
                    className="inline-flex items-center rounded-md border border-border bg-background/90 px-3 py-1.5 text-sm text-foreground shadow-sm backdrop-blur hover:bg-background"
                  >
                    {rotationPaused ? "Play rotation" : "Pause rotation"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Panel */}
          <div
            className={`flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card lg:w-[380px] lg:min-w-[320px] lg:max-w-[440px] ${
              mobileView === "map" ? "hidden lg:flex" : ""
            }`}
          >
            <div className="space-y-3 border-b border-border bg-muted/40 p-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <label htmlFor="team-search" className="sr-only">
                  Search team members
                </label>
                <input
                  id="team-search"
                  type="search"
                  placeholder="Search team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {scope === "all" && (
                <fieldset className="flex items-center gap-3 text-sm">
                  <legend className="sr-only">Filter by team kind</legend>
                  {(["all", "staff", "board"] as const).map((k) => (
                    <label
                      key={k}
                      className="inline-flex items-center gap-1.5 text-foreground"
                    >
                      <input
                        type="radio"
                        name="team-kind"
                        value={k}
                        checked={kindFilter === k}
                        onChange={() => setKindFilter(k)}
                        className="accent-primary"
                      />
                      {k === "all" ? "All" : k[0].toUpperCase() + k.slice(1)}
                    </label>
                  ))}
                </fieldset>
              )}

              <div className="grid grid-cols-2 gap-2">
                <label className="sr-only" htmlFor="filter-region">
                  Filter by region
                </label>
                <select
                  id="filter-region"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                >
                  <option value="all">All regions</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <label className="sr-only" htmlFor="filter-country">
                  Filter by country
                </label>
                <select
                  id="filter-country"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                >
                  <option value="all">All countries</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <label className="sr-only" htmlFor="filter-dept">
                  Filter by department
                </label>
                <select
                  id="filter-dept"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                >
                  <option value="all">All departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <label className="sr-only" htmlFor="filter-committee">
                  Filter by committee
                </label>
                <select
                  id="filter-committee"
                  value={committeeFilter}
                  onChange={(e) => setCommitteeFilter(e.target.value)}
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground"
                >
                  <option value="all">All committees</option>
                  {COMMITTEES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ul
              ref={listRef}
              onKeyDown={onListKeyDown}
              className="flex-1 overflow-auto"
              aria-label="Team member directory"
            >
              {filtered.length === 0 && (
                <li className="p-6 text-center text-sm text-muted-foreground">
                  No team members match your filters.
                </li>
              )}
              {filtered.map((m) => {
                const isActive = m.id === selectedId;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      data-role="team-item"
                      data-member-id={m.id}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setSelectedId(m.id)}
                      className={`flex w-full items-start gap-3 border-b border-border/50 p-3 text-left transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive ? "bg-accent/10" : ""
                      }`}
                    >
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt=""
                          loading="lazy"
                          className="h-10 w-10 flex-shrink-0 rounded-full border border-border object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                        >
                          {initials(m.name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {m.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.title}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded-full border border-border bg-background px-1.5 py-0.5 text-[11px] text-foreground">
                            {m.dept}
                          </span>
                          <span className="rounded-full border border-border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                            {m.country}
                          </span>
                          {m.kind === "board" && (
                            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] text-primary-foreground">
                              Board
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Detail panel */}
        {selectedMember && (
          <div
            role="dialog"
            aria-modal="false"
            aria-labelledby="team-detail-name"
            className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {selectedMember.photo ? (
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  className="h-24 w-24 flex-shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
                >
                  {initials(selectedMember.name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      id="team-detail-name"
                      className="font-display text-xl font-bold text-foreground"
                    >
                      {selectedMember.name}
                    </h3>
                    <p className="text-sm text-primary">{selectedMember.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Close profile"
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedMember.dept} · {selectedMember.country} · {selectedMember.region}
                </p>
                {selectedMember.committees.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedMember.committees.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                {selectedMember.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {selectedMember.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
