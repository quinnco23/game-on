// src/scoring/deriveFielderStats.test.js

import { describe, expect, it } from "vitest";
import { deriveFielderStats } from "./deriveFielderStats";

describe("deriveFielderStats", () => {
  it("returns no fielding stats when no fielders are supplied", () => {
    const result = deriveFielderStats({
      playType: "single",
      event: {},
    });

    expect(result).toEqual([]);
  });

  it("credits a putout on an unassisted groundout", () => {
    const result = deriveFielderStats({
      playType: "groundOut",

      event: {
        fielding: {
          putouts: ["first-baseman"],
          assists: [],
          errors: [],
        },
      },
    });

    expect(result).toEqual([
      {
        fielderId: "first-baseman",
        putouts: 1,
        assists: 0,
        errors: 0,
        doublePlays: 0,
        triplePlays: 0,
      },
    ]);
  });

  it("credits an assist and putout on a groundout", () => {
    const result = deriveFielderStats({
      playType: "groundOut",

      event: {
        fielding: {
          putouts: ["first-baseman"],
          assists: ["shortstop"],
          errors: [],
        },
      },
    });

    expect(result).toEqual([
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
    ]);
  });

  it("credits an error to the responsible fielder", () => {
    const result = deriveFielderStats({
      playType: "reachedOnError",

      event: {
        fielding: {
          putouts: [],
          assists: [],
          errors: ["third-baseman"],
        },
      },
    });

    expect(result).toEqual([
      {
        fielderId: "third-baseman",
        putouts: 0,
        assists: 0,
        errors: 1,
        doublePlays: 0,
        triplePlays: 0,
      },
    ]);
  });

  it("credits all participants in a double play", () => {
    const result = deriveFielderStats({
      playType: "groundOut",

      event: {
        doublePlay: true,

        fielding: {
          putouts: [
            "second-baseman",
            "first-baseman",
          ],

          assists: [
            "shortstop",
            "second-baseman",
          ],

          errors: [],
        },
      },
    });

    expect(result).toEqual([
      {
        fielderId: "second-baseman",
        putouts: 1,
        assists: 1,
        errors: 0,
        doublePlays: 1,
        triplePlays: 0,
      },
      {
        fielderId: "first-baseman",
        putouts: 1,
        assists: 0,
        errors: 0,
        doublePlays: 1,
        triplePlays: 0,
      },
      {
        fielderId: "shortstop",
        putouts: 0,
        assists: 1,
        errors: 0,
        doublePlays: 1,
        triplePlays: 0,
      },
    ]);
  });

  it("does not give duplicate double-play credit to one fielder", () => {
    const result = deriveFielderStats({
      playType: "groundOut",

      event: {
        doublePlay: true,

        fielding: {
          putouts: ["second-baseman"],
          assists: ["second-baseman"],
          errors: [],
        },
      },
    });

    expect(result).toEqual([
      {
        fielderId: "second-baseman",
        putouts: 1,
        assists: 1,
        errors: 0,
        doublePlays: 1,
        triplePlays: 0,
      },
    ]);
  });

  it("credits all participants in a triple play", () => {
    const result = deriveFielderStats({
      playType: "groundOut",

      event: {
        triplePlay: true,

        fielding: {
          putouts: [
            "third-baseman",
            "second-baseman",
            "first-baseman",
          ],

          assists: [
            "shortstop",
            "second-baseman",
          ],

          errors: [],
        },
      },
    });

    expect(result).toHaveLength(4);

    for (const fielder of result) {
      expect(fielder.triplePlays).toBe(1);
      expect(fielder.doublePlays).toBe(0);
    }
  });

  it("can record multiple errors on one play", () => {
    const result = deriveFielderStats({
      playType: "reachedOnError",

      event: {
        fielding: {
          putouts: [],
          assists: [],
          errors: [
            "shortstop",
            "left-fielder",
          ],
        },
      },
    });

    expect(result).toEqual([
      {
        fielderId: "shortstop",
        putouts: 0,
        assists: 0,
        errors: 1,
        doublePlays: 0,
        triplePlays: 0,
      },
      {
        fielderId: "left-fielder",
        putouts: 0,
        assists: 0,
        errors: 1,
        doublePlays: 0,
        triplePlays: 0,
      },
    ]);
  });
});