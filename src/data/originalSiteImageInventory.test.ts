import { describe, it, expect } from "vitest";
import { readFileSync, statSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { globSync } from "node:fs";
import {
  originalSiteImages,
  unavailableOriginalImages,
} from "@/data/originalSiteImageInventory";
import { TEAM, STAFF, BOARD, slugify } from "@/data/team";

const ROOT = process.cwd();
const IMG_DIR = resolve(ROOT, "public/images/original-hpg");

function statLocal(localPath: string) {
  const abs = resolve(ROOT, "public", localPath.replace(/^\//, ""));
  return statSync(abs);
}

// Recursively walk src/ and collect all rendered files
function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (name === "originalSiteImageInventory.ts") continue; // provenance file
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (/\.(tsx?|css|html|md)$/.test(name)) yield p;
  }
}
const SRC_FILES = Array.from(walk(resolve(ROOT, "src")));

describe("Original-site image inventory", () => {
  it("every migrated inventory entry has a nonempty local file under public/images/original-hpg", () => {
    for (const e of originalSiteImages) {
      expect(e.status).toBe("migrated");
      expect(e.localPath.startsWith("/images/original-hpg/")).toBe(true);
      const st = statLocal(e.localPath);
      expect(st.isFile()).toBe(true);
      expect(st.size).toBeGreaterThan(1000);
    }
  });

  it("records a truthful note for every unavailable original image", () => {
    for (const u of unavailableOriginalImages) {
      expect(u.person).toBeTruthy();
      expect(u.note.length).toBeGreaterThan(5);
    }
  });

  it("preserves provenance: every inventory entry keeps its original wsimg source URL", () => {
    for (const e of originalSiteImages) {
      expect(e.sourceUrl).toMatch(/img1\.wsimg\.com/);
    }
  });
});

describe("No rendered component hotlinks original-site image CDNs", () => {
  const FORBIDDEN = /https?:\/\/(?:[a-z0-9.-]+\.)?(?:wsimg\.com|godaddy(?:sites)?\.com|humanitypathwaysglobal\.com)\/[^\s"'<>)]*\.(?:jpe?g|png|gif|webp|svg)/i;
  for (const f of SRC_FILES) {
    it(`file has no image hotlink: ${f.replace(ROOT + "/", "")}`, () => {
      const body = readFileSync(f, "utf8");
      expect(body).not.toMatch(FORBIDDEN);
    });
  }
});

describe("Team registry — lower-directors coverage and image fidelity", () => {
  const REQUIRED_LOWER = [
    "Kweku Quaye",
    "Liz Roman",
    "William White",
    "Refa Bethanic Gea Ananda",
    "Nischal Timalsina",
    "Ruchitha Chowdary",
    "Twinkle Reddy Alukapally",
    "Nyon Oozi Jackline",
    "David Nguyen",
    "Maria Ramos",
    "Gregorio Santi",
    "Jane DeRosa",
  ];
  const REQUIRED_EXECS = [
    "Shaneka Maxwell",
    "Christie Nelson",
    "Nydia Meijas",
    "Ezekiel Etuk",
    "Josue Rios",
  ];

  it("every required lower-directors name is present exactly once", () => {
    for (const name of REQUIRED_LOWER) {
      const matches = TEAM.filter((m) => m.name === name);
      expect(matches, `expected exactly one entry for ${name}`).toHaveLength(1);
    }
  });

  it("every required cabinet-executive name is present exactly once", () => {
    for (const name of REQUIRED_EXECS) {
      const matches = TEAM.filter((m) => m.name === name);
      expect(matches, `expected exactly one entry for ${name}`).toHaveLength(1);
    }
  });

  it("every required lower-director has a nonempty local /images/original-hpg/ photo file", () => {
    for (const name of REQUIRED_LOWER) {
      const m = TEAM.find((x) => x.name === name)!;
      expect(m.photo, `${name} missing photo`).toBeTruthy();
      expect(m.photo!.startsWith("/images/original-hpg/")).toBe(true);
      const st = statLocal(m.photo!);
      expect(st.size).toBeGreaterThan(1000);
    }
  });

  it("every required cabinet-executive has a nonempty local photo file", () => {
    for (const name of REQUIRED_EXECS) {
      const m = TEAM.find((x) => x.name === name)!;
      expect(m.photo, `${name} missing photo`).toBeTruthy();
      const st = statLocal(m.photo!);
      expect(st.size).toBeGreaterThan(1000);
    }
  });

  it("board members with recoverable source portraits use local /images/original-hpg/ paths", () => {
    for (const m of BOARD) {
      if (!m.photo) continue;
      expect(m.photo.startsWith("/images/original-hpg/")).toBe(true);
      const st = statLocal(m.photo);
      expect(st.size).toBeGreaterThan(1000);
    }
  });

  it("no team id is duplicated, and no normalized name collides", () => {
    const ids = new Set<string>();
    const norms = new Set<string>();
    for (const m of TEAM) {
      expect(ids.has(m.id), `duplicate id ${m.id}`).toBe(false);
      ids.add(m.id);
      const norm = slugify(m.name);
      expect(norm).toBe(m.id);
      expect(norms.has(norm), `duplicate normalized name ${norm}`).toBe(false);
      norms.add(norm);
    }
  });

  it("staff registry includes lower directors and executive cabinet in the same collection", () => {
    // sanity: the STAFF export must contain every required staff name (no separate directory)
    for (const name of [...REQUIRED_LOWER, ...REQUIRED_EXECS]) {
      expect(STAFF.some((m) => m.name === name), `${name} not in STAFF`).toBe(true);
    }
  });
});

describe("Public routes with source imagery render local /images/original-hpg/ paths", () => {
  it("homepage 'Who We Are' component references local originals", () => {
    const body = readFileSync(resolve(ROOT, "src/components/WhoWeAre.tsx"), "utf8");
    expect(body).toMatch(/\/images\/original-hpg\/1000_F_435350274/);
    expect(body).toMatch(/\/images\/original-hpg\/Humanity-Pathways-Global/);
    expect(body).toMatch(/\/images\/original-hpg\/AdobeStock_283724247/);
  });
  it("MegaBridge Kenya page references local originals", () => {
    const body = readFileSync(
      resolve(ROOT, "src/pages/initiatives/MegaBridgeKenya.tsx"),
      "utf8"
    );
    expect(body).toMatch(/\/images\/original-hpg\/IMG_20180611_120650_1/);
  });
  it("Triumphant Philippines page references local originals", () => {
    const body = readFileSync(
      resolve(ROOT, "src/pages/initiatives/TriumphantPhilippines.tsx"),
      "utf8"
    );
    expect(body).toMatch(/\/images\/original-hpg\/IMG_20250520_161223/);
  });
  it("Project Wings page references its original illustration", () => {
    const body = readFileSync(
      resolve(ROOT, "src/pages/initiatives/ProjectWings.tsx"),
      "utf8"
    );
    expect(body).toMatch(
      /\/images\/original-hpg\/ChatGPT-Image-Nov-28-2025-01_00_44-PM/
    );
  });
  it("HPG Initiatives page references its original illustration", () => {
    const body = readFileSync(resolve(ROOT, "src/pages/HpgInitiatives.tsx"), "utf8");
    expect(body).toMatch(
      /\/images\/original-hpg\/ChatGPT-Image-Jun-16-2026-11_07_52-PM/
    );
  });
});
