import { createEngineResult } from "./createEngineResult";
import { resolveRunnerMovement } from "./runnerEngine";
import { getPlayDefinition } from "./playTypes";

export function applyPlay(gameState, playResult, context = {}) {
    if (!gameState) {
      return createEngineResult({
        ok: false,
        state: gameState,
        errors: [
          {
            code: "MISSING_GAME_STATE",
            message: "A game state is required.",
          },
        ],
      });
    }
  
    if (!playResult?.playType) {
      return createEngineResult({
        ok: false,
        state: gameState,
        errors: [
          {
            code: "MISSING_PLAY_TYPE",
            message: "A play type is required.",
          },
        ],
      });
    }
  
    const previousVersion = gameState.version ?? 0;
  
    let nextState = structuredClone(gameState);
    const events = [];
    const warnings = [];
  
    const playDefinition = getPlayDefinition(playResult.playType);

const runnerResult = resolveRunnerMovement({
  bases: nextState.bases,
  batter: playResult.batter,

  batterDestination:
    context.runnerDecisions?.batter ??
    playDefinition?.batterDestination ??
    getBatterDestination(playResult.playType),

  runnerDecisions: context.runnerDecisions ?? {},

  holdExistingRunners:
    playDefinition?.holdExistingRunners ?? false,
});
      if (runnerResult.ok === false) {
        return runnerResult;
      }
      
      const rawRunsScored = runnerResult.runsScored ?? 0;
      const outsRecorded = runnerResult.outsRecorded ?? 0;
      
      const totalOuts = (gameState.outs ?? 0) + outsRecorded;
      const halfInningEnded = totalOuts >= 3;
      
      const thirdOutWasForce =
  halfInningEnded &&
  context.thirdOut?.type === "force";

const runScoredAfterThirdOut =
  halfInningEnded &&
  context.thirdOut?.type === "tag" &&
  context.thirdOut?.runScoredBeforeOut === false;

const runsScored =
  thirdOutWasForce || runScoredAfterThirdOut
    ? 0
    : rawRunsScored;
  
    const nextHalf = halfInningEnded
      ? gameState.half === "top"
        ? "bottom"
        : "top"
      : gameState.half;
  
    const nextInning =
      halfInningEnded && gameState.half === "bottom"
        ? (gameState.inning ?? 1) + 1
        : gameState.inning ?? 1;
  
    const nextScore = {
      home: gameState.score?.home ?? 0,
      away: gameState.score?.away ?? 0,
    };
  
    if (gameState.half === "top") {
      nextScore.away += runsScored;
    } else {
      nextScore.home += runsScored;
    }
  
    nextState = {
      ...nextState,
      bases: halfInningEnded
        ? {
            first: null,
            second: null,
            third: null,
          }
        : runnerResult.bases,
      score: nextScore,
      outs: halfInningEnded ? 0 : totalOuts,
      half: nextHalf,
      inning: nextInning,
      version: previousVersion + 1,
    };
  
    events.push(...(runnerResult.runnerAdvances ?? []));
  
    return createEngineResult({
      state: nextState,
      events,
      warnings,
      metadata: {
        playId: playResult.id,
        playType: playResult.playType,
      
        // Static information from playTypes.js
        playDefinition: playDefinition?.metadata ?? {},
      
        // Information supplied for this specific play
        event: playResult.metadata ?? {},
      
        previousVersion,
        nextVersion: previousVersion + 1,
        runsScored,
        outsRecorded,
        runnerAdvances: runnerResult.runnerAdvances ?? [],
        thirdOutWasForce,
        halfInningEnded,
        runScoredAfterThirdOut,
      },
    });
  
    function getBatterDestination(playType) {
      const destinationMap = {
        single: "first",
        double: "second",
        triple: "third",
        homeRun: "home",
        walk: "first",
      };
  
      return destinationMap[playType] ?? null;
    }
  }