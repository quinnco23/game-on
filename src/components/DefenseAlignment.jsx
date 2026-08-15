import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

const positions = [
  "P",
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "LF",
  "CF",
  "RF",
]

export function DefenseAlignment({
  team,
  players = [],
  defense = {},
  onAssign,
}) {
  return (
    <Card className="rounded-3xl bg-green-900 text-slate-950">
      <CardContent className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold">
            Defensive Alignment
          </h2>

          <p className="text-sm text-slate-500">
            {team}
          </p>
        </div>

        <div className="space-y-3">
          {positions.map((position) => (
            <div
              key={position}
              className="rounded-2xl bg-slate-100 p-3"
            >
              <div className="mb-2 font-bold">
                {position}
              </div>

              <select
                className="w-full rounded-xl border p-2"
                value={defense[position] ?? ""}
                onChange={(event) =>
                  onAssign(
                    position,
                    event.target.value || null
                  )
                }
              >
                <option value="">
                  Unassigned
                </option>

                {players.map((player) => (
                  <option
                    key={player.id}
                    value={player.id}
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}