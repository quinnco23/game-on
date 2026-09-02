import { useEffect, useState } from "react"

import {
  getStandings,
} from "../services/standingsService"

export function StandingsScreen() {
  const [standings, setStandings] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function loadStandings() {
      try {
        const result =
          await getStandings()

        setStandings(result)
      } catch (error) {
        console.error(
          "Could not load standings:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadStandings()
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-4">
        <div className="scoreboard-label">
          Loading standings...
        </div>
      </main>
    )
  }

  return (
    <main
      className="
        mx-auto
        max-w-3xl
        space-y-5
        p-4
      "
    >
      <header>
        <div className="scoreboard-label">
          GameOn
        </div>

        <h1
          className="
            scoreboard-title
            mt-1
            text-3xl
          "
        >
          Standings
        </h1>
      </header>

      <div
        className="
          overflow-hidden
          border
          border-scoreboard-cream/30
        "
      >
        <div
          className="
            grid
            grid-cols-[1fr_36px_36px_36px_54px]
            gap-1
            border-b
            border-scoreboard-cream/30
            px-3
            py-2
          "
        >
          <div className="scoreboard-label">
            Team
          </div>

          <div className="scoreboard-label text-center">
            W
          </div>

          <div className="scoreboard-label text-center">
            L
          </div>

          <div className="scoreboard-label text-center">
            T
          </div>

          <div className="scoreboard-label text-right">
            PCT
          </div>
        </div>

        {standings.map(
          (team, index) => (
            <div
              key={team.team}
              className="
                grid
                grid-cols-[1fr_36px_36px_36px_54px]
                items-center
                gap-1
                border-b
                border-scoreboard-cream/10
                px-3
                py-3
                last:border-b-0
              "
            >
              <div className="min-w-0">
                <span
                  className="
                    mr-3
                    text-xs
                    opacity-50
                  "
                >
                  {index + 1}
                </span>

                <span className="font-bold">
                  {team.team}
                </span>
              </div>

              <div className="text-center">
                {team.wins}
              </div>

              <div className="text-center">
                {team.losses}
              </div>

              <div className="text-center">
                {team.ties}
              </div>

              <div
                className="
                  scoreboard-number
                  text-right
                "
              >
                {team.pct.toFixed(3)}
              </div>
            </div>
          )
        )}
      </div>
    </main>
  )
}