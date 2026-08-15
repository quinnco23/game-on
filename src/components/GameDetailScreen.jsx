import { useEffect, useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { getGameById } from "../services/gamesService"
import { GameScoreCard } from "./GameScoreCard"
import { BoxScore } from "./BoxScore"
import { LineScore } from "./LineScore"
import { PitchingBoxScore } from "./PitchingBoxScore"

function GameSummary({ game }) {
    const events = game.events ?? []
  
    if (events.length === 0) {
      return (
        <div className="text-sm opacity-60">
          No game events recorded yet.
        </div>
      )
    }
  
    return (
      <div className="space-y-2">
        {[...events]
          .reverse()
          .slice(0, 20)
          .map((event, index) => (
            <div
              key={event.id ?? index}
              className="
                border-b
                border-white/10
                py-2
              "
            >
              <div className="text-sm font-bold">
                {event.label ??
                  event.event_type ??
                  "Play"}
              </div>
  
              <div className="text-xs opacity-60">
                {event.half
                  ? `${event.half === "top"
                      ? "Top"
                      : "Bottom"} ${event.inning}`
                  : ""}
              </div>
            </div>
          ))}
      </div>
    )
  }

export function GameDetailScreen() {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const [gameRecord, setGameRecord] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function loadGame() {
      try {
        const result =
          await getGameById(gameId)

        setGameRecord(result)
      } catch (error) {
        console.error(
          "Could not load game:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [gameId])

  if (loading) {
    return (
      <main className="p-4">
        Loading game...
      </main>
    )
  }

  if (!gameRecord) {
    return (
      <main className="p-4">
        Game not found.
      </main>
    )
  }

  const game =
    gameRecord.state ??
    gameRecord.game_state ??
    {}

  const awayLineup =
    game.lineups?.[game.awayTeam] ?? []

  const homeLineup =
    game.lineups?.[game.homeTeam] ?? []

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-4">

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm font-bold"
      >
        ← Scores
      </button>

      {/* <GameScoreCard
        game={gameRecord}
        status={
          gameRecord.status === "final"
            ? "final"
            : "live"
        }
      /> */}
      <section className="space-y-3">
  <h2 className="scoreboard-title text-xl">
    Linescore
  </h2>

  <LineScore game={game} />
</section>

      <section className="space-y-4">
        <h2 className="scoreboard-title text-xl">
          Box Score
        </h2>

        <BoxScore
          title={game.awayTeam}
          lineup={awayLineup}
          gameStats={game.stats}
        />

        <BoxScore
          title={game.homeTeam}
          lineup={homeLineup}
          gameStats={game.stats}
        />

<section className="space-y-4">
  <h2 className="scoreboard-title text-xl">
    Pitching
  </h2>

  <PitchingBoxScore
    game={game}
    teamName={game.awayTeam}
  />

  <PitchingBoxScore
    game={game}
    teamName={game.homeTeam}
  />
</section>
      </section>

      <section className="space-y-3">
        <h2 className="scoreboard-title text-xl">
          Game Summary
        </h2>

        <GameSummary game={game} />
      </section>

    </main>
  )
}