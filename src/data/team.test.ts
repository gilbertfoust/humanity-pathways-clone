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
});
