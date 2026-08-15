import { Card, CardContent } from "./ui/card";

function formatAverage(hits, atBats) {
  if (!atBats) {
    return ".000";
  }

  return (hits / atBats)
    .toFixed(3)
    .replace(/^0/, "");
}

export function BoxScore({
  title,
  lineup = [],
  gameStats,
}) {
  const batterStats = gameStats?.batters ?? {};

  const rows = lineup.map((player) => {
    const stats = batterStats[player.id] ?? {};

    const atBats = stats.atBats ?? 0;
    const hits = stats.hits ?? 0;

    return {
      id: player.id,
      number: player.number,
      name: player.name,
      position: player.position,

      PA: stats.plateAppearances ?? 0,
      AB: atBats,
      R: stats.runs ?? 0,
      H: hits,
      "2B": stats.doubles ?? 0,
      "3B": stats.triples ?? 0,
      HR: stats.homeRuns ?? 0,
      RBI: stats.rbi ?? 0,
      BB: stats.walksAllowed ?? 0,
      SO: stats.strikeouts ?? 0,
      ROE: stats.reachedOnError ?? 0,
      FC: stats.fieldersChoices ?? 0,
      GIDP: stats.groundedIntoDoublePlay ?? 0,
      HBP: stats.hitByPitch ?? 0,

      AVG: formatAverage(hits, atBats),
    };
  });

  return (
    <Card className="rounded-3xl border-white/10 bg-white/10 text-white">
      <CardContent className="space-y-3 p-5">
        <h2 className="text-lg font-bold">
          {title} Box Score
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="text-left">#</th>
                <th className="text-left">Player</th>
                <th className="text-center">Pos</th>
                <th className="text-center">PA</th>
                <th className="text-center">AB</th>
                <th className="text-center">R</th>
                <th className="text-center">H</th>
                <th className="text-center">RBI</th>
                <th className="text-center">BB</th>
                <th className="text-center">SO</th>
                <th className="text-center">AVG</th>
                
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-white/10"
                >
                  <td className="py-2">
                    {row.number}
                  </td>

                  <td className="py-2">
                    {row.name}
                  </td>

                  <td className="text-center">
                    {row.position}
                  </td>

                  <td className="text-center">
                    {row.PA}
                  </td>

                  <td className="text-center">
                    {row.AB}
                  </td>

                  <td className="text-center">
                    {row.R}
                  </td>

                  <td className="text-center">
                    {row.H}
                  </td>

                  <td className="text-center">
                    {row.RBI}
                  </td>

                  <td className="text-center">
                    {row.BB}
                  </td>

                  <td className="text-center">
                    {row.SO}
                  </td>

                  <td className="text-center">
                    {row.AVG}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}