import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeamExplorer from "@/components/TeamExplorer";
import { TEAM } from "@/data/team";

// Stub mapbox-gl — jsdom cannot render WebGL, and we're testing UI wiring.
vi.mock("mapbox-gl", () => {
  class Marker {
    _el: HTMLElement;
    constructor(opts: { element: HTMLElement }) {
      this._el = opts.element;
    }
    setLngLat() { return this; }
    addTo(map: { _container: HTMLElement }) { map._container.appendChild(this._el); return this; }
    getElement() { return this._el; }
    remove() { this._el.remove(); }
    setPopup() { return this; }
  }
  class NavigationControl {}
  class FullscreenControl {}
  class Map {
    _container: HTMLElement;
    _handlers: Record<string, Array<(e: unknown) => void>> = {};
    constructor(opts: { container: HTMLElement }) {
      this._container = opts.container;
      // Fire style.load asynchronously to mimic mapbox
      setTimeout(() => this._fire("style.load", {}), 0);
    }
    _fire(name: string, e: unknown) {
      (this._handlers[name] ?? []).forEach((h) => h(e));
    }
    addControl() {}
    setFog() {}
    addSource() {}
    addLayer() {}
    getSource() {
      return { setData() {}, getClusterExpansionZoom() {} };
    }
    querySourceFeatures() { return []; }
    on(name: string, layerOrHandler: unknown, handler?: unknown) {
      const fn = typeof layerOrHandler === "function" ? layerOrHandler : handler;
      if (typeof fn === "function") {
        this._handlers[name] = this._handlers[name] ?? [];
        this._handlers[name].push(fn as (e: unknown) => void);
      }
    }
    off() {}
    remove() {}
    getCanvasContainer() { return document.createElement("div"); }
    getCanvas() { return { style: { cursor: "" } }; }
    getZoom() { return 1.6; }
    getCenter() { return { lng: 0, lat: 0 }; }
    setCenter() {}
    easeTo() {}
    flyTo() {}
    queryRenderedFeatures() { return []; }
  }
  return {
    default: {
      accessToken: "",
      Map,
      Marker,
      NavigationControl,
      FullscreenControl,
    },
    Map,
    Marker,
    NavigationControl,
    FullscreenControl,
  };
});

const renderExplorer = (initialEntries: string[] = ["/staff"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <TeamExplorer scope="all" title="Test Team" />
    </MemoryRouter>
  );

describe("TeamExplorer", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it("renders every team member in the directory", () => {
    renderExplorer();
    for (const m of TEAM) {
      expect(screen.getAllByText(m.name).length).toBeGreaterThan(0);
    }
  });

  it("filters by search query", () => {
    renderExplorer();
    const input = screen.getByLabelText(/search team members/i);
    fireEvent.change(input, { target: { value: "Gilbert" } });
    // total updates in live region
    expect(screen.getByTestId("team-total")).toHaveTextContent("1 team member");
  });

  it("filters by region", () => {
    renderExplorer();
    const region = screen.getByLabelText(/filter by region/i) as HTMLSelectElement;
    fireEvent.change(region, { target: { value: "Africa" } });
    const total = Number(
      screen.getByTestId("team-total").textContent?.match(/\d+/)?.[0] ?? "0"
    );
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThan(TEAM.length);
  });

  it("filters by kind (staff only)", () => {
    renderExplorer();
    const staffRadio = screen.getByLabelText("Staff") as HTMLInputElement;
    fireEvent.click(staffRadio);
    const shown = Number(
      screen.getByTestId("team-total").textContent?.match(/\d+/)?.[0] ?? "0"
    );
    expect(shown).toBe(TEAM.filter((m) => m.kind === "staff").length);
  });

  it("selecting a directory row shows the profile detail panel", () => {
    renderExplorer();
    const button = screen.getAllByRole("button", { name: /Gilbert Foust/i })[0];
    fireEvent.click(button);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: /gilbert foust/i })).toBeInTheDocument();
  });

  it("deep-links to a member via ?p=... in the URL", () => {
    renderExplorer(["/staff?p=gilbert-foust"]);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: /gilbert foust/i })).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion by starting rotation paused", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    renderExplorer();
    const toggle = screen.getByRole("button", { name: /play rotation/i });
    // aria-pressed reflects rotation state — false means paused (not pressed = play)
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("reset button clears filters and selection", () => {
    renderExplorer(["/staff?p=gilbert-foust"]);
    // Confirm profile is shown
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Apply a filter
    fireEvent.change(screen.getByLabelText(/filter by region/i), {
      target: { value: "Africa" },
    });
    // Click reset
    fireEvent.click(screen.getByRole("button", { name: /reset globe view and filters/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByTestId("team-total")).toHaveTextContent(
      `${TEAM.length} team member`
    );
  });
});
