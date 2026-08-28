import { createEngineResult } from "./createEngineResult";
import { resolveRunnerMovement } from "./runnerEngine";
import { getPlayDefinition } from "./playTypes";
import { deriveBatterStats } from "./deriveBatterStats";
import { derivePitcherStats } from "./derivePitcherStats";
import { deriveFielderStats } from "./deriveFielderStats";
import { deriveRunnerStats } from "./deriveRunnerStats";

export function applyPlay(
  gameState,
  playResult,
  context = {}
) {
  console.log(
    "🔥 APPLY PLAY ENGINE FIRED",
    {
      playType:
        playResult?.playType,

      inning:
        gameState?.inning,

      half:
        gameState?.half,

      runsThisHalf:
        gameState?.runsThisHalf,

      gameRules:
        gameState?.gameRules,
    }
  )

  // existing code...
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

  const playDefinition = getPlayDefinition(playResult.playType);

  if (!playDefinition) {
    return createEngineResult({
      ok: false,
      state: gameState,
      errors: [
        {
          code: "UNKNOWN_PLAY_TYPE",
          message: `Unknown play type: ${playResult.playType}`,
        },
      ],
    });
  }

  const runnerDecisions =
    playResult.runnerDecisions ??
    context.runnerDecisions ??
    {};

  const previousVersion = gameState.version ?? 0;

  let nextState = structuredClone(gameState);
  const events = [];
  const warnings = [];

  const runnerResult = resolveRunnerMovement({
    bases: nextState.bases,
    batter: playResult.batter,

    batterDestination:
      runnerDecisions.batter ??
      playDefinition.batterDestination,

    runnerDecisions,

    holdExistingRunners:
      playDefinition.holdExistingRunners ?? false,
  });

  if (runnerResult.ok === false) {
    return runnerResult;
  }

  const rawRunsScored = runnerResult.runsScored ?? 0;
  const outsRecorded = runnerResult.outsRecorded ?? 0;
  const runnerAdvances = runnerResult.runnerAdvances ?? [];

  const totalOuts =
  (gameState.outs ?? 0) + outsRecorded;

const endedByOuts =
  totalOuts >= 3;

  const thirdOutWasForce =
  endedByOuts &&
  context.thirdOut?.type === "force";

const runScoredAfterThirdOut =
  endedByOuts &&
  context.thirdOut?.type === "tag" &&
  context.thirdOut?.runScoredBeforeOut === false;

  const runsScored =
    thirdOutWasForce || runScoredAfterThirdOut
      ? 0
      : rawRunsScored;

      const previousRunsThisHalf =
  gameState.runsThisHalf ?? 0;

const runsThisHalf =
  previousRunsThisHalf + runsScored;

const battingSide =
  gameState.half === "top"
    ? "away"
    : "home";

const runLimitRules =
  gameState.gameRules?.runLimit;

const teamRunLimit =
  runLimitRules?.[battingSide];

  console.log("RUN LIMIT CHECK:", {
    inning: gameState.inning,
    half: gameState.half,
    battingSide,
  
    gameRules:
      gameState.gameRules,
  
    runLimitRules,
    teamRunLimit,
  
    previousRunsThisHalf,
    runsScored,
    runsThisHalf,
  });

const runLimitEnabled =
  runLimitRules?.enabled === true &&
  teamRunLimit?.enabled === true;

const endedByRunLimit =
  runLimitEnabled &&
  runsThisHalf >=
    (teamRunLimit?.runs ?? Infinity);

const halfInningEnded =
  endedByOuts || endedByRunLimit;

const halfInningEndReason =
  endedByOuts
    ? "threeOuts"
    : endedByRunLimit
    ? "runLimit"
    : null;

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

  const isSacrificeFly =
  playResult.playType === "flyOut" &&
  playResult.metadata?.sacrificeFly === true

  

const isRbiEligible =
  playDefinition.metadata?.rbiEligible === true ||
  isSacrificeFly

const excludesRbi =
  playResult.metadata?.doublePlay === true ||
  playResult.metadata?.noRbi === true

const rbiCount =
  isRbiEligible &&
  runsScored > 0 &&
  !excludesRbi
    ? runsScored
    : 0

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
    
      outs:
        halfInningEnded
          ? 0
          : totalOuts,
    
      runsThisHalf:
        halfInningEnded
          ? 0
          : runsThisHalf,
    
      half: nextHalf,
      inning: nextInning,
    
      version:
        previousVersion + 1,
    };

  events.push(...runnerAdvances);

  const completedPlayMetadata = {
    playId: playResult.id,
    playType: playResult.playType,
  
    playDefinition: playDefinition.metadata ?? {},
    event: playResult.metadata ?? {},
  
    previousVersion,
    nextVersion: previousVersion + 1,
  
    runsScored,
    outsRecorded,
    runnerAdvances,
  
    thirdOutWasForce,
    halfInningEnded,
    halfInningEndReason,
    endedByOuts,
    endedByRunLimit,
    runsThisHalf,
    runScoredAfterThirdOut,
  
    rbiCount,
    isRbiPlay: rbiCount > 0,
  };
  
  const batterStats =
  deriveBatterStats(completedPlayMetadata);

const pitcherStats =
  derivePitcherStats(completedPlayMetadata);

const fielderStats =
  deriveFielderStats(completedPlayMetadata);

const runnerStats =
  deriveRunnerStats(completedPlayMetadata);
  
  return createEngineResult({
    ok: true,
    state: nextState,
    events,
    warnings,
  
    metadata: {
      ...completedPlayMetadata,
      batterStats,
      pitcherStats,
      fielderStats,
      runnerStats,
    },
  });
}