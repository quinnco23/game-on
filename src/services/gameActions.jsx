import { saveEvent } from "./eventsService"
import { updateGameState } from "./gamesService"
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
  const batter = getCurrentBatter(game)
  const nextGame = gameReducer(game, action)

  dispatch(action)

  await saveEvent({
    game_id: game.id,
    player_id: batter?.id || null,
    inning: game.inning,
    half: game.half,
    event_type: eventType,
    label,
    ...extraEventData,
  })

  await updateGameState(game.id, nextGame)
}