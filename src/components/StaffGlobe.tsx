import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

// Staff locations with lat/lng
const staffLocations: { name: string; country: string; lat: number; lng: number }[] = [
  { name: "Gilbert Foust", country: "United States", lat: 42.33, lng: -83.05 },
  { name: "Myron Mageto", country: "United States", lat: 38.9, lng: -77.04 },
  { name: "Moreen C. Ronoh", country: "Kenya", lat: -1.29, lng: 36.82 },
  { name: "Jimmy Shen", country: "China", lat: 31.23, lng: 121.47 },
  { name: "Justina Chidinma Ubah", country: "Nigeria", lat: 6.52, lng: 3.38 },
  { name: "Shawn McDonough", country: "United States", lat: 41.88, lng: -87.63 },
  { name: "Amanda Emotoghan", country: "Nigeria", lat: 6.52, lng: 3.38 },
  { name: "Krisha Parekh", country: "India", lat: 19.08, lng: 72.88 },
  { name: "William White", country: "United States", lat: 40.71, lng: -74.01 },
  { name: "Refa Bethanic Gea Ananda", country: "Indonesia", lat: -6.21, lng: 106.85 },
  { name: "Kadar Sheikhmous", country: "Syria", lat: 33.51, lng: 36.29 },
  { name: "Nyon Oozi Jackline", country: "Uganda", lat: 0.35, lng: 32.58 },
  { name: "Kashish Tuteja", country: "India", lat: 28.61, lng: 77.21 },
  { name: "Josue Rios", country: "Puerto Rico", lat: 18.47, lng: -66.11 },
  { name: "Kweku Quaye", country: "Canada / Ghana", lat: 5.6, lng: -0.19 },
  { name: "Christie Nelson", country: "Canada", lat: 43.65, lng: -79.38 },
  { name: "David Nguyen", country: "South Korea", lat: 37.57, lng: 126.98 },
  { name: "Gregorio Santi", country: "Italy", lat: 41.9, lng: 12.5 },
  { name: "Maria Ramos", country: "Mexico", lat: 19.43, lng: -99.13 },
  { name: "Jane DeRosa", country: "Puerto Rico", lat: 18.47, lng: -66.11 },
];

// Unique countries
const uniqueCountries = [...new Set(staffLocations.map((s) => s.country))];

export default function StaffGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [focusedLocation, setFocusedLocation] = useState<string | null>(null);
  const phi = useRef(0);

  useEffect(() => {
    let width = 0;
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const markers = staffLocations.map((loc) => ({
      location: [loc.lat, loc.lng] as [number, number],
      size: 0.06,
    }));

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.15, 0.35, 0.55],
      markerColor: [0.9, 0.55, 0.1],
      glowColor: [0.1, 0.2, 0.35],
      markers,
      onRender: (state: Record<string, any>) => {
        if (!pointerInteracting.current) {
          phi.current += 0.003;
        }
        state.phi = phi.current + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    } as any);

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-foreground">
          Our Global Presence
        </h2>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          {uniqueCountries.length} countries represented across our team
        </p>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
          {/* Globe */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <canvas
              ref={canvasRef}
              className="h-full w-full opacity-0 transition-opacity duration-1000"
              style={{ contain: "layout paint size" }}
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
                canvasRef.current!.style.cursor = "grab";
              }}
              onMouseMove={(e) => {
                if (pointerInteracting.current !== null) {
                  const delta = e.clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta / 200;
                }
              }}
              onTouchMove={(e) => {
                if (pointerInteracting.current !== null && e.touches[0]) {
                  const delta = e.touches[0].clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta / 100;
                }
              }}
            />
          </div>

          {/* Country list */}
          <div className="w-full lg:max-w-xs">
            <h3 className="mb-4 font-display text-lg font-bold text-foreground">
              Team by Country
            </h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2">
              {uniqueCountries.sort().map((country) => {
                const members = staffLocations.filter((s) => s.country === country);
                return (
                  <button
                    key={country}
                    onClick={() => setFocusedLocation(focusedLocation === country ? null : country)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      focusedLocation === country
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-accent/20"
                    }`}
                  >
                    <span className="font-medium">{country}</span>
                    <span className="ml-2 text-xs opacity-70">({members.length})</span>
                    {focusedLocation === country && (
                      <div className="mt-1 space-y-0.5">
                        {members.map((m) => (
                          <p key={m.name} className="text-xs opacity-80">{m.name}</p>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
