import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

export function PitcherChangeDialog({
  currentPitcher,
  players = [],
  pitchCount = 0,
  onCancel,
  onSelect,
}) {
  const availablePitchers = players.filter(
    (player) =>
      player.id !== currentPitcher?.id
  )

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-end
        bg-black/70
        p-4
        sm:items-center
        sm:justify-center
      "
    >
      <Card
        className="
          w-full
          max-w-md
          rounded-t-3xl
          bg-green-900
          text-white
          sm:rounded-3xl
        "
      >
        <CardContent className="space-y-5 p-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/60">
              Pitching Change
            </div>

            <h2 className="mt-1 text-xl font-bold">
              Change Pitcher
            </h2>
          </div>

          {currentPitcher ? (
            <div className="rounded-2xl bg-black/20 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                Current Pitcher
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="font-bold">
                    #{currentPitcher.number || "—"}{" "}
                    {currentPitcher.name}
                  </div>

                  <div className="mt-1 text-sm text-white/60">
                    {pitchCount} pitches
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-black/20 p-4 text-sm text-white/60">
              No current pitcher assigned.
            </div>
          )}

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-white/60">
              Available Players
            </div>

            {availablePitchers.length === 0 ? (
              <div className="rounded-xl bg-black/20 p-3 text-sm text-white/50">
                No available players.
              </div>
            ) : (
              availablePitchers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className="
                    flex w-full
                    items-center
                    justify-between
                    rounded-xl
                    bg-white
                    p-3
                    text-left
                    text-slate-900
                  "
                  onClick={() =>
                    onSelect(player.id)
                  }
                >
                  <div>
                    <div className="font-bold">
                      #{player.number || "—"}{" "}
                      {player.name}
                    </div>

                    <div className="text-xs text-slate-500">
                      {player.default_position ||
                        player.position ||
                        "Player"}
                    </div>
                  </div>

                  <div className="text-sm font-bold">
                    Select
                  </div>
                </button>
              ))
            )}
          </div>

          <Button
            variant="secondary"
            className="w-full rounded-xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}