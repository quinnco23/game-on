// src/scoring/derivePitcherStats.test.js

import { describe, expect, it } from "vitest";
import { derivePitcherStats } from "./derivePitcherStats";

describe("derivePitcherStats", () => {
  it("charges a hit after a single", () => {
    const result = derivePitcherStats({
      playType: "single",

      playDefinition: {
        isAtBat: true,
        isHit: true,
      },

      outsRecorded: 0,
      runsScored: 0,
    });

    expect(result).toEqual({
      battersFaced: 1,

      outsRecorded: 0,

      hitsAllowed: 1,
      singlesAllowed: 1,
      doublesAllowed: 0,
      triplesAllowed: 0,
      homeRunsAllowed: 0,

      walksAllowed: 0,
      strikeouts: 0,

      runsAllowed: 0,
      earnedRuns: 0,
    });
  });

  it("records a strikeout and one pitching out", () => {
    const result = derivePitcherStats({
      playType: "strikeout",

      playDefinition: {
        isAtBat: true,
        isHit: false,
      },

      outsRecorded: 1,
      runsScored: 0,
    });

    expect(result).toEqual({
      battersFaced: 1,

      outsRecorded: 1,

      hitsAllowed: 0,
      singlesAllowed: 0,
      doublesAllowed: 0,
      triplesAllowed: 0,
      homeRunsAllowed: 0,

      walksAllowed: 0,
      strikeouts: 1,

      runsAllowed: 0,
      earnedRuns: 0,
    });
  });

  it("records a walk without an at-bat or hit", () => {
    const result = derivePitcherStats({
      playType: "walk",

      playDefinition: {
        isAtBat: false,
        isHit: false,
      },

      outsRecorded: 0,
      runsScored: 0,
    });

    expect(result).toEqual({
      battersFaced: 1,

      outsRecorded: 0,

      hitsAllowed: 0,
      singlesAllowed: 0,
      doublesAllowed: 0,
      triplesAllowed: 0,
      homeRunsAllowed: 0,

      walksAllowed: 1,
      strikeouts: 0,

      runsAllowed: 0,
      earnedRuns: 0,
    });
  });

  it("charges runs scored on a hit", () => {
    const result = derivePitcherStats({
      playType: "double",

      playDefinition: {
        isAtBat: true,
        isHit: true,
      },

      outsRecorded: 0,
      runsScored: 2,
    });

    expect(result.runsAllowed).toBe(2);
    expect(result.earnedRuns).toBe(2);
    expect(result.hitsAllowed).toBe(1);
    expect(result.doublesAllowed).toBe(1);
  });

  it("does not automatically mark runs on an error as earned", () => {
    const result = derivePitcherStats({
      playType: "reachedOnError",

      playDefinition: {
        isAtBat: true,
        isHit: false,
        isError: true,
      },

      outsRecorded: 0,
      runsScored: 1,
    });

    expect(result.runsAllowed).toBe(1);
    expect(result.earnedRuns).toBe(0);
    expect(result.hitsAllowed).toBe(0);
  });

  it("uses an explicit earned-run value when supplied", () => {
    const result = derivePitcherStats({
      playType: "single",

      playDefinition: {
        isAtBat: true,
        isHit: true,
      },

      event: {
        earnedRuns: 1,
      },

      outsRecorded: 0,
      runsScored: 2,
    });

    expect(result.runsAllowed).toBe(2);
    expect(result.earnedRuns).toBe(1);
  });

  it("credits every out recorded on a double play", () => {
    const result = derivePitcherStats({
      playType: "groundOut",

      playDefinition: {
        isAtBat: true,
        isHit: false,
      },

      event: {
        doublePlay: true,
      },

      outsRecorded: 2,
      runsScored: 0,
    });

    expect(result.battersFaced).toBe(1);
    expect(result.outsRecorded).toBe(2);
  });

  it("charges a home run and any runs scored", () => {
    const result = derivePitcherStats({
      playType: "homeRun",

      playDefinition: {
        isAtBat: true,
        isHit: true,
      },

      outsRecorded: 0,
      runsScored: 3,
    });

    expect(result.hitsAllowed).toBe(1);
    expect(result.homeRunsAllowed).toBe(1);
    expect(result.runsAllowed).toBe(3);
    expect(result.earnedRuns).toBe(3);
  });

  
});