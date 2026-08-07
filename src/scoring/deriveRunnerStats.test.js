import { describe, expect, it } from "vitest";
import { deriveRunnerStats } from "./deriveRunnerStats";

describe("deriveRunnerStats", () => {
  it("credits a run to a runner who reaches home", () => {
    const result = deriveRunnerStats({
      runnerAdvances: [
        {
          runnerId: "runner-1",
          from: "third",
          to: "home",
          result: "scored",
        },
      ],
    });

    expect(result).toEqual([
      {
        runnerId: "runner-1",
        runs: 1,
        stolenBases: 0,
        caughtStealing: 0,
      },
    ]);
  });

  it("does not credit a run for a normal advance", () => {
    const result = deriveRunnerStats({
      runnerAdvances: [
        {
          runnerId: "runner-1",
          from: "first",
          to: "second",
          result: "advanced",
        },
      ],
    });

    expect(result).toEqual([]);
  });

  it("credits multiple scoring runners", () => {
    const result = deriveRunnerStats({
      runnerAdvances: [
        {
          runnerId: "runner-1",
          from: "third",
          to: "home",
          result: "scored",
        },
        {
          runnerId: "runner-2",
          from: "second",
          to: "home",
          result: "scored",
        },
      ],
    });

    expect(result).toEqual([
      {
        runnerId: "runner-1",
        runs: 1,
        stolenBases: 0,
        caughtStealing: 0,
      },
      {
        runnerId: "runner-2",
        runs: 1,
        stolenBases: 0,
        caughtStealing: 0,
      },
    ]);
  });

  it("credits a stolen base without crediting a run", () => {
    const result = deriveRunnerStats({
      playType: "stolenBase",
      runnerAdvances: [
        {
          runnerId: "runner-1",
          from: "first",
          to: "second",
          result: "advanced",
        },
      ],
    });

    expect(result).toEqual([
      {
        runnerId: "runner-1",
        runs: 0,
        stolenBases: 1,
        caughtStealing: 0,
      },
    ]);
  });

  it("credits caught stealing to a retired runner", () => {
    const result = deriveRunnerStats({
      playType: "caughtStealing",
  
      runnerAdvances: [
        {
          runnerId: "runner-1",
          from: "first",
          to: "out",
          out: true,
        },
      ],
    })
  
    expect(result).toEqual([
      {
        runnerId: "runner-1",
        runs: 0,
        stolenBases: 0,
        caughtStealing: 1,
      },
    ])
  })

  
});