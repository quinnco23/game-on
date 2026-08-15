import { useState, useEffect } from "react"
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
  if (playType === "single") return "first";
  if (playType === "double") return "second";
  if (playType === "triple") return "third";
  if (playType === "homeRun") return "home";

  return "first";
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

    useEffect(() => {
      setRbi(runsScored)
    }, [runsScored])

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
    const runnerDecisions = {}
  
    runnerAdvances.forEach((advance) => {
      runnerDecisions[advance.from] =
        advance.to === "stay"
          ? advance.from
          : advance.to
    })
  
    const resolution = {
      playType,
      batterId: batter.id,
      batterDestination,
      runnerDecisions,
      runs: runsScored,
      rbi,
      details: {
        playType,
        batterDestination,
        runnerAdvances: runnerAdvances.map((advance) => ({
          runnerId: advance.runnerId,
          runnerName: advance.runner.name,
          from: advance.from,
          to:
            advance.to === "stay"
              ? advance.from
              : advance.to,
          scored: advance.to === "home",
          out: advance.to === "out",
        })),
      },
    }
  
    console.log("Submitting play resolution:", resolution)
  
    onConfirm(resolution)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 md:p-4 md:flex md:items-center md:justify-center">
  <Card   className="
      h-[100dvh] w-full overflow-y-auto
      rounded-none
      bg-green-900 text-slate-950

      md:h-auto
      md:max-h-[90dvh]
      md:max-w-md
      md:rounded-3xl
    ">
    <CardContent className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-5">
      <div className="flex-1 overflow-y-auto p-5 pb-8 space-y-5">
        <div>
          <h2 className="text-xl font-bold">
            Resolve {playType}
          </h2>

          <p className="text-sm text-slate-500">
            Confirm runner movement and RBI.
          </p>
        </div>

        <div className="rounded-2xl ballpark-card p-3">
          <div className="text-sm text-slate-500">
            Batter
          </div>

          <div className="font-bold">
            {formatPlayer(batter)}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {[
              "first",
              "second",
              "third",
              "home",
              "out",
            ].map((option) => (
              <Button
                key={option}
                variant={
                  batterDestination === option
                    ? "default"
                    : "secondary"
                }
                className="rounded-xl"
                onClick={() =>
                  setBatterDestination(option)
                }
              >
                {baseLabel(option)}
              </Button>
            ))}
          </div>
        </div>

        {runnerAdvances.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold">
              Runners
            </h3>

            {runnerAdvances.map(
              (advance, index) => (
                <div
                  key={advance.runnerId}
                  className="rounded-2xl ballpark-card p-3"
                >
                  <div className="text-sm text-slate-500">
                    From {baseLabel(advance.from)}
                  </div>

                  <div className="font-bold">
                    {formatPlayer(advance.runner)}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {baseOptions.map((option) => (
                      <Button
                        key={option}
                        variant={
                          advance.to === option
                            ? "default"
                            : "secondary"
                        }
                        className="rounded-xl"
                        onClick={() =>
                          updateRunner(index, option)
                        }
                      >
                        {baseLabel(option)}
                      </Button>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <div className="space-y-2 rounded-2xl ballpark-card p-3">
          <div className="flex items-center justify-between">
            <span className="font-bold">
              Runs scored
            </span>

            <span>{runsScored}</span>
          </div>

          <label className="flex items-center justify-between gap-3">
            <span className="font-bold">
              RBI credited
            </span>

            <input
              type="number"
              min="0"
              max="4"
              className="w-20 rounded-xl border p-2 text-center"
              value={rbi}
              onChange={(event) =>
                setRbi(Number(event.target.value))
              }
            />
          </label>
        </div>
      </div>

      <div className="z-20 border-t border-slate-200 ballpark-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur rounded-2xl">
        <div className="grid grid-cols-2 gap-3">
          <Button
          
            
            className="rounded-2xl"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="rounded-2xl"
            onClick={submit}
          >
            Confirm Play
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
  )
}