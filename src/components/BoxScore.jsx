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
    {/* <th>PA</th> */}
    <th>AB</th>
    <th>R</th>
    <th>H</th>
    {/* <th>2B</th>
    <th>3B</th>
    <th>HR</th> */}
    <th>RBI</th>
    <th>BB</th>
     <th>SO</th>{/*
    <th>ROE</th>
    <th>FC</th>
    <th>SAC</th> */}
    <th>AVG</th>
  </tr>
</thead>

<tbody>
  {rows.map((row) => (
    <tr key={row.id} className="border-t border-white/10">
      <td className="py-2">{row.number}</td>
      <td className="py-2">{row.name}</td>
      <td className="text-center">{row.position}</td>
      {/* <td className="text-center">{row.PA}</td> */}
      <td className="text-center">{row.AB}</td>
      <td className="text-center">{row.R}</td>
      <td className="text-center">{row.H}</td>
      {/* <td className="text-center">{row["2B"]}</td>
      <td className="text-center">{row["3B"]}</td>
      <td className="text-center">{row.HR}</td> */}
     <td className="text-center">{row.RBI}</td>
      <td className="text-center">{row.BB}</td>
      <td className="text-center">{row.SO}</td>
      {/* <td className="text-center">{row.ROE}</td>
      <td className="text-center">{row.FC}</td>
      <td className="text-center">{row.SAC}</td>  */}
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