import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

import { handleGameAction } from "../services/gameActions"
import { getCurrentBatter } from "../state/gameLogic"
import { resolveRunnerMovement } from "../scoring/runnerEngine"

function getWalkRunnerDecisions(bases) {
  const decisions = {}

  // Runners not forced by the walk remain where they are.
  if (bases.first) {
    decisions.first = "second"
  }

  if (bases.second) {
    decisions.second =
      bases.first ? "third" : "second"
  }

  if (bases.third) {
    decisions.third =
      bases.first && bases.second
        ? "home"
        : "third"
  }

  return decisions
}

export function CountControls({ game, dispatch }) {
  const walkLikely = game.balls === 3
  const strikeoutLikely = game.strikes === 2

  async function handleNormalCountEvent(
    eventType,
    label,
    action
  ) {
    try {
      await handleGameAction({
        game,
        dispatch,
        action,
        eventType,
        label,
        extraEventData: {
          runs: 0,
          rbi: 0,
          outs_recorded: 0,
        },
      })
    } catch (error) {
      console.error(
        `Could not save ${eventType}:`,
        error
      )

      alert(
        error.message ||
          `Could not save ${eventType}`
      )
    }
  }

  async function handleBall() {
    const isBallFour = game.balls === 3

    console.log("Ball selected:", {
      ballsBeforePlay: game.balls,
      isBallFour,
      bases: game.bases,
    })

    if (!isBallFour) {
      await handleNormalCountEvent(
        "ball",
        "Ball",
        {
          type: "BALL",
        }
      )

      return
    }

    try {
      const batter = getCurrentBatter(game)

      if (!batter) {
        throw new Error(
          "Could not identify the current batter."
        )
      }

      const runnerDecisions =
        getWalkRunnerDecisions(game.bases)

      const runnerResult =
        resolveRunnerMovement({
          bases: game.bases,
          batter,
          batterDestination: "first",
          runnerDecisions,
        })

      const resolution = {
        playType: "walk",
        batterId: batter.id,
        batterDestination: "first",
        runnerDecisions,

        bases: runnerResult.bases,
        runnerAdvances:
          runnerResult.runnerAdvances,

        runs: runnerResult.runsScored,

        // A run forced home by a walk is credited
        // as an RBI to the batter.
        rbi: runnerResult.runsScored,

        outsRecorded:
          runnerResult.outsRecorded,

        details: {
          playType: "walk",
          batterDestination: "first",
          runnerDecisions,
          runnerAdvances:
            runnerResult.runnerAdvances,
          resultingBases: runnerResult.bases,
        },
      }

      console.log(
        "Walk resolution:",
        resolution
      )

      await handleGameAction({
        game,
        dispatch,
        action: {
          // Use your existing resolution reducer path.
          type: "RESOLVE_HIT",
          resolution,
        },
        eventType: "walk",
        label: `Walk - ${batter.name}`,
        extraEventData: {
          player_id: batter.id,
          runs: resolution.runs,
          rbi: resolution.rbi,
          outs_recorded:
            resolution.outsRecorded,
          details: resolution.details,
        },
      })
    } catch (error) {
      console.error(
        "Could not resolve walk:",
        error
      )

      alert(
        error.message ||
          "Could not resolve walk"
      )
    }
  }

  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-4">
        <div className="text-center">
          <div className="text-sm text-white/60">
            Count
          </div>

          <div className="text-4xl font-bold">
            {game.balls} - {game.strikes}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleBall}>
            {walkLikely ? "Ball 4 / Walk" : "Ball"}
          </Button>

          <Button
            onClick={() =>
              handleNormalCountEvent(
                "strike",
                strikeoutLikely
                  ? "Strike Three"
                  : "Strike",
                {
                  type: "STRIKE",
                }
              )
            }
          >
            {strikeoutLikely
              ? "Strike Three"
              : "Strike"}
          </Button>

          <Button
            onClick={() =>
              handleNormalCountEvent(
                "foul",
                "Foul Ball",
                {
                  type: "FOUL",
                }
              )
            }
          >
            Foul
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}