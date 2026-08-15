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

export function CountControls({
  game,
  dispatch,
  onBall,
  onCalledStrike,
  onSwingingStrike,
  onFoul,
  onInPlay,
  onStrikeout,
}) {
  const walkLikely = game.balls === 3
  const strikeoutLikely = game.strikes === 2



  async function handleBall() {
    const isBallFour =
      game.balls === 3
  
    // Balls 1–3
    if (!isBallFour) {
      onBall()
      return
    }
  
    try {
      const batter =
        getCurrentBatter(game)
  
      if (!batter) {
        throw new Error(
          "Could not identify the current batter."
        )
      }
  
      const runnerDecisions =
        getForcedAdvanceDecisions(
          game.bases
        )
  
      const engineGameState = {
        ...game,
  
        score: {
          home:
            game.score?.[game.homeTeam] ?? 0,
  
          away:
            game.score?.[game.awayTeam] ?? 0,
        },
  
        bases:
          game.bases ?? {
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
  
      const result =
        applyPlay(
          engineGameState,
          playEvent
        )
  
      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ??
            "Could not score the walk."
        )
      }
  
      // Find defensive team
      const defensiveSide =
        game.half === "top"
          ? "home"
          : "away"
  
      const defensiveTeamName =
        defensiveSide === "home"
          ? game.homeTeam
          : game.awayTeam
  
      const defensivePlayers =
        game.gameRoster?.[
          defensiveTeamName
        ] ?? []
  
      const derivedDefense =
        Object.fromEntries(
          defensivePlayers
            .map((player) => [
              player.default_position ??
                player.position,
              player.id,
            ])
            .filter(
              ([position]) =>
                position
            )
        )
  
      const defensiveAlignment =
        Object.keys(
          game.defense?.[
            defensiveSide
          ] ?? {}
        ).length > 0
          ? game.defense[
              defensiveSide
            ]
          : derivedDefense
  
      const currentPitcherId =
        defensiveAlignment?.P ?? null
  
      console.log(
        "BALL FOUR PITCHER:",
        {
          defensiveSide,
          defensiveTeamName,
          currentPitcherId,
        }
      )
  
      await handleGameAction({
        game,
        dispatch,
  
        action: {
          type: "APPLY_PLAY_RESULT",
          result,
          batterId: batter.id,
          pitcherId:
            currentPitcherId,
        },
  
        eventType: "walk",
        label:
          `Walk - ${batter.name}`,
  
        extraEventData: {
          player_id: batter.id,
  
          runs:
            result.metadata
              .runsScored,
  
          rbi:
            result.metadata
              .rbiCount,
  
          outs_recorded:
            result.metadata
              .outsRecorded,
  
          details: {
            playId:
              playEvent.id,
  
            runnerDecisions,
  
            runnerAdvances:
              result.metadata
                .runnerAdvances,
  
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
  function handleStrike() {
    if (game.strikes === 2) {
      onStrikeout()
      return
    }
  
    onStrike()
  }

  function handleCalledStrike() {
    if (game.strikes === 2) {
      onStrikeout("calledStrike")
      return
    }
  
    onCalledStrike()
  }
  
  function handleSwingingStrike() {
    if (game.strikes === 2) {
      onStrikeout("swingingStrike")
      return
    }
  
    onSwingingStrike()
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

        <div className="grid grid-cols-2 gap-2">
  <Button onClick={handleBall}>
    {walkLikely
      ? "Ball 4 / Walk"
      : "Ball"}
  </Button>

  <Button onClick={handleCalledStrike}>
    Called Strike
  </Button>

  <Button onClick={handleSwingingStrike}>
    Swinging Strike
  </Button>

  <Button onClick={onFoul}>
    Foul
  </Button>

  <Button
    className="col-span-2"
    onClick={onInPlay}
  >
    In Play
  </Button>
</div>
      </CardContent>
    </Card>
  )
}