import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Mic, Zap, Undo2 } from "lucide-react"
import { useState } from "react"



export function PlayControls(
 
  {
  game,
  dispatch,
  onVoice,
  onFakeAudioAssist,
  onOpenPlayResolution,
  onOpenOutDialog,
  onUndo,
  onStolenBase, 
  onPassedBall,
  onWildPitch,
  onHitByPitch,
  onCaughtStealing,
  onPickoff,


}) {
  const [showPickoffDialog, setShowPickoffDialog] = useState(false)
 
  return (
    <Card className="rounded-3xl">
  <CardContent className="p-4 space-y-5">

    {/* BATTER RESULTS */}
    <section className="space-y-2">
      <div className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Batter
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          className="rounded-xl py-5"
          onClick={() =>
            onOpenPlayResolution("single")
          }
        >
          Single
        </Button>

        <Button
          className="rounded-xl py-5"
          onClick={() =>
            onOpenPlayResolution("double")
          }
        >
          Double
        </Button>

        <Button
          className="rounded-xl py-5"
          onClick={() =>
            onOpenPlayResolution("triple")
          }
        >
          Triple
        </Button>

        <Button
          className="rounded-xl py-5"
          onClick={() =>
            onOpenPlayResolution("homeRun")
          }
        >
          HR
        </Button>

        <Button
          className="rounded-xl py-5"
          onClick={onHitByPitch}
        >
          HBP
        </Button>

        <Button
          className="rounded-xl py-5"
          onClick={onOpenOutDialog}
        >
          Out / Error
        </Button>
      </div>
    </section>

    {/* RUNNER ACTIONS */}
    <section className="space-y-3 border-t pt-4">
      <div className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Runners
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-slate-500">
          Steal
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            disabled={!game.bases?.first}
            onClick={() =>
              onStolenBase("first", "second")
            }
          >
            2nd
          </Button>

          <Button
            variant="secondary"
            disabled={!game.bases?.second}
            onClick={() =>
              onStolenBase("second", "third")
            }
          >
            3rd
          </Button>

          <Button
            variant="secondary"
            disabled={!game.bases?.third}
            onClick={() =>
              onStolenBase("third", "home")
            }
          >
            Home
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-slate-500">
          Caught Stealing
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            disabled={!game.bases?.first}
            onClick={() =>
              onCaughtStealing("first")
            }
          >
            CS 2B
          </Button>

          <Button
            variant="secondary"
            disabled={!game.bases?.second}
            onClick={() =>
              onCaughtStealing("second")
            }
          >
            CS 3B
          </Button>

          <Button
            variant="secondary"
            disabled={!game.bases?.third}
            onClick={() =>
              onCaughtStealing("third")
            }
          >
            CS Home
          </Button>
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full rounded-xl"
        disabled={
          !game.bases?.first &&
          !game.bases?.second &&
          !game.bases?.third
        }
        onClick={() =>
          setShowPickoffDialog(true)
        }
      >
        Pickoff
      </Button>
    </section>

    {/* PITCH / ADVANCE EVENTS */}
    <section className="space-y-3 border-t pt-4">
      <div className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Pitch Events
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          disabled={!game.bases?.second}
          onClick={() =>
            onPassedBall("second", "third")
          }
        >
          PB → 3B
        </Button>

        <Button
          variant="secondary"
          disabled={!game.bases?.third}
          onClick={() =>
            onPassedBall("third", "home")
          }
        >
          PB → Home
        </Button>

        <Button
          variant="secondary"
          disabled={!game.bases?.second}
          onClick={() =>
            onWildPitch("second", "third")
          }
        >
          WP → 3B
        </Button>

        <Button
          variant="secondary"
          disabled={!game.bases?.third}
          onClick={() =>
            onWildPitch("third", "home")
          }
        >
          WP → Home
        </Button>
      </div>
    </section>

    {/* GAME ACTIONS */}
    <section className="border-t pt-4">
      <Button
        className="w-full rounded-xl bg-red-600 py-4"
        onClick={onUndo}
      >
        Undo Last Play
      </Button>
    </section>

    {showPickoffDialog && (
  <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
    <Card className="w-full max-w-sm rounded-3xl bg-green-900 text-slate-950">
      <CardContent className="p-5 space-y-4">
        <div>
          <h2 className="text-xl font-bold">Pickoff</h2>
          <p className="text-sm text-slate-500">
            Choose a runner.
          </p>
        </div>

        {["first", "second", "third"].map((base) => {
          const runner = game.bases?.[base]

          if (!runner) {
            return null
          }

          return (
            <div
              key={base}
              className="rounded-2xl bg-slate-100 p-3 space-y-3"
            >
              <div className="font-bold">
                {runner.name} on {base}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    onPickoff(base, false)
                    setShowPickoffDialog(false)
                  }}
                >
                  Safe
                </Button>

                <Button
                  onClick={() => {
                    onPickoff(base, true)
                    setShowPickoffDialog(false)
                  }}
                >
                  Out
                </Button>
              </div>
            </div>
          )
        })}

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setShowPickoffDialog(false)}
        >
          Cancel
        </Button>
      </CardContent>
    </Card>
  </div>
)}

  </CardContent>
</Card>
  )
}

