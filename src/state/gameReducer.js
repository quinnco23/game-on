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
      const homeTeam = action.homeTeam || state.homeTeam
      const awayTeam = action.awayTeam || state.awayTeam
    
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
          [homeTeam]: action.homeLineup ?? [],
          [awayTeam]: action.awayLineup ?? [],
        },
    
        gameRoster: {
          [homeTeam]: action.homeRoster ?? [],
          [awayTeam]: action.awayRoster ?? [],
        },
    
        battingIndex: {
          [homeTeam]: 0,
          [awayTeam]: 0,
        },
    
        stats: createEmptyGameStats(),
      }
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
      
        const endsPlateAppearance =
          result.metadata?.playDefinition
            ?.endsPlateAppearance !== false;
      
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
      
            runnerStats:
              result.metadata?.runnerStats ?? [],
          },
        );
      
        const battingTeam =
          state.half === "top"
            ? state.awayTeam
            : state.homeTeam;
      
        const battingLineup =
          state.lineups?.[battingTeam] ?? [];
      
        const currentBattingIndex =
          state.battingIndex?.[battingTeam] ?? 0;
      
        const nextBattingIndex =
          endsPlateAppearance &&
          battingLineup.length > 0
            ? (currentBattingIndex + 1) %
              battingLineup.length
            : currentBattingIndex;
      
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
        };
      
        const {
          history: _previousHistory,
          ...stateWithoutHistory
        } = state;
      
        const historyEntry =
          structuredClone(stateWithoutHistory);
      
        return {
          ...state,
      
          history: [
            ...(state.history ?? []),
            historyEntry,
          ],
      
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
      
          balls:
            endsPlateAppearance
              ? 0
              : state.balls,
      
          strikes:
            endsPlateAppearance
              ? 0
              : state.strikes,
      
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
case "UNDO": {
  const history = state.history ?? [];

  if (history.length === 0) {
    return state;
  }

  const previous = history[history.length - 1];

  return {
    ...previous,
    history: history.slice(0, -1),
  };
}

    case "END_GAME":
      return { ...state, status: "summary" };

      case "SET_DEFENSIVE_POSITION": {
        const {
          team,
          position,
          playerId,
        } = action
      
        return {
          ...state,
      
          defense: {
            ...state.defense,
      
            [team]: {
              ...state.defense?.[team],
      
              [position]: playerId,
            },
          },
        }
      }
      case "PITCH": {
        const pitch = action.pitch
      
        let balls = state.balls ?? 0
        let strikes = state.strikes ?? 0
      
        if (pitch.result === "ball") {
          balls += 1
        }
      
        if (
          pitch.result === "calledStrike" ||
          pitch.result === "swingingStrike"
        ) {
          strikes += 1
        }
      
        if (pitch.result === "foul") {
          if (strikes < 2) {
            strikes += 1
          }
        }
      
        return {
          ...state,
      
          balls,
          strikes,
      
          pitchEvents: [
            ...(state.pitchEvents ?? []),
            pitch,
          ],
        }
      }

      case "CHANGE_PITCHER": {
        const {
          team,
          playerId,
        } = action
      
        const currentDefense = {
          ...(state.defense?.[team] ?? {}),
        }
      
        const oldPitcherId =
          currentDefense.P ?? null
      
        // Find where the incoming pitcher is currently playing.
        const incomingPlayerPosition =
          Object.entries(currentDefense)
            .find(
              ([position, currentPlayerId]) =>
                position !== "P" &&
                currentPlayerId === playerId
            )?.[0] ?? null
      
        // Put incoming player on the mound.
        currentDefense.P = playerId
      
        // If incoming pitcher was already on the field,
        // move the old pitcher into that vacated position.
        if (
          incomingPlayerPosition &&
          oldPitcherId
        ) {
          currentDefense[incomingPlayerPosition] =
            oldPitcherId
        }
      
        const pitcherChange = {
          id: crypto.randomUUID(),
      
          type: "pitcherChange",
          team,
      
          playerInId: playerId,
          playerOutId: oldPitcherId,
      
          fromPosition:
            incomingPlayerPosition,
      
          oldPitcherNewPosition:
            incomingPlayerPosition,
      
          inning: state.inning,
          half: state.half,
      
          timestamp: Date.now(),
        }
      
        return {
          ...state,
      
          defense: {
            ...state.defense,
            [team]: currentDefense,
          },
      
          substitutions: [
            ...(state.substitutions ?? []),
            pitcherChange,
          ],
        }
      }

      case "PITCH_EVENT": {
        const nextStats =
          accumulateGameStats(
            state.stats,
            {
              pitcherId:
                action.pitcherId,
      
              pitcherStats:
                action.pitcherStats,
            }
          )
      
        return {
          ...state,
      
          stats: nextStats,
      
          pitchEvents: [
            ...(state.pitchEvents ?? []),
            action.pitchEvent,
          ],
        }
      }

      

    default:
      return state;
  }

  
}

