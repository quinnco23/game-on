import { useEffect, useState } from "react"

import { GameScoreCard } from "./GameScoreCard"
import { getPublicGames } from "../services/gamesService"
import { useNavigate } from "react-router-dom"

export function FanHomeScreen() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadGames() {
      try {
        const result =
          await getPublicGames()

        setGames(result)
      } catch (error) {
        console.error(
          "Could not load games:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [])

  const liveGames = games.filter(
    (game) =>
      game.status === "scoring"
  )

  const finalGames = games.filter(
    (game) =>
      game.status === "final"
  )

  if (loading) {
    return (
      <main className="p-4">
        Loading games...
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-4">
      <header>
        <div className="scoreboard-label">
          Angry Berds
        </div>

        <h1 className="scoreboard-title text-3xl">
          Scores
        </h1>
      </header>

      <section className="space-y-3">
        <h2 className="scoreboard-title text-xl">
          Live
        </h2>

        {liveGames.length === 0 ? (
          <div className="text-sm opacity-60">
            No games are live right now.
          </div>
        ) : (
          liveGames.map((game) => (
            <GameScoreCard
            key={game.id}
            game={game}
            status={
              game.status === "final"
                ? "final"
                : "live"
            }
            onClick={() =>
              navigate(`/games/${game.id}`)
            }
          />
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="scoreboard-title text-xl">
          Final
        </h2>

        {finalGames.length === 0 ? (
          <div className="text-sm opacity-60">
            No final games yet.
          </div>
        ) : (
          finalGames.map((game) => (
            <GameScoreCard
            key={game.id}
            game={game}
            status={
              game.status === "final"
                ? "final"
                : "live"
            }
            onClick={() =>
              navigate(`/games/${game.id}`)
            }
          />
          ))
        )}
      </section>
    </main>
  )
}