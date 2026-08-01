import React, { useEffect, useReducer, useState } from "react"

import { gameReducer } from "../state/gameReducer"
import { initialGame } from "../state/initialGame"
import {
  getActiveGame,
  getFinishedGames,
  finishGame,
} from "../services/gamesService"

import { HomeScreen } from "./HomeScreen"
import { CountControls } from "./CountControls"
import GameSetupScreen from "./GameSetupScreen"
import { Scoreboard } from "./Scoreboard"
// import { BaseDiamond } from "./BaseDiamond"
import { PlayControls } from "./PlayControls"
import { EventFeed } from "./EventFeed"
import { Button } from "./ui/button"
import { GameSummary } from "./GameSummary"
import { BoxScore } from "./BoxScore"
import { PlayResolutionDialog } from "./PlayResolutionDialog"
import { getCurrentBatter } from "../state/gameLogic"
import { handleGameAction } from "../services/gameActions"
import { OutResultDialog } from "./OutResultDialog"
import { BaseRunnersField } from "./BaseRunnersField"
import { resolveRunnerMovement } from "@/scoring/runnerEngine"
import { applyPlay } from "../scoring/playEngine";




function FieldBase({
  runner,
  label,
  className = "",
}) {
  const occupied = Boolean(runner)

  return (
    <div className={className}>
      <div
        className={[
          "ballpark-base",
          occupied
            ? "ballpark-base-occupied"
            : "ballpark-base-empty",
        ].join(" ")}
        title={
          occupied
            ? `${runner.name || "Runner"} on ${label}`
            : `${label} empty`
        }
      >
        <span className="ballpark-base-label">
          {label}
        </span>
      </div>

      {occupied && (
        <div
          className="
            absolute left-1/2 top-10 w-24 -translate-x-1/2
            truncate text-center font-heading text-[9px]
            font-bold uppercase tracking-wide text-scoreboard-cream
          "
        >
          {runner.name}
        </div>
      )}
    </div>
  )
}


export default function TapScorePrototype() {

  const [game, dispatch] = useReducer(gameReducer, initialGame)
  const [pendingHitType, setPendingHitType] = useState(null)

  const [screen, setScreen] = useState("home")
  const [activeGame, setActiveGame] = useState(null)
  const [finishedGames, setFinishedGames] = useState([])

  

  const [loading, setLoading] = useState(true)
  const [showVoiceConfirm, setShowVoiceConfirm] = useState(false)
  const [showAudioPrompt, setShowAudioPrompt] = useState(false)
  const [showOutResultDialog, setShowOutResultDialog] = useState(false)

 

  // useEffect(() => {
  //   const result = resolveRunnerMovement({
  //     bases: {
  //       first: null,
  //       second: null,
  //       third: null,
  //     },

  //     batter: {
  //       id: "1",
  //       name: "Jake",
  //     },

  //     batterDestination: "1B",
  //     runnerDecisions: {},
  //   })

  //   console.log("Runner engine result:", result)
  // }, [])

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [currentGame, completedGames] = await Promise.all([
          getActiveGame(),
          getFinishedGames(),
        ])
  
        console.log("Active game:", currentGame)
        console.log("Finished games:", completedGames)
  
        setActiveGame(currentGame)
        setFinishedGames(completedGames)
      } catch (error) {
        console.error("Could not load game data:", error)
      } finally {
        setLoading(false)
      }
    }
  
    loadHomeData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-green-950 text-white p-4">
        Loading...
      </main>
    )
  }

  if (screen === "home") {
    return (
      <HomeScreen
        activeGame={activeGame}
        finishedGames={finishedGames}
        onResume={(selectedGame) => {
          const savedState = selectedGame.state ?? selectedGame.game_state
        
          if (!savedState) {
            console.error("Active game has no saved state:", selectedGame)
            alert("This game does not contain a saved game state.")
            return
          }
        
          dispatch({
            type: "LOAD_GAME",
            game: savedState,
          })
        
          setActiveGame(selectedGame)
          setScreen("scoring")
        }}
        onNewGame={() => {
          dispatch({
            type: "LOAD_GAME",
            game: initialGame,
          })
          setScreen("setup")
        }}
        onViewFinished={(finishedGame) => {
          dispatch({
            type: "LOAD_GAME",
            game: finishedGame.state,
          })
          setScreen("summary")
        }}
      />
    )
  }

  if (screen === "setup" || game.status === "setup") {
    return (
      <GameSetupScreen
        game={game}
        onStart={(payload) => {
          dispatch({
            type: "START_GAME",
            ...payload,
          })
          setScreen("scoring")
        }}
      />
    )
  }

  if (screen === "summary" || game.status === "summary") {
    return (
      <GameSummary
        game={game}
        onRestart={() => setScreen("home")}
      />
    )
  }

  return (
    <main className="min-h-screen bg-green-950 text-white p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Scoreboard game={game} />
        <BaseRunnersField bases={game.bases} />

        <CountControls game={game} dispatch={dispatch} />

        <PlayControls
  game={game}
  dispatch={dispatch}
  onVoice={() => setShowVoiceConfirm(true)}
  onFakeAudioAssist={() => setShowAudioPrompt(true)}
  onOpenOutDialog={() => setShowOutResultDialog(true)}
  onOpenPlayResolution={(playType) => setPendingHitType(playType)}
/>

{pendingHitType && (
  <PlayResolutionDialog
    playType={pendingHitType}
    batter={getCurrentBatter(game)}
    bases={game.bases}
    onCancel={() => setPendingHitType(null)}
    onConfirm={async (resolution) => {
      try {
        const batter = getCurrentBatter(game);
    
        if (!batter) {
          throw new Error("No current batter was found.");
        }
    
        /*
         * Adapt the existing UI state to the scoring-engine state.
         *
         * Your UI currently stores scores using team names:
         * score[game.homeTeam]
         *
         * The engine currently expects:
         * score.home / score.away
         */
        const engineGameState = {
          ...game,
    
          score: {
            home: game.score?.[game.homeTeam] ?? 0,
            away: game.score?.[game.awayTeam] ?? 0,
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
        };
    
        const playEvent = {
          id: crypto.randomUUID(),
          playType: pendingHitType,
          batter,
    
          runnerDecisions:
            resolution.runnerDecisions ?? {},
    
          metadata: {
            ...(resolution.details ?? {}),
    
            batterDestination:
              resolution.batterDestination,
    
            notation:
              resolution.notation,
    
            fielding:
              resolution.fielding,
    
            doublePlay:
              resolution.doublePlay === true,
    
            triplePlay:
              resolution.triplePlay === true,
          },
        };
    
        const result = applyPlay(
          engineGameState,
          playEvent,
          {
            thirdOut: resolution.thirdOut,
          },
        );

        console.log("Ground-out batter stats:", {
          batterId: batter.id,
          playDefinition: result.metadata.playDefinition,
          batterStats: result.metadata.batterStats,
        })
    
        if (!result.ok) {
          console.error(
            "Play engine rejected the play:",
            result.errors,
          );
    
          throw new Error(
            result.errors?.[0]?.message ??
              "The play could not be scored.",
          );
        }
    
        console.log("Completed play result:", result);
    
        // await handleGameAction({
        //   game,
        //   dispatch,
    
        //   action: {
        //     type: "APPLY_PLAY_RESULT",
    
        //     result,
    
        //     batterId: batter.id,
    
        //     /*
        //      * This may remain undefined until the current
        //      * defensive pitcher is stored in game state.
        //      */
        //     pitcherId:
        //       game.currentPitcher?.id ??
        //       game.pitcher?.id ??
        //       null,
        //   },
    
        //   eventType: pendingHitType,
    
        //   label: `${pendingHitType} - ${batter.name}`,
    
        //   // extraEventData: {
        //   //   play_id: playEvent.id,
        //   //   player_id: batter.id,
    
        //   //   runs:
        //   //     result.metadata.runsScored,
    
        //   //   rbi:
        //   //     result.metadata.rbiCount,
    
        //   //   outs_recorded:
        //   //     result.metadata.outsRecorded,
    
        //   //   runner_advances:
        //   //     result.metadata.runnerAdvances,
    
        //   //    batter_stats:
        //   //      result.metadata.batterStats,
    
        //   //    pitcher_stats:
        //   //      result.metadata.pitcherStats,
    
        //   //    fielder_stats:
        //   //      result.metadata.fielderStats,
    
        //   //   details:
        //   //     result.metadata.event,
        //   // },

        //   extraEventData: {
        //     runs: result.metadata.runsScored,
        //     rbi: result.metadata.rbiCount,
        //     outs_recorded: result.metadata.outsRecorded,
          
        //     details: {
        //       ...result.metadata.event,
        //       playId: playEvent.id,
        //       runnerAdvances:
        //         result.metadata.runnerAdvances,
        //     },
        //   },
        // });
    

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
        
          eventType: pendingHitType,
          label: `${pendingHitType} - ${batter.name}`,
        });
        
        setPendingHitType(null);
        
        setPendingHitType(null);
        setPendingHitType(null);
      } catch (error) {
        console.error(
          "Could not resolve play:",
          error,
        );
    
        alert(
          error.message ||
            "Could not resolve play",
        );
      }
    }}
  />
)}

{showOutResultDialog && (
  <OutResultDialog
    onCancel={() => setShowOutResultDialog(false)}
    onConfirm={async ({
      eventType,
      label,
      action,
      details,
      outsRecorded,
    }) => {
      try {
        /*
         * Migrate ground outs through the new engine.
         * Other out types temporarily keep using the old path.
         */
        if (
          eventType === "groundout" ||
          eventType === "flyout"
        ) {
          const batter = getCurrentBatter(game)
        
          if (!batter) {
            throw new Error(
              "Could not identify the current batter."
            )
          }
        
          const enginePlayType =
            eventType === "groundout"
              ? "groundOut"
              : "flyOut"
        
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
        
          const fieldedBy =
            details.fieldedByPosition
        
          const putoutPosition =
            details.putoutPosition
        
          let fielding
        
          if (eventType === "groundout") {
            fielding = {
              putouts:
                putoutPosition
                  ? [putoutPosition]
                  : [],
        
              assists:
                fieldedBy &&
                putoutPosition &&
                fieldedBy !== putoutPosition
                  ? [fieldedBy]
                  : [],
        
              errors: [],
            }
          } else {
            /*
             * A routine flyout credits the catching fielder
             * with the putout and no assist.
             */
            fielding = {
              putouts:
                fieldedBy
                  ? [fieldedBy]
                  : [],
        
              assists: [],
              errors: [],
            }
          }
        
          const playEvent = {
            id: crypto.randomUUID(),
            playType: enginePlayType,
            batter,
        
            /*
             * Existing runners hold for this first version.
             * Tag-up choices come next.
             */
            runnerDecisions: {},
        
            metadata: {
              ...details,
        
              notation: details.notation,
        
              fielding,
        
              sacrifice:
                details.sacrifice === true,
        
              doublePlay: false,
              triplePlay: false,
            },
          }
        
          const result = applyPlay(
            engineGameState,
            playEvent
          )
        
          if (!result.ok) {
            throw new Error(
              result.errors?.[0]?.message ??
                `Could not score the ${enginePlayType}.`
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
        
            eventType: enginePlayType,
            label,
        
            extraEventData: {
              player_id: batter.id,
        
              outs_recorded:
                result.metadata.outsRecorded,
        
              runs:
                result.metadata.runsScored,
        
              rbi:
                result.metadata.rbiCount,
        
              details: {
                ...details,
        
                playId: playEvent.id,
        
                runnerAdvances:
                  result.metadata.runnerAdvances,
        
                fielding,
              },
            },
          })
        
          setShowOutResultDialog(false)
          return
        }
    
        /*
         * Temporary legacy path for flyouts, lineouts,
         * popouts, errors, and fielder's choices.
         */
        await handleGameAction({
          game,
          dispatch,
    
          action: {
            ...action,
            details,
          },
    
          eventType,
          label,
    
          extraEventData: {
            outs_recorded: outsRecorded,
            details,
          },
        })
    
        setShowOutResultDialog(false)
      } catch (error) {
        console.error(
          "Could not save result:",
          error
        )
    
        alert(
          error.message ||
            "Could not save result"
        )
      }
    }}
  />
)}

        <EventFeed events={game.events} />

        <BoxScore
  title={game.awayTeam}
  lineup={game.lineups?.[game.awayTeam] ?? []}
  gameStats={game.stats}
/>

<BoxScore
  title={game.homeTeam}
  lineup={game.lineups?.[game.homeTeam] ?? []}
  gameStats={game.stats}
/>

<Button
  className="w-full rounded-2xl"
  variant="secondary"
  onClick={async () => {
    const finalState = {
      ...game,
      status: "final",
    }

    await finishGame(game.id, finalState)

    dispatch({
      type: "LOAD_GAME",
      game: finalState,
    })

    setScreen("summary")
  }}
>
  Finish Game
</Button>
      </div>
    </main>
  )
}