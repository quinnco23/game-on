import { buildBoxScore } from "../utils/boxScore"
import { Card, CardContent } from "./ui/card"

export function BoxScore({ title, events, lineup }) {
  const rows = buildBoxScore(events, lineup)

  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-3">
        <h2 className="text-lg font-bold">{title} Box Score</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="text-left">#</th>
                <th className="text-left">Player</th>
                <th>Pos</th>
                <th>AB</th>
                <th>H</th>
                <th>R</th>
                <th>RBI</th>
                <th>BB</th>
                <th>AVG</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="py-2">{row.number}</td>
                  <td className="py-2">{row.name}</td>
                  <td className="text-center">{row.position}</td>
                  <td className="text-center">{row.AB}</td>
                  <td className="text-center">{row.H}</td>
                  <td className="text-center">{row.R}</td>
                  <td className="text-center">{row.RBI}</td>
                  <td className="text-center">{row.BB}</td>
                  <td className="text-center">{row.AVG}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}