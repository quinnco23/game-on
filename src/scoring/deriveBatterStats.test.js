import { describe, expect, it } from "vitest";
import { deriveBatterStats } from "./deriveBatterStats";

describe("deriveBatterStats", () => {
  it("credits a single and one total base", () => {
    const stats = deriveBatterStats({
      playType: "single",

      playDefinition: {
        isAtBat: true,
        isHit: true,
      },

      event: {},
      rbiCount: 1,
      runsScored: 1,
    });

    expect(stats).toMatchObject({
      plateAppearances: 1,
      atBats: 1,
      hits: 1,
      singles: 1,
      totalBases: 1,
      rbi: 1,
    });
  });

  it("credits four total bases for a home run", () => {
    const stats = deriveBatterStats({
      playType: "homeRun",

      playDefinition: {
        isAtBat: true,
        isHit: true,
      },

      event: {
        batterScored: true,
      },

      rbiCount: 2,
      runsScored: 2,
    });

    expect(stats).toMatchObject({
      plateAppearances: 1,
      atBats: 1,
      hits: 1,
      homeRuns: 1,
      runs: 1,
      rbi: 2,
      totalBases: 4,
    });
  });

  it("credits a walk without an at-bat", () => {
    const stats = deriveBatterStats({
      playType: "walk",

      playDefinition: {
        isAtBat: false,
        isHit: false,
      },

      event: {},
      rbiCount: 0,
      runsScored: 0,
    });

    expect(stats).toMatchObject({
      plateAppearances: 1,
      atBats: 0,
      hits: 0,
      walks: 1,
      totalBases: 0,
    });
  });

  it("credits a strikeout and an at-bat", () => {
    const stats = deriveBatterStats({
      playType: "strikeout",

      playDefinition: {
        isAtBat: true,
        isHit: false,
      },

      event: {},
      rbiCount: 0,
      runsScored: 0,
    });

    expect(stats).toMatchObject({
      plateAppearances: 1,
      atBats: 1,
      hits: 0,
      strikeouts: 1,
    });
  });

  it("does not credit a hit for reaching on an error", () => {
    const stats = deriveBatterStats({
      playType: "reachedOnError",

      playDefinition: {
        isAtBat: true,
        isHit: false,
      },

      event: {},
      rbiCount: 0,
      runsScored: 0,
    });

    expect(stats).toMatchObject({
      plateAppearances: 1,
      atBats: 1,
      hits: 0,
      reachedOnError: 1,
    });
  });

  it("records grounding into a double play", () => {
    const stats = deriveBatterStats({
      playType: "groundOut",

      playDefinition: {
        isAtBat: true,
        isHit: false,
      },

      event: {
        doublePlay: true,
      },

      rbiCount: 0,
      runsScored: 0,
    });

    expect(stats).toMatchObject({
      plateAppearances: 1,
      atBats: 1,
      groundedIntoDoublePlay: 1,
      rbi: 0,
    });
  });

  
});