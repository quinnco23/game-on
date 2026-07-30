import { describe, it, expect } from "vitest";

import { applyPlay } from "./playEngine";
import { createGameState } from "./createGameState";

describe("playEngine", () => {
  it("returns an error when no game state is provided", () => {
    const result = applyPlay(null, { playType: "single" });

    expect(result.ok).toBe(false);
    expect(result.errors[0].code).toBe("MISSING_GAME_STATE");
  });

  it("increments the version after a valid play", () => {
    const game = createGameState({
      status: "active",
      version: 0,
    });

    const play = {
      playType: "single",
      batter: {
        id: "1",
        name: "Jake",
      },
    };

    const result = applyPlay(game, play);

    expect(result.ok).toBe(true);
    expect(result.state.version).toBe(1);
  });


  it("places the batter on first after a single", () => {
  const game = createGameState({
    status: "active",
  });

  const play = {
    playType: "single",
    batter: {
      id: "1",
      name: "Jake",
    },
  };

  const result = applyPlay(game, play);

  expect(result.ok).toBe(true);
  expect(result.state.bases.first).toEqual({
    id: "1",
    name: "Jake",
  });
});

it("moves the existing runner from first to second on a single", () => {
    const game = createGameState({
      status: "active",
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const play = {
      playType: "single",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "second",
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.state.bases.first).toEqual({
      id: "1",
      name: "Jake",
    });
  
    expect(result.state.bases.second).toEqual({
      id: "2",
      name: "Sam",
    });
  });

  it("scores the runner from third on a single", () => {
    const game = createGameState({
      status: "active",
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: {
          id: "3",
          name: "Luis",
        },
        third: {
          id: "4",
          name: "Chris",
        },
      },
    });
  
    const play = {
      playType: "single",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "second",
        second: "third",
        third: "home",
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.state.bases.first).toEqual({
      id: "1",
      name: "Jake",
    });
  
    expect(result.state.bases.second).toEqual({
      id: "2",
      name: "Sam",
    });
  
    expect(result.state.bases.third).toEqual({
      id: "3",
      name: "Luis",
    });
  
    expect(result.metadata.runsScored).toBe(1);
  });

  it("adds scored runs to the away score in the top half", () => {
    const game = createGameState({
      status: "active",
      half: "top",
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: null,
        third: {
          id: "4",
          name: "Chris",
        },
      },
    });
  
    const play = {
      playType: "single",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        third: "home",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.runsScored).toBe(1);
    expect(result.state.score.away).toBe(1);
    expect(result.state.score.home).toBe(0);
  });

  it("adds scored runs to the home score in the bottom half", () => {
    const game = createGameState({
      status: "active",
      half: "bottom",
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: null,
        third: {
          id: "4",
          name: "Chris",
        },
      },
    });
  
    const play = {
      playType: "single",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        third: "home",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.runsScored).toBe(1);
    expect(result.state.score.home).toBe(1);
    expect(result.state.score.away).toBe(0);
  });

  it("adds runs to the existing score", () => {
    const game = createGameState({
      status: "active",
      half: "top",
      score: {
        home: 2,
        away: 3,
      },
      bases: {
        first: null,
        second: null,
        third: {
          id: "4",
          name: "Chris",
        },
      },
    });
  
    const play = {
      playType: "single",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        third: "home",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.state.score.away).toBe(4);
    expect(result.state.score.home).toBe(2);
  });

  it("adds multiple runs scored on the same play", () => {
    const game = createGameState({
      status: "active",
      half: "top",
      score: {
        home: 1,
        away: 2,
      },
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: {
          id: "3",
          name: "Luis",
        },
        third: {
          id: "4",
          name: "Chris",
        },
      },
    });
  
    const play = {
      playType: "double",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "third",
        second: "home",
        third: "home",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.runsScored).toBe(2);
    expect(result.state.score.away).toBe(4);
    expect(result.state.score.home).toBe(1);
  
    expect(result.state.bases.second).toEqual({
      id: "1",
      name: "Jake",
    });
  
    expect(result.state.bases.third).toEqual({
      id: "2",
      name: "Sam",
    });
  });
  it("records an out when a runner is retired", () => {
    const game = createGameState({
      status: "active",
      outs: 0,
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "out",
      },
    });
  
    
    expect(result.ok).toBe(true);
expect(result.metadata.outsRecorded).toBe(1);
expect(result.state.outs).toBe(1);

  });

  it("ends the half inning when the third out is recorded", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 2,
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "out",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(1);
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });

  it("advances to the next inning after the third out in the bottom half", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "bottom",
      outs: 2,
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "out",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("top");
    expect(result.state.inning).toBe(2);
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });
  it("records multiple outs on the same play", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 0,
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "out",
        batter: "out",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(2);
    expect(result.state.outs).toBe(2);
    expect(result.state.half).toBe("top");
    expect(result.state.inning).toBe(1);
  });

  it("ends the half inning when a double play produces the third out", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 1,
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "out",
        batter: "out",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(2);
    expect(result.metadata.halfInningEnded).toBe(true);
  
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(1);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });

  it("ends the half inning when a double play starts with two outs", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 2,
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        first: "out",
        batter: "out",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(2);
    expect(result.metadata.halfInningEnded).toBe(true);
  
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(1);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });
  it("does not score a run when the third out is a force out", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 2,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: null,
        third: {
          id: "runner-3",
          name: "Alex",
        },
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "batter-1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        third: "home",
        first: "out",
        batter: "first",
      },
  
      thirdOut: {
        type: "force",
        runner: "first",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.halfInningEnded).toBe(true);
  
    expect(result.metadata.runsScored).toBe(0);
    expect(result.state.score.away).toBe(0);
  
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(1);
  });

  it("counts a run when the runner scores before a non-force third out", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 2,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: null,
        third: {
          id: "runner-3",
          name: "Alex",
        },
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "batter-1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        third: "home",
        first: "out",
        batter: "first",
      },
  
      thirdOut: {
        type: "tag",
        runner: "first",
        runScoredBeforeOut: true,
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.halfInningEnded).toBe(true);
    expect(result.metadata.thirdOutWasForce).toBe(false);
  
    expect(result.metadata.runsScored).toBe(1);
    expect(result.state.score.away).toBe(1);
  
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(1);
  });

  it("does not count a run when the runner reaches home after a non-force third out", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 2,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: null,
        third: {
          id: "runner-3",
          name: "Alex",
        },
      },
    });
  
    const play = {
      playType: "fielderChoice",
      batter: {
        id: "batter-1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play, {
      runnerDecisions: {
        third: "home",
        first: "out",
        batter: "first",
      },
  
      thirdOut: {
        type: "tag",
        runner: "first",
        runScoredBeforeOut: false,
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.halfInningEnded).toBe(true);
    expect(result.metadata.thirdOutWasForce).toBe(false);
  
    expect(result.metadata.runsScored).toBe(0);
    expect(result.state.score.away).toBe(0);
  
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(1);
  });

  it("records a strikeout and leaves all runners in place", () => {
    const game = createGameState({
      status: "active",
      inning: 1,
      half: "top",
      outs: 1,
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: {
          id: "runner-2",
          name: "Alex",
        },
        third: null,
      },
    });
  
    const play = {
      playType: "strikeout",
      batter: {
        id: "batter-1",
        name: "Jake",
      },
    };
  
    const result = applyPlay(game, play);
  
    expect(result.ok).toBe(true);
  
    expect(result.metadata.outsRecorded).toBe(1);
  
    expect(result.state.outs).toBe(2);
  
    expect(result.state.bases).toEqual({
      first: {
        id: "runner-1",
        name: "Sam",
      },
      second: {
        id: "runner-2",
        name: "Alex",
      },
      third: null,
    });
  });
  
});