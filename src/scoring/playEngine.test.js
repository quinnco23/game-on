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

  it("records a fly out and leaves all runners in place", () => {
    const gameState = {
      version: 0,
      inning: 2,
      half: "top",
      outs: 1,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: {
          id: "3",
          name: "Alex",
        },
      },
    };
  
    const result = applyPlay(gameState, {
      id: "play-fly-out-1",
      playType: "flyOut",
      batter: {
        id: "1",
        name: "Taylor",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.state.outs).toBe(2);
  
    expect(result.state.bases).toEqual({
      first: {
        id: "2",
        name: "Sam",
      },
      second: null,
      third: {
        id: "3",
        name: "Alex",
      },
    });
  
    expect(result.state.score).toEqual({
      home: 0,
      away: 0,
    });
  });
 
it("ends the half inning when a fly out records the third out", () => {
    const gameState = {
      version: 0,
      inning: 2,
      half: "top",
      outs: 2,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: {
          id: "2",
          name: "Sam",
        },
        second: null,
        third: {
          id: "3",
          name: "Alex",
        },
      },
    };
  
    const result = applyPlay(gameState, {
      id: "play-fly-out-2",
      playType: "flyOut",
      batter: {
        id: "1",
        name: "Taylor",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.halfInningEnded).toBe(true);
  
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(2);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });

  it("allows a runner to tag up and score on a fly out", () => {
    const gameState = {
      version: 0,
      inning: 2,
      half: "top",
      outs: 0,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: null,
        third: {
          id: "3",
          name: "Alex",
        },
      },
    };
  
    const result = applyPlay(
      gameState,
      {
        id: "play-fly-out-tag-up",
        playType: "flyOut",
        batter: {
          id: "1",
          name: "Taylor",
        },
      },
      {
        runnerDecisions: {
          third: "home",
        },
      },
    );
  
    expect(result.ok).toBe(true);
  
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.runsScored).toBe(1);
  
    expect(result.state.outs).toBe(1);
    expect(result.state.score.away).toBe(1);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });

  it("allows a runner to tag from second to third on a fly out", () => {
    const gameState = {
      version: 0,
      inning: 2,
      half: "bottom",
      outs: 0,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: {
          id: "2",
          name: "Sam",
        },
        third: null,
      },
    };
  
    const result = applyPlay(
      gameState,
      {
        id: "play-fly-out-tag-second",
        playType: "flyOut",
        batter: {
          id: "1",
          name: "Taylor",
        },
      },
      {
        runnerDecisions: {
          second: "third",
        },
      },
    );
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.runsScored).toBe(0);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: {
        id: "2",
        name: "Sam",
      },
    });
  });
  it("records the batter and tagging runner as outs on a fly out", () => {
    const gameState = {
      version: 0,
      inning: 2,
      half: "top",
      outs: 0,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: null,
        third: {
          id: "3",
          name: "Alex",
        },
      },
    };
  
    const result = applyPlay(
      gameState,
      {
        id: "play-fly-out-runner-out",
        playType: "flyOut",
        batter: {
          id: "1",
          name: "Taylor",
        },
      },
      {
        runnerDecisions: {
          third: "out",
        },
      },
    );
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(2);
    expect(result.metadata.runsScored).toBe(0);
    expect(result.state.outs).toBe(2);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });

  it("records a ground out and leaves runners in place by default", () => {
    const gameState = {
      version: 0,
      inning: 3,
      half: "top",
      outs: 0,
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
    };
  
    const result = applyPlay(gameState, {
      id: "play-ground-out-1",
      playType: "groundOut",
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
      metadata: {
        fielders: ["SS", "1B"],
        notation: "6-3",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.runsScored).toBe(0);
  
    expect(result.state.outs).toBe(1);
  
    expect(result.state.bases).toEqual({
      first: {
        id: "runner-1",
        name: "Sam",
      },
      second: null,
      third: {
        id: "runner-3",
        name: "Alex",
      },
    });
  });

  it("allows a runner from third to score on a ground out", () => {
    const gameState = {
      version: 0,
      inning: 3,
      half: "top",
      outs: 0,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: null,
        third: {
          id: "runner-3",
          name: "Alex",
        },
      },
    };
  
    const result = applyPlay(
      gameState,
      {
        id: "play-ground-out-rbi",
        playType: "groundOut",
        batter: {
          id: "batter-1",
          name: "Taylor",
        },
        metadata: {
          fielders: ["2B", "1B"],
          notation: "4-3",
        },
      },
      {
        runnerDecisions: {
          third: "home",
        },
      },
    );
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.runsScored).toBe(1);
  
    expect(result.state.outs).toBe(1);
    expect(result.state.score.away).toBe(1);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  });

  it("accepts metadata for an unassisted ground out", () => {
    const gameState = {
      version: 0,
      inning: 1,
      half: "top",
      outs: 0,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: null,
        third: null,
      },
    };
  
    const result = applyPlay(gameState, {
      id: "play-ground-out-unassisted",
      playType: "groundOut",
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
      metadata: {
        fielders: ["1B"],
        notation: "3U",
        unassisted: true,
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.state.outs).toBe(1);
  });
  it("preserves ground-out event metadata", () => {
    const gameState = {
      version: 0,
      inning: 1,
      half: "top",
      outs: 0,
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: null,
        third: null,
      },
    };
  
    const result = applyPlay(gameState, {
      id: "play-ground-out-metadata",
      playType: "groundOut",
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
      metadata: {
        fielders: ["SS", "1B"],
        notation: "6-3",
        direction: "leftSide",
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.metadata.event).toEqual({
      fielders: ["SS", "1B"],
      notation: "6-3",
      direction: "leftSide",
    });
  
    expect(result.metadata.playDefinition).toMatchObject({
      category: "out",
      outType: "groundOut",
      battedBallType: "groundBall",
    });
  });
  it("records a fielder's choice when the lead runner is retired", () => {
    const gameState = createGameState({
      status: "active",
      outs: 0,
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-fc-1",
      playType: "fielderChoice",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        first: "out",
      },
  
      metadata: {
        fielders: ["SS", "2B"],
        notation: "6-4",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(1);
    expect(result.metadata.runsScored).toBe(0);
  
    expect(result.state.outs).toBe(1);
  
    expect(result.state.bases).toEqual({
      first: {
        id: "batter-1",
        name: "Taylor",
      },
      second: null,
      third: null,
    });
  });

  it("does not credit a fielder's choice as a hit", () => {
    const gameState = createGameState({
      status: "active",
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-fc-metadata",
      playType: "fielderChoice",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        first: "out",
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.metadata.playDefinition).toMatchObject({
      resultType: "fielderChoice",
      isAtBat: true,
      isHit: false,
    });
  });

  it("places the batter on first after reaching on an error", () => {
    const gameState = createGameState({
      status: "active",
      bases: {
        first: null,
        second: null,
        third: null,
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-error-1",
      playType: "reachedOnError",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      metadata: {
        errorBy: "SS",
        errorType: "fielding",
        notation: "E6",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(0);
  
    expect(result.state.bases.first).toEqual({
      id: "batter-1",
      name: "Taylor",
    });
  
    expect(result.metadata.playDefinition).toMatchObject({
      resultType: "reachedOnError",
      isHit: false,
      isError: true,
    });
  });

  it("allows runners to advance on an error", () => {
    const gameState = createGameState({
      status: "active",
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-error-advance",
      playType: "reachedOnError",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        first: "third",
        batter: "second",
      },
  
      metadata: {
        errorBy: "RF",
        errorType: "throwing",
        notation: "E9",
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: {
        id: "batter-1",
        name: "Taylor",
      },
      third: {
        id: "runner-1",
        name: "Sam",
      },
    });
  });

  it("allows a runner to score on an error", () => {
    const gameState = createGameState({
      status: "active",
      half: "top",
      score: {
        home: 0,
        away: 0,
      },
      bases: {
        first: null,
        second: {
          id: "runner-2",
          name: "Sam",
        },
        third: null,
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-error-run",
      playType: "reachedOnError",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        second: "home",
      },
  
      metadata: {
        errorBy: "2B",
        notation: "E4",
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.runsScored).toBe(1);
    expect(result.state.score.away).toBe(1);
  
    expect(result.state.bases.first).toEqual({
      id: "batter-1",
      name: "Taylor",
    });
  });

  it("preserves double-play metadata on a ground-ball play", () => {
    const gameState = createGameState({
      status: "active",
      outs: 0,
      bases: {
        first: {
          id: "runner-1",
          name: "Sam",
        },
        second: null,
        third: null,
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-double-play-metadata",
      playType: "fielderChoice",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        first: "out",
        batter: "out",
      },
  
      metadata: {
        fielders: ["SS", "2B", "1B"],
        notation: "6-4-3",
        doublePlay: true,
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(2);
  
    expect(result.metadata.event).toMatchObject({
      notation: "6-4-3",
      doublePlay: true,
    });
  });

  it("records a triple play on a ground-ball play", () => {
    const gameState = createGameState({
      status: "active",
      inning: 3,
      half: "top",
      outs: 0,
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
  
    const result = applyPlay(gameState, {
      id: "play-triple-play-1",
      playType: "fielderChoice",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        second: "out",
        first: "out",
        batter: "out",
      },
  
      metadata: {
        fielders: ["3B", "2B", "1B"],
        notation: "5-4-3",
        triplePlay: true,
      },
    });
  
    expect(result.ok).toBe(true);
    expect(result.metadata.outsRecorded).toBe(3);
    expect(result.metadata.halfInningEnded).toBe(true);
  
    expect(result.state.outs).toBe(0);
    expect(result.state.half).toBe("bottom");
    expect(result.state.inning).toBe(3);
  
    expect(result.state.bases).toEqual({
      first: null,
      second: null,
      third: null,
    });
  
    expect(result.metadata.event).toMatchObject({
      notation: "5-4-3",
      triplePlay: true,
    });
  });

  it("credits an RBI when a runner scores on a ground out", () => {
    const gameState = createGameState({
      status: "active",
      inning: 3,
      half: "top",
      outs: 0,
  
      score: {
        home: 0,
        away: 0,
      },
  
      bases: {
        first: null,
        second: null,
        third: {
          id: "runner-3",
          name: "Sam",
        },
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-ground-out-rbi",
      playType: "groundOut",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        third: "home",
      },
  
      metadata: {
        fielders: ["2B", "1B"],
        notation: "4-3",
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.metadata.runsScored).toBe(1);
    expect(result.metadata.rbiCount).toBe(1);
    expect(result.metadata.isRbiPlay).toBe(true);
  
    expect(result.state.score.away).toBe(1);
  });

  it("does not credit an RBI when no run scores on a ground out", () => {
    const gameState = createGameState({
      status: "active",
      outs: 0,
  
      bases: {
        first: null,
        second: null,
        third: null,
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-ground-out-no-rbi",
      playType: "groundOut",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      metadata: {
        fielders: ["SS", "1B"],
        notation: "6-3",
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.metadata.runsScored).toBe(0);
    expect(result.metadata.rbiCount).toBe(0);
    expect(result.metadata.isRbiPlay).toBe(false);
  });

  it("does not credit an RBI when a run scores during a ground-ball double play", () => {
    const gameState = createGameState({
      status: "active",
      half: "top",
      outs: 0,
  
      score: {
        home: 0,
        away: 0,
      },
  
      bases: {
        first: {
          id: "runner-1",
          name: "Alex",
        },
        second: null,
        third: {
          id: "runner-3",
          name: "Sam",
        },
      },
    });
  
    const result = applyPlay(gameState, {
      id: "play-ground-ball-double-play-run",
      playType: "fielderChoice",
  
      batter: {
        id: "batter-1",
        name: "Taylor",
      },
  
      runnerDecisions: {
        third: "home",
        first: "out",
        batter: "out",
      },
  
      metadata: {
        fielders: ["SS", "2B", "1B"],
        notation: "6-4-3",
        doublePlay: true,
      },
    });
  
    expect(result.ok).toBe(true);
  
    expect(result.metadata.runsScored).toBe(1);
    expect(result.metadata.outsRecorded).toBe(2);
  
    expect(result.metadata.rbiCount).toBe(0);
    expect(result.metadata.isRbiPlay).toBe(false);
  });
  
});