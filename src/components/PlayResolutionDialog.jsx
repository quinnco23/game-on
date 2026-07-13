import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

const baseOptions = ["stay", "first", "second", "third", "home", "out"]

function formatPlayer(player) {
  if (!player) return ""
  return `#${player.number} ${player.name}`
}

function baseLabel(base) {
  return {
    first: "1st",
    second: "2nd",
    third: "3rd",
    home: "Scored",
    out: "Out",
    stay: "Stayed",
  }[base] || base
}

function defaultBatterDestination(playType) {
  if (playType === "single") return "first"
  if (playType === "double") return "second"
  if (playType === "triple") return "third"
  if (playType === "home_run") return "home"
  return "first"
}

export function PlayResolutionDialog({
  playType,
  batter,
  bases,
  onCancel,
  onConfirm,
}) {
  const existingRunners = [
    { from: "third", runner: bases.third },
    { from: "second", runner: bases.second },
    { from: "first", runner: bases.first },
  ].filter((item) => item.runner)

  const [batterDestination, setBatterDestination] = useState(
    defaultBatterDestination(playType)
  )

  const [runnerAdvances, setRunnerAdvances] = useState(
    existingRunners.map(({ from, runner }) => ({
      runner,
      runnerId: runner.id,
      from,
      to: "stay",
      scored: false,
      out: false,
    }))
  )

  const runsScored =
    runnerAdvances.filter((advance) => advance.to === "home").length +
    (batterDestination === "home" ? 1 : 0)

  const [rbi, setRbi] = useState(runsScored)

  function updateRunner(index, to) {
    setRunnerAdvances((current) =>
      current.map((advance, advanceIndex) =>
        advanceIndex === index
          ? {
              ...advance,
              to,
              scored: to === "home",
              out: to === "out",
            }
          : advance
      )
    )
  }

  function submit() {
    onConfirm({
      playType,
      batterId: batter.id,
      batterDestination,
      runnerAdvances,
      runs: runsScored,
      rbi,
      details: {
        playType,
        batterDestination,
        runnerAdvances: runnerAdvances.map((advance) => ({
          runnerId: advance.runnerId,
          runnerName: advance.runner.name,
          from: advance.from,
          to: advance.to,
          scored: advance.scored,
          out: advance.out,
        })),
      },
    })
    
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl bg-green-950 text-slate-950">
        <CardContent className="p-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold">Resolve {playType}</h2>
            <p className="text-sm text-slate-500">
              Confirm runner movement and RBI.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3">
            <div className="text-sm text-slate-500">Batter</div>
            <div className="font-bold">{formatPlayer(batter)}</div>

            <div className="grid grid-cols-4 gap-2 mt-3">
              {["first", "second", "third", "home", "out"].map((option) => (
                <Button
                  key={option}
                  variant={batterDestination === option ? "default" : "secondary"}
                  className="rounded-xl"
                  onClick={() => setBatterDestination(option)}
                >
                  {baseLabel(option)}
                </Button>
              ))}
            </div>
          </div>

          {runnerAdvances.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold">Runners</h3>

              {runnerAdvances.map((advance, index) => (
                <div key={advance.runnerId} className="rounded-2xl bg-slate-100 p-3">
                  <div className="text-sm text-slate-500">
                    From {baseLabel(advance.from)}
                  </div>
                  <div className="font-bold">{formatPlayer(advance.runner)}</div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {baseOptions.map((option) => (
                      <Button
                        key={option}
                        variant={advance.to === option ? "default" : "secondary"}
                        className="rounded-xl"
                        onClick={() => updateRunner(index, option)}
                      >
                        {baseLabel(option)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-slate-100 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold">Runs scored</span>
              <span>{runsScored}</span>
            </div>

            <label className="flex items-center justify-between gap-3">
              <span className="font-bold">RBI credited</span>
              <input
                type="number"
                min="0"
                max="4"
                className="w-20 rounded-xl border p-2 text-center"
                value={rbi}
                onChange={(e) => setRbi(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="rounded-2xl" onClick={onCancel}>
              Cancel
            </Button>

            <Button className="rounded-2xl" onClick={submit}>
              Confirm Play
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}