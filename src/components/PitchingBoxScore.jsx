// src/components/PitchingBoxScore.jsx

import { Card, CardContent } from "./ui/card"

function getPitcherRows(game, teamName) {
    const roster =
      game.gameRoster?.[teamName] ?? []
  
    const pitcherStats =
      game.stats?.pitchers ?? {}
  
    return roster
      .map((player) => {
        const stats =
          pitcherStats[player.id]
  
        if (!stats) {
          return null
        }
  
        const outsRecorded =
          stats.outsRecorded ?? 0
  
        const inningsPitched =
          `${Math.floor(outsRecorded / 3)}.${
            outsRecorded % 3
          }`
  
        return {
          id: player.id,
          number: player.number,
          name: player.name,
  
          IP: inningsPitched,
  
          BF:
            stats.battersFaced ?? 0,
  
          H:
            stats.hitsAllowed ?? 0,
  
          R:
            stats.runsAllowed ?? 0,
  
          ER:
            stats.earnedRuns ?? 0,
  
          BB:
            stats.walksAllowed ?? 0,
  
          SO:
            stats.strikeouts ?? 0,

            P: stats.pitches ?? 0,
            S: stats.strikes ?? 0,
            B: stats.balls ?? 0,
  
          HR:
            stats.homeRunsAllowed ?? 0,
  
          pickoffAttempts:
            stats.pickoffAttempts ?? 0,
  
          pickoffs:
            stats.pickoffs ?? 0,
        }
      })
      .filter(Boolean)
  }
export function PitchingBoxScore({
  game,
  teamName,
}) {
  const rows =
    getPitcherRows(game, teamName)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="border-b border-white/10 p-3">
          <h3 className="scoreboard-title text-lg">
            {teamName} Pitching
          </h3>
        </div>

        {rows.length === 0 ? (
          <div className="p-4 text-sm opacity-60">
            No pitching stats recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead className="text-white/60">
  <tr>
    <th className="p-2 text-left">
      Pitcher
    </th>

    <th className="p-2 text-center">IP</th>
    <th className="p-2 text-center">BF</th>
    <th className="p-2 text-center">H</th>
    <th className="p-2 text-center">R</th>
    <th className="p-2 text-center">ER</th>
    <th className="p-2 text-center">BB</th>
    <th className="p-2 text-center">SO</th>
    <th className="p-2 text-center">P</th>
    <th className="p-2 text-center">S</th>
    <th className="p-2 text-center">B</th>
  </tr>
</thead>
<tbody>
  {rows.map((row) => (
    <tr
      key={row.id}
      className="border-t border-white/10"
    >
      <td className="p-2 font-bold">
        #{row.number || "—"} {row.name}
      </td>

      <td className="p-2 text-center">
        {row.IP}
      </td>

      <td className="p-2 text-center">
        {row.BF}
      </td>

      <td className="p-2 text-center">
        {row.H}
      </td>

      <td className="p-2 text-center">
        {row.R}
      </td>

      <td className="p-2 text-center">
        {row.ER}
      </td>

      <td className="p-2 text-center">
        {row.BB}
      </td>

      <td className="p-2 text-center">
        {row.SO}
      </td>

      <td className="p-2 text-center">
        {row.P}
      </td>

      <td className="p-2 text-center">
        {row.S}
      </td>

      <td className="p-2 text-center">
        {row.B}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}