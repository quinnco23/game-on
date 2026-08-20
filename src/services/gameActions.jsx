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

  dispatch(action)

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
}