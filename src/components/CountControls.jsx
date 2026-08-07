import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

import { handleGameAction } from "../services/gameActions"
import { getCurrentBatter } from "../state/gameLogic"
import { applyPlay } from "../scoring/playEngine"
import { getForcedAdvanceDecisions } from "../scoring/getForcedAdvanceDecisions";


// function getWalkRunnerDecisions(bases) {
//   const decisions = {}

//   // Runners not forced by the walk remain where they are.
//   if (bases.first) {
//     decisions.first = "second"
//   }

//   if (bases.second) {
//     decisions.second =
//       bases.first ? "third" : "second"
//   }

//   if (bases.third) {
//     decisions.third =
//       bases.first && bases.second
//         ? "home"
//         : "third"
//   }

//   return decisions
// }

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


  
    // Balls one through three still use the normal count action.
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
      getForcedAdvanceDecisions(game.bases)
  
      /*
       * Adapt the UI score shape to the engine score shape.
       *
       * UI:
       * score[teamName]
       *
       * Engine:
       * score.home / score.away
       */
      const engineGameState = {
        ...game,
  
        score: {
          home:
            game.score?.[game.homeTeam] ?? 0,
  
          away:
            game.score?.[game.awayTeam] ?? 0,
        },
  
        bases: game.bases ?? {
          first: null,
          second: null,
          third: null,
        },
  
        inning: game.inning ?? 1,
        half: game.half ?? "top",
        outs: game.outs ?? 0,
        version: game.version ?? 0,
      }
  
      const playEvent = {
        id: crypto.randomUUID(),
        playType: "walk",
        batter,
        runnerDecisions,
  
        metadata: {
          resultType: "walk",
        },
      }
  
      const result = applyPlay(
        engineGameState,
        playEvent
      )
  
      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ??
            "Could not score the walk."
        )
      }
  
      console.log(
        "Walk engine result:",
        result
      )
  
      await handleGameAction({
        game,
        dispatch,
  
        action: {
          type: "APPLY_PLAY_RESULT",
          result,
          batterId: batter.id,
  
          pitcherId:
            game.currentPitcher?.id ??
            game.pitcher?.id ??
            null,
        },
  
        eventType: "walk",
        label: `Walk - ${batter.name}`,
  
        extraEventData: {
          player_id: batter.id,
  
          runs:
            result.metadata.runsScored,
  
          rbi:
            result.metadata.rbiCount,
  
          outs_recorded:
            result.metadata.outsRecorded,
  
          details: {
            playId: playEvent.id,
  
            runnerDecisions,
  
            runnerAdvances:
              result.metadata.runnerAdvances,
  
            resultingBases:
              result.state.bases,
          },
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

  async function handleStrike() {
    const isStrikeThree = game.strikes === 2
  
    if (!isStrikeThree) {
      await handleNormalCountEvent(
        "strike",
        "Strike",
        {
          type: "STRIKE",
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
  
      const engineGameState = {
        ...game,
  
        score: {
          home:
            game.score?.[game.homeTeam] ?? 0,
  
          away:
            game.score?.[game.awayTeam] ?? 0,
        },
  
        bases: game.bases ?? {
          first: null,
          second: null,
          third: null,
        },
  
        inning: game.inning ?? 1,
        half: game.half ?? "top",
        outs: game.outs ?? 0,
        version: game.version ?? 0,
      }
  
      const playEvent = {
        id: crypto.randomUUID(),
        playType: "strikeout",
        batter,
  
        metadata: {
          resultType: "strikeout",
        },
      }
  
      const result = applyPlay(
        engineGameState,
        playEvent
      )
  
      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ??
            "Could not score the strikeout."
        )
      }
  
      await handleGameAction({
        game,
        dispatch,
  
        action: {
          type: "APPLY_PLAY_RESULT",
          result,
          batterId: batter.id,
  
          pitcherId:
            game.currentPitcher?.id ??
            game.pitcher?.id ??
            null,
        },
  
        eventType: "strikeout",
        label: `Strikeout - ${batter.name}`,
  
        extraEventData: {
          player_id: batter.id,
          runs: 0,
          rbi: 0,
          outs_recorded:
            result.metadata.outsRecorded,
  
          details: {
            playId: playEvent.id,
            playType: "strikeout",
          },
        },
      })
    } catch (error) {
      console.error(
        "Could not resolve strikeout:",
        error
      )
  
      alert(
        error.message ||
          "Could not resolve strikeout"
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

          <Button onClick={handleStrike}>
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