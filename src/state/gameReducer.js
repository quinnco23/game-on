import {
  applyWalk,
  applyHit,
  applyHomeRun,
  applyOut,
  advanceRunner,
  logEvent,
} from "./gameLogic"
import { applyResolvedHit } from "./gameLogic"

import {
  accumulateGameStats,
  createEmptyGameStats,
} from "../scoring/gameStatAccumulator";


export function gameReducer(state, action) {
  
  switch (action.type) {
    case "START_GAME": {
      
      const homeTeam = action.homeTeam || state.homeTeam;
      const awayTeam = action.awayTeam || state.awayTeam;
      return {
        ...state,
  id: action.gameId,
  status: "scoring",
  homeTeam,
  awayTeam,
        score: {
          [homeTeam]: 0,
          [awayTeam]: 0,
        },
        lineups: {
          [homeTeam]: action.homeLineup,
          [awayTeam]: action.awayLineup,
        },
        battingIndex: {
          [homeTeam]: 0,
          [awayTeam]: 0,
        },
        stats: createEmptyGameStats(),
      };
    }

    case "LOAD_GAME":
      return action.game;
    case "BALL": {
      const nextBalls = state.balls + 1;
      if (nextBalls >= 4) {
        return applyWalk(state);
      }
      return logEvent({ ...state, balls: nextBalls }, "Ball");
    }

    case "STRIKE": {
      const nextStrikes = state.strikes + 1;
      if (nextStrikes >= 3) {
        return applyOut(state, "Strikeout");
      }
      return logEvent({ ...state, strikes: nextStrikes }, "Strike");
    }

    case "FOUL": {
      const nextStrikes = Math.min(2, state.strikes + 1);
      return logEvent({ ...state, strikes: nextStrikes }, "Foul ball");
    }


    case "RESOLVE_PLAY":
      return applyResolvedHit(state, action.resolution);

    case "OUT":
      return applyOut(state, action.label || "Out");
      
      case "REACHED_ON_ERROR":
        return applyReachedOnError(state, action)

    case "SINGLE":
      return applyHit(state, "Single", 1);

    case "DOUBLE":
      return applyHit(state, "Double", 2);

    case "TRIPLE":
      return applyHit(state, "Triple", 3);

    case "HOME_RUN":
      return applyHomeRun(state);

    case "ADVANCE_RUNNER":
      return advanceRunner(state, action.from, action.to);

      case "APPLY_PLAY_RESULT": {
  const {
    result,
    batterId,
    pitcherId,
  } = action;

  if (!result?.ok) {
    return state;
  }

  const stats = accumulateGameStats(
    state.stats,
    {
      batterId,
      pitcherId,

      batterStats:
        result.metadata?.batterStats,

      pitcherStats:
        result.metadata?.pitcherStats,

      fielderStats:
        result.metadata?.fielderStats ?? [],
    },
  );

  /*
   * Determine who was batting before the play changed
   * the inning or half-inning.
   */
  const battingTeam =
  state.half === "top"
    ? state.awayTeam
    : state.homeTeam

    const battingLineup =
  state.lineups?.[battingTeam] ?? []

const currentBattingIndex =
  state.battingIndex?.[battingTeam] ?? 0

const nextBattingIndex =
  battingLineup.length > 0
    ? (currentBattingIndex + 1) % battingLineup.length
    : currentBattingIndex

const feedEvent = {
  id:
    result.metadata?.playId ??
    crypto.randomUUID(),

  inning: state.inning,
  half: state.half,
  team: battingTeam,

  event_type:
    result.metadata?.playType ??
    "play",

  label:
    action.label ??
    `${result.metadata?.playType ?? "Play"}`,

  player_id: batterId ?? null,

  runs:
    result.metadata?.runsScored ?? 0,

  rbi:
    result.metadata?.rbiCount ?? 0,

  outs_recorded:
    result.metadata?.outsRecorded ?? 0,

  details:
    result.metadata?.event ?? {},
}

      

  return {
    ...state,

    bases: result.state.bases,

    score: {
      ...state.score,

      [state.homeTeam]:
        result.state.score.home,

      [state.awayTeam]:
        result.state.score.away,
    },

    outs: result.state.outs,
    half: result.state.half,
    inning: result.state.inning,
    version: result.state.version,

    /*
     * A completed plate appearance resets the count.
     */
    balls: 0,
    strikes: 0,

    battingIndex: {
      ...state.battingIndex,

      [battingTeam]:
        nextBattingIndex,
    },

    events: [
      ...(state.events ?? []),
      feedEvent,
    ],

    stats,
  };
}
    case "UNDO":
      // V1 placeholder: real undo should keep a history stack.
      return logEvent(state, "Undo requested");

    case "END_GAME":
      return { ...state, status: "summary" };

    

    default:
      return state;
  }
}

