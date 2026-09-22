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

      const buildDefense = (lineup = []) => {
        const defense = {}
      
        lineup.forEach((player) => {
          const position =
            player.position?.trim() ||
            player.default_position?.trim() ||
            ""
      
          if (
            !position ||
            !player.id ||
            position.toUpperCase() === "BENCH"
          ) {
            return
          }
      
          defense[position.toUpperCase()] =
            player.id
        })
      
        return defense
      }
      
      const homeDefense =
      console.log("START_GAME LINEUPS RECEIVED:", {
        home: action.homeLineup,
        away: action.awayLineup,
      })
        buildDefense(action.homeLineup)
      
      const awayDefense =
      console.log("START_GAME LINEUPS RECEIVED:", {
        home: action.homeLineup,
        away: action.awayLineup,
      })
        buildDefense(action.awayLineup)
      
        console.log(
          "START GAME DEFENSE DETAIL:",
          JSON.stringify(
            {
              homeTeam,
              homeLineup: (action.homeLineup ?? []).map(
                (player) => ({
                  name: player.name,
                  id: player.id,
                  position: player.position,
                  default_position:
                    player.default_position,
                })
              ),
              homeDefense,
        
              awayTeam,
              awayLineup: (action.awayLineup ?? []).map(
                (player) => ({
                  name: player.name,
                  id: player.id,
                  position: player.position,
                  default_position:
                    player.default_position,
                })
              ),
              awayDefense,
            },
            null,
            2
          )
        )
    
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

        defense: {
          [homeTeam]: homeDefense,
          [awayTeam]: awayDefense,
        },
    
        battingIndex: {
          [homeTeam]: 0,
          [awayTeam]: 0,
        },

        gameRules:
  action.gameRules ?? {
    innings: 6,
    timeLimitMinutes: 100,
    timeLimitRule: "no_new_inning",
    allowExtraInnings: false,
  },
    
        stats: createEmptyGameStats(),
      }
    }

    case "LOAD_GAME":
      return action.game;
      case "BALL": {
        const nextBalls = state.balls + 1
      
        if (nextBalls >= 4) {
          return applyWalk(state)
        }
      
        return {
          ...state,
          balls: nextBalls,
        }
      }
      
      case "STRIKE": {
        const nextStrikes = state.strikes + 1
      
        if (nextStrikes >= 3) {
          return applyOut(
            state,
            "Strikeout"
          )
        }
      
        return {
          ...state,
          strikes: nextStrikes,
        }
      }
      
      case "FOUL": {
        const nextStrikes =
          Math.min(
            2,
            state.strikes + 1
          )
      
        return {
          ...state,
          strikes: nextStrikes,
        }
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

        console.log("RUN TRACE REDUCER BEFORE:", {
          inning: state.inning,
          half: state.half,
        
          homeTeam: state.homeTeam,
          awayTeam: state.awayTeam,
        
          scoreBefore:
            state.score,
        
          engineScore:
            result.state?.score,
        
          runsScored:
            result.metadata?.runsScored ?? 0,
        
          runsThisHalfBefore:
            state.runsThisHalf ?? 0,
        
          runsThisHalfEngine:
            result.state?.runsThisHalf ?? 0,
        })
      
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

          const sideRetired =
  result.state.half !== state.half ||
  result.state.inning !== state.inning

const nextBases =
  sideRetired
    ? {
        first: null,
        second: null,
        third: null,
      }
    : result.state.bases

    const mappedScore = {
      ...state.score,
    
      [state.homeTeam]:
        result.state?.score?.home ??
        state.score?.[state.homeTeam] ??
        0,
    
      [state.awayTeam]:
        result.state?.score?.away ??
        state.score?.[state.awayTeam] ??
        0,
    };

    console.log("RUN TRACE REDUCER AFTER:", {
      mappedScore,
    
      nextInning:
        result.state.inning,
    
      nextHalf:
        result.state.half,
    
      nextRunsThisHalf:
        result.state.runsThisHalf ?? 0,
    })
      
        return {
          ...state,
      
          history: [
            ...(state.history ?? []).slice(-49),
            historyEntry,
          ],
      
          bases: nextBases,
      
          // score: {
          //   ...state.score,
      
          //   [state.homeTeam]:
          //     result.state.score.home,
      
          //   [state.awayTeam]:
          //     result.state.score.away,
          // },

          score: mappedScore,
      
          outs: result.state.outs,
half: result.state.half,
inning: result.state.inning,

runsThisHalf:
  result.state.runsThisHalf ?? 0,

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
      
        const currentDefense = {
          ...(state.defense?.[team] ?? {}),
        }
      
        // Remove this player from any other position
        for (const [
          existingPosition,
          existingPlayerId,
        ] of Object.entries(currentDefense)) {
          if (
            existingPlayerId === playerId &&
            existingPosition !== position
          ) {
            delete currentDefense[
              existingPosition
            ]
          }
        }
      
        // Assign player to new position
        currentDefense[position] =
          playerId
      
        return {
          ...state,
      
          defense: {
            ...state.defense,
      
            [team]:
              currentDefense,
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
          ...(
            action.currentDefense ??
            state.defense?.[team] ??
            {}
          ),
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
        // Put incoming player on the mound.
currentDefense.P = playerId

// If incoming pitcher was already playing another position,
// clear that old position first.
if (incomingPlayerPosition) {
  if (oldPitcherId) {
    // Swap old pitcher into the vacated position.
    currentDefense[incomingPlayerPosition] =
      oldPitcherId
  } else {
    // No old pitcher recorded, so just clear the old position.
    delete currentDefense[incomingPlayerPosition]
  }
}

for (const [position, assignedPlayerId] of Object.entries(currentDefense)) {
  if (
    assignedPlayerId === playerId &&
    position !== "P"
  ) {
    delete currentDefense[position]
  }
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
      
        const pitchEvent =
          action.pitchEvent ?? {}
      
        const feedEvent = {
          id:
            pitchEvent.id ??
            crypto.randomUUID(),
      
          inning:
            pitchEvent.inning ??
            state.inning,
      
          half:
            pitchEvent.half ??
            state.half,
      
          timestamp:
            new Date().toLocaleTimeString(),
      
          label:
            pitchEvent.label ??
            pitchEvent.result ??
            "Pitch",
      
          event_type: "pitch",
      
          result:
            pitchEvent.result ?? null,
      
          batter:
            pitchEvent.batter ?? null,
      
          batter_id:
            pitchEvent.batterId ??
            pitchEvent.batter?.id ??
            null,
      
          pitcher_id:
            pitchEvent.pitcherId ??
            action.pitcherId ??
            null,
      
          balls_before:
            pitchEvent.ballsBefore ??
            state.balls ??
            0,
      
          strikes_before:
            pitchEvent.strikesBefore ??
            state.strikes ??
            0,
        }
      
        return {
          ...state,
      
          stats: nextStats,
      
          pitchEvents: [
            ...(state.pitchEvents ?? []),
            pitchEvent,
          ],
      
          events: [
            ...(state.events ?? []),
            feedEvent,
          ],
        }
      }

      case "START_GAME_CLOCK":
  return {
    ...state,

    gameClock: {
      ...(state.gameClock ?? {}),

      startedAt:
        action.startedAt,

      durationMinutes:
        state.gameClock
          ?.durationMinutes ??
        100,

      stoppedAt: null,

      status: "running",
    },
  }

    default:
      return state;
  }

  
}

