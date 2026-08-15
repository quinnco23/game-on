// src/components/LineScore.jsx

import { Card, CardContent } from "./ui/card"

function getTeamHits(game, teamName) {
  const lineup =
    game.lineups?.[teamName] ?? []

  const batterStats =
    game.stats?.batters ?? {}

  return lineup.reduce(
    (total, player) =>
      total +
      (batterStats[player.id]?.hits ?? 0),
    0
  )
}

function buildLineScore(game) {
  const events = game.events ?? []

  const innings = {}

  for (const event of events) {
    const inning =
      event.inning ??
      event.details?.inning

    const half =
      event.half ??
      event.details?.half

    const runs =
      event.runs ??
      event.runs_scored ??
      event.details?.runs ??
      0

    if (!inning || !half || !runs) {
      continue
    }

    if (!innings[inning]) {
      innings[inning] = {
        away: 0,
        home: 0,
      }
    }

    if (half === "top") {
      innings[inning].away += runs
    } else {
      innings[inning].home += runs
    }
  }

  return innings
}

export function LineScore({ game }) {
  const awayTeam = game.awayTeam
  const homeTeam = game.homeTeam

  const innings =
    buildLineScore(game)

  const inningNumbers =
    Object.keys(innings)
      .map(Number)
      .sort((a, b) => a - b)

  const currentInning =
    game.inning ?? 1

  const maxInning =
    Math.max(
      currentInning,
      ...inningNumbers,
      1
    )

  const columns =
    Array.from(
      { length: maxInning },
      (_, index) => index + 1
    )

  const awayRuns =
    game.score?.[awayTeam] ?? 0

  const homeRuns =
    game.score?.[homeTeam] ?? 0

  const awayHits =
    getTeamHits(game, awayTeam)

  const homeHits =
    getTeamHits(game, homeTeam)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="p-3 text-left">
                  Team
                </th>

                {columns.map((inning) => (
                  <th
                    key={inning}
                    className="w-10 p-2 text-center"
                  >
                    {inning}
                  </th>
                ))}

                <th className="w-10 p-2 text-center">
                  R
                </th>

                <th className="w-10 p-2 text-center">
                  H
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-white/10">
                <td className="p-3 font-bold">
                  {awayTeam}
                </td>

                {columns.map((inning) => (
                  <td
                    key={inning}
                    className="p-2 text-center"
                  >
                    {innings[inning]?.away ?? 0}
                  </td>
                ))}

                <td className="p-2 text-center font-black">
                  {awayRuns}
                </td>

                <td className="p-2 text-center font-bold">
                  {awayHits}
                </td>
              </tr>

              <tr className="border-t border-white/10">
                <td className="p-3 font-bold">
                  {homeTeam}
                </td>

                {columns.map((inning) => (
                  <td
                    key={inning}
                    className="p-2 text-center"
                  >
                    {innings[inning]?.home ?? 0}
                  </td>
                ))}

                <td className="p-2 text-center font-black">
                  {homeRuns}
                </td>

                <td className="p-2 text-center font-bold">
                  {homeHits}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}