import { describe, expect, it } from "vitest";

import {
  accumulateGameStats,
  createEmptyGameStats,
} from "./gameStatAccumulator";

describe("gameStatAccumulator", () => {
  it("creates an empty game-stat structure", () => {
    expect(createEmptyGameStats()).toEqual({
      batters: {},
      pitchers: {},
      fielders: {},
    });
  });

  it("adds batter stats for a player", () => {
    const result = accumulateGameStats(
      createEmptyGameStats(),
      {
        batterId: "batter-1",

        batterStats: {
          plateAppearances: 1,
          atBats: 1,
          hits: 1,
          singles: 1,
          totalBases: 1,
        },
      },
    );

    expect(result.batters["batter-1"]).toEqual({
      plateAppearances: 1,
      atBats: 1,
      hits: 1,
      singles: 1,
      totalBases: 1,
    });
  });

  it("accumulates repeated batter stats", () => {
    const afterFirstAtBat = accumulateGameStats(
      createEmptyGameStats(),
      {
        batterId: "batter-1",

        batterStats: {
          plateAppearances: 1,
          atBats: 1,
          hits: 1,
          singles: 1,
          totalBases: 1,
        },
      },
    );

    const result = accumulateGameStats(
      afterFirstAtBat,
      {
        batterId: "batter-1",

        batterStats: {
          plateAppearances: 1,
          atBats: 1,
          hits: 0,
          strikeouts: 1,
          totalBases: 0,
        },
      },
    );

    expect(result.batters["batter-1"]).toEqual({
      plateAppearances: 2,
      atBats: 2,
      hits: 1,
      singles: 1,
      strikeouts: 1,
      totalBases: 1,
    });
  });

  it("adds pitcher stats for a player", () => {
    const result = accumulateGameStats(
      createEmptyGameStats(),
      {
        pitcherId: "pitcher-1",

        pitcherStats: {
          battersFaced: 1,
          outsRecorded: 1,
          strikeouts: 1,
          hitsAllowed: 0,
          runsAllowed: 0,
          earnedRuns: 0,
        },
      },
    );

    expect(result.pitchers["pitcher-1"]).toEqual({
      battersFaced: 1,
      outsRecorded: 1,
      strikeouts: 1,
      hitsAllowed: 0,
      runsAllowed: 0,
      earnedRuns: 0,
    });
  });

  it("accumulates pitcher outs as whole outs", () => {
    const afterFirstPlay = accumulateGameStats(
      createEmptyGameStats(),
      {
        pitcherId: "pitcher-1",

        pitcherStats: {
          battersFaced: 1,
          outsRecorded: 1,
        },
      },
    );

    const result = accumulateGameStats(
      afterFirstPlay,
      {
        pitcherId: "pitcher-1",

        pitcherStats: {
          battersFaced: 1,
          outsRecorded: 2,
        },
      },
    );

    expect(result.pitchers["pitcher-1"]).toEqual({
      battersFaced: 2,
      outsRecorded: 3,
    });
  });

  it("adds stats for multiple fielders", () => {
    const result = accumulateGameStats(
      createEmptyGameStats(),
      {
        fielderStats: [
          {
            fielderId: "first-baseman",
            putouts: 1,
            assists: 0,
            errors: 0,
            doublePlays: 0,
            triplePlays: 0,
          },
          {
            fielderId: "shortstop",
            putouts: 0,
            assists: 1,
            errors: 0,
            doublePlays: 0,
            triplePlays: 0,
          },
        ],
      },
    );

    expect(result.fielders).toEqual({
      "first-baseman": {
        putouts: 1,
        assists: 0,
        errors: 0,
        doublePlays: 0,
        triplePlays: 0,
      },

      shortstop: {
        putouts: 0,
        assists: 1,
        errors: 0,
        doublePlays: 0,
        triplePlays: 0,
      },
    });
  });

  it("accumulates repeated fielding credits", () => {
    const afterFirstPlay = accumulateGameStats(
      createEmptyGameStats(),
      {
        fielderStats: [
          {
            fielderId: "shortstop",
            putouts: 0,
            assists: 1,
            errors: 0,
            doublePlays: 0,
            triplePlays: 0,
          },
        ],
      },
    );

    const result = accumulateGameStats(
      afterFirstPlay,
      {
        fielderStats: [
          {
            fielderId: "shortstop",
            putouts: 1,
            assists: 0,
            errors: 0,
            doublePlays: 0,
            triplePlays: 0,
          },
        ],
      },
    );

    expect(result.fielders.shortstop).toEqual({
      putouts: 1,
      assists: 1,
      errors: 0,
      doublePlays: 0,
      triplePlays: 0,
    });
  });

  it("does not mutate the previous game stats", () => {
    const original = {
      batters: {
        "batter-1": {
          plateAppearances: 1,
          hits: 1,
        },
      },

      pitchers: {},
      fielders: {},
    };

    const result = accumulateGameStats(original, {
      batterId: "batter-1",

      batterStats: {
        plateAppearances: 1,
        hits: 0,
        strikeouts: 1,
      },
    });

    expect(original.batters["batter-1"]).toEqual({
      plateAppearances: 1,
      hits: 1,
    });

    expect(result.batters["batter-1"]).toEqual({
      plateAppearances: 2,
      hits: 1,
      strikeouts: 1,
    });
  });

  it("ignores stat deltas without player IDs", () => {
    const result = accumulateGameStats(
      createEmptyGameStats(),
      {
        batterStats: {
          hits: 1,
        },

        pitcherStats: {
          hitsAllowed: 1,
        },

        fielderStats: [
          {
            putouts: 1,
          },
        ],
      },
    );

    expect(result).toEqual({
      batters: {},
      pitchers: {},
      fielders: {},
    });
  });
});