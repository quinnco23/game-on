// src/services/gameActions.jsx

import { saveEvent } from "./eventsService"
// import { updateGameState } from "./gamesService"
import { gameReducer } from "../state/gameReducer"
import { getCurrentBatter } from "../state/gameLogic"



export async function handleGameAction({
  game,
  dispatch,
  action,
  eventType,
  label,
  extraEventData = {},
}) {
  const batter =
    getCurrentBatter(game)

  console.log("GAME ACTION START:", {
    gameId: game?.id,
    eventType,
    label,
    inning: game?.inning,
    half: game?.half,
    outs: game?.outs,
    version: game?.version,
    online: navigator.onLine,
  })

  // Apply locally first
  dispatch(action)

  console.log("SAVE EVENT START:", {
    operation: "saveEvent",
    gameId: game?.id,
    eventType,
    label,
  })

  try {
    await saveEvent({
      game_id: game.id,

      player_id:
        extraEventData.player_id ??
        batter?.id ??
        null,

      inning: game.inning,
      half: game.half,

      event_type: eventType,
      label,

      runs:
        extraEventData.runs ?? 0,

      rbi:
        extraEventData.rbi ?? 0,

      outs_recorded:
        extraEventData.outs_recorded ?? 0,

      details: {
        ...(extraEventData.details ?? {}),

        battingTeam:
          game.half === "top"
            ? game.awayTeam
            : game.homeTeam,
      },
    })

    console.log("SAVE EVENT OK:", {
      gameId: game?.id,
      eventType,
      label,
    })
  } catch (error) {
    console.error("SAVE EVENT FAILED:", {
      operation: "saveEvent",

      gameId:
        game?.id,

      eventType,
      label,

      inning:
        game?.inning,

      half:
        game?.half,

      outs:
        game?.outs,

      version:
        game?.version,

      online:
        navigator.onLine,

      errorName:
        error?.name,

      errorMessage:
        error?.message,

      error,
    })

    throw error
  }
}