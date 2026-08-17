import { useEffect, useState } from "react"

import { GameScoreCard } from "./GameScoreCard"

import { useNavigate, useParams } from "react-router-dom"
import {
    getPublicGames,
    getUpcomingGames,
  } from "../services/gamesService"

function getPlayerOfGame(game) {
  const state =
    game?.state ??
    game?.game_state ??
    {}

  const lineups =
    state.lineups ?? {}

  const batterStats =
    state.stats?.batters ?? {}

  const allPlayers =
    Object.values(lineups).flat()

  const ranked = allPlayers
    .map((player) => {
      const stats =
        batterStats[player.id] ?? {}

      return {
        player,
        hits: stats.hits ?? 0,
        rbi: stats.rbi ?? 0,
      }
    })
    .sort((a, b) => {
      if (b.rbi !== a.rbi) {
        return b.rbi - a.rbi
      }

      return b.hits - a.hits
    })

  const top = ranked[0]

  if (
    !top ||
    (top.hits === 0 &&
      top.rbi === 0)
  ) {
    return null
  }

  return top
}

export function FanHomeScreen() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [upcomingGames, setUpcomingGames] =
  useState([])
  const { teamId } = useParams()

  useEffect(() => {
    async function loadUpcomingGames() {
      try {
        const upcoming =
          await getUpcomingGames()
  
        setUpcomingGames(upcoming)
      } catch (error) {
        console.error(
          "Could not load upcoming games:",
          error
        )
      }
    }
  
    loadUpcomingGames()
  }, [])
  
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
    <div className="space-y-8">

    {/* HEADER */}
    <header>
  <div className="scoreboard-label text-scoreboard-amber">
    Game Center
  </div>

  <h1 className="scoreboard-title mt-1 text-3xl">
    Scores
  </h1>
</header>

    <section className="space-y-3">
  <div
    className="
      flex items-center justify-between
      border-b-2 border-scoreboard-red
      pb-2
    "
  >
    <h2 className="scoreboard-title text-xl">
      Upcoming Games
    </h2>

    <span className="scoreboard-label opacity-60">
      Schedule
    </span>
  </div>

  {upcomingGames.length === 0 ? (
    <div
      className="
        scoreboard-panel
        border border-scoreboard-cream/20
        p-4
      "
    >
      <div className="scoreboard-label opacity-60">
        No upcoming games scheduled.
      </div>
    </div>
  ) : (
    <div className="space-y-3">
      {upcomingGames.map((game) => {
        const isHome =
          game.home_team_id === teamId

        return (
          <div
            key={game.id}
            className="
              scoreboard-panel
              border-l-4
              border-scoreboard-amber
              p-4
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="scoreboard-label text-scoreboard-amber">
                  {isHome ? "Home" : "Away"}
                </div>

                <div className="scoreboard-title mt-1 text-lg">
                <div className="scoreboard-title mt-1 text-lg">
  {game.away_team?.name ?? "Away"}
  {" @ "}
  {game.home_team?.name ?? "Home"}
</div>
                </div>
              </div>

              <div className="text-right">
                <div className="scoreboard-label">
                  {new Date(
                    game.scheduled_at
                  ).toLocaleDateString()}
                </div>

                <div className="mt-1 font-bold">
                  {new Date(
                    game.scheduled_at
                  ).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )}
</section>

    {/* LIVE GAMES */}
    <section className="space-y-3">
      <div
        className="
          flex items-center justify-between
          border-b-2 border-scoreboard-red
          pb-2
        "
      >
        <h2 className="scoreboard-title text-xl">
          Live
        </h2>

        {liveGames.length > 0 && (
          <div className="scoreboard-label text-scoreboard-amber">
            ● {liveGames.length} Active
          </div>
        )}
      </div>

      {liveGames.length === 0 ? (
        <div
          className="
            scoreboard-panel
            border border-scoreboard-cream/20
            p-5
            text-center
          "
        >
          <div className="scoreboard-label opacity-60">
            No games are live right now.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {liveGames.map((game) => (
            <div
              key={game.id}
              className="
                border-l-4
                border-scoreboard-red
              "
            >
              <GameScoreCard
                game={game}
                status="live"
                onClick={() =>
                    navigate(`/fan/games/${game.id}`)
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>


    {/* FINAL GAMES */}
    <section className="space-y-3">
      <div
        className="
          flex items-center justify-between
          border-b-2 border-scoreboard-cream/30
          pb-2
        "
      >
        <h2 className="scoreboard-title text-xl">
          Final
        </h2>

        <div className="scoreboard-label opacity-60">
          Recent Games
        </div>
      </div>

      {finalGames.length === 0 ? (
        <div
          className="
            scoreboard-panel
            border border-scoreboard-cream/20
            p-5
            text-center
          "
        >
          <div className="scoreboard-label opacity-60">
            No final games yet.
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {finalGames.map((game) => {
            const playerOfGame =
              getPlayerOfGame(game)

            return (
              <div
                key={game.id}
                className="
                  scoreboard-panel
                  overflow-hidden
                  border border-scoreboard-cream/20
                "
              >
                <GameScoreCard
                  game={game}
                  status="final"
                  onClick={() =>
                    navigate(`/fan/games/${game.id}`)
                  }
                />

                {playerOfGame && (
                  <div
                    className="
                      border-t
                      border-scoreboard-cream/20
                      bg-scoreboard-dark/70
                      px-4 py-3
                    "
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="scoreboard-label text-scoreboard-amber">
                          Player of the Game
                        </div>

                        <div
                          className="
                            mt-1
                            font-heading
                            text-lg
                            font-bold
                            uppercase
                            tracking-wide
                          "
                        >
                          #{playerOfGame.player.number || "—"}{" "}
                          {playerOfGame.player.name}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="scoreboard-number text-xl">
                          {playerOfGame.hits} H
                        </div>

                        <div className="scoreboard-label mt-1">
                          {playerOfGame.rbi} RBI
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>

  </div>

  )
}

