import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  TEAM,
  CABINET,
  STAFF,
  BOARD,
  DEPARTMENTS,
  COMMITTEES,
  COUNTRIES,
  regionForCountry,
  getMemberById,
  slugify,
} from "@/data/team";


describe("team data module", () => {
  it("has no duplicate ids", () => {
    const ids = TEAM.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every member a stable slug id", () => {
    for (const m of TEAM) {
      expect(m.id).toBe(slugify(m.name));
      expect(m.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("classifies every country to a region", () => {
    for (const m of TEAM) {
      expect(m.region).toBeTruthy();
      expect(m.region).toBe(regionForCountry(m.country));
    }
  });

  it("has valid coordinates when present", () => {
    for (const m of TEAM) {
      if (!m.coordinates) continue;
      const [lng, lat] = m.coordinates;
      expect(lng).toBeGreaterThanOrEqual(-180);
      expect(lng).toBeLessThanOrEqual(180);
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
    }
  });

  it("splits into staff, board, cabinet, and executive committee", () => {
    expect(STAFF.length).toBeGreaterThan(0);
    expect(BOARD.length).toBeGreaterThan(0);
    expect(CABINET.every((m) => m.isCabinet)).toBe(true);
  });

  it("exposes non-empty, sorted derived lists", () => {
    expect(DEPARTMENTS).toEqual([...DEPARTMENTS].sort());
    expect(COUNTRIES).toEqual([...COUNTRIES].sort());
    expect(COMMITTEES).toEqual([...COMMITTEES].sort());
    expect(COMMITTEES.length).toBeGreaterThan(0);
  });

  it("resolves members by id", () => {
    for (const m of TEAM.slice(0, 5)) {
      expect(getMemberById(m.id)?.name).toBe(m.name);
    }
    expect(getMemberById("does-not-exist")).toBeUndefined();
  });

  // ── Original-photo migration guarantees ────────────────
  const REQUIRED_STAFF = [
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
    "Shaneka Maxwell",
    "Christie Nelson",
    "Nydia Meijas",
    "Ezekiel Etuk",
    "Josue Rios",
  ];

  it("includes every required staff/director exactly once by normalized name", () => {
    for (const name of REQUIRED_STAFF) {
      const slug = slugify(name);
      const matches = TEAM.filter((m) => m.id === slug);
      expect(matches, `expected exactly one member for ${name}`).toHaveLength(1);
    }
  });

  it("has no duplicate normalized names or slugs across the whole roster", () => {
    const slugs = TEAM.map((m) => slugify(m.name));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("references only local /images/original-hpg/ portraits (no hotlinks)", () => {
    for (const m of TEAM) {
      if (!m.photo) continue;
      expect(m.photo).toMatch(/^\/images\/original-hpg\//);
      expect(m.photo).not.toMatch(/wsimg\.com|humanitypathwaysglobal\.com/);
    }
  });

  it("has an existing, non-empty local file for every referenced portrait", () => {
    for (const m of TEAM) {
      if (!m.photo) continue;
      const filePath = path.join(process.cwd(), "public", m.photo);
      expect(existsSync(filePath), `missing portrait file for ${m.name}: ${m.photo}`).toBe(true);
      expect(statSync(filePath).size).toBeGreaterThan(1024);
    }
  });

  it("shares the same TEAM roster across Staff/Board/Cabinet derivations", () => {
    for (const m of STAFF) expect(TEAM).toContain(m);
    for (const m of BOARD) expect(TEAM).toContain(m);
    for (const m of CABINET) expect(TEAM).toContain(m);
    // Staff and Board are disjoint by kind
    const staffIds = new Set(STAFF.map((m) => m.id));
    for (const b of BOARD) expect(staffIds.has(b.id)).toBe(false);
  });

  it("keeps team.ts free of any rendered wsimg/humanitypathwaysglobal image URL", () => {
    const src = readFileSync(path.join(process.cwd(), "src/data/team.ts"), "utf8");
    // Strip comment lines before checking
    const code = src
      .split("\n")
      .filter((l) => !l.trim().startsWith("//"))
      .join("\n");
    expect(code).not.toMatch(/https?:\/\/img\d?\.wsimg\.com/);
    expect(code).not.toMatch(/https?:\/\/(?:www\.)?humanitypathwaysglobal\.com\/[^"'\s]*\.(?:jpg|jpeg|png|webp|gif)/i);
  });
});

