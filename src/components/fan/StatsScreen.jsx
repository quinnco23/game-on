import { useEffect, useMemo, useState } from "react"
import { getLeagueStats } from "@/services/statsService"

export function StatsScreen() {
  const [stats, setStats] = useState({
    batters: [],
    pitchers: [],
  })

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const result =
          await getLeagueStats()

        setStats(result)
      } catch (error) {
        console.error(
          "Could not load league stats:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const battingLeaders = useMemo(() => {
    return [...stats.batters]
      .filter(
        (player) =>
          player.atBats > 0
      )
      .map((player) => ({
        ...player,

        average:
          player.hits /
          player.atBats,
      }))
      .sort(
        (a, b) =>
          b.average - a.average
      )
  }, [stats.batters])

  const pitchingLeaders = useMemo(() => {
    return [...stats.pitchers]
      .filter(
        (player) =>
          player.outsRecorded > 0
      )
      .sort(
        (a, b) =>
          b.strikeouts -
          a.strikeouts
      )
  }, [stats.pitchers])

  if (loading) {
    return (
      <div className="scoreboard-label">
        Loading stats...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <div className="scoreboard-label text-scoreboard-amber">
          League Leaders
        </div>

        <h1 className="scoreboard-title mt-1 text-3xl">
          Stats
        </h1>
      </header>

      <section className="space-y-3">
        <h2 className="scoreboard-title text-xl">
          Batting
        </h2>

        <div className="scoreboard-panel overflow-hidden">
          {battingLeaders
            .slice(0, 10)
            .map((player, index) => (
              <div
                key={player.player.id}
                className="
                  grid
                  grid-cols-[32px_1fr_auto]
                  items-center
                  border-b
                  border-scoreboard-cream/20
                  px-4 py-3
                  last:border-b-0
                "
              >
                <div className="scoreboard-number">
                  {index + 1}
                </div>

                <div>
                  <div className="font-bold">
                    #{player.player.number || "—"}{" "}
                    {player.player.name}
                  </div>

                  <div className="scoreboard-label mt-1 opacity-60">
                    {player.hits} H ·{" "}
                    {player.rbi} RBI
                  </div>
                </div>

                <div className="scoreboard-number text-xl">
                  {player.average
                    .toFixed(3)
                    .replace(/^0/, "")}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="scoreboard-title text-xl">
          Pitching
        </h2>

        <div className="scoreboard-panel overflow-hidden">
          {pitchingLeaders
            .slice(0, 10)
            .map((player, index) => (
              <div
                key={player.player.id}
                className="
                  grid
                  grid-cols-[32px_1fr_auto]
                  items-center
                  border-b
                  border-scoreboard-cream/20
                  px-4 py-3
                  last:border-b-0
                "
              >
                <div className="scoreboard-number">
                  {index + 1}
                </div>

                <div>
                  <div className="font-bold">
                    #{player.player.number || "—"}{" "}
                    {player.player.name}
                  </div>

                  <div className="scoreboard-label mt-1 opacity-60">
                    {Math.floor(
                      player.outsRecorded / 3
                    )}.
                    {player.outsRecorded % 3} IP
                    {" · "}
                    {player.pitches} P
                  </div>
                </div>

                <div className="text-right">
                  <div className="scoreboard-number text-xl">
                    {player.strikeouts}
                  </div>

                  <div className="scoreboard-label opacity-60">
                    SO
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}