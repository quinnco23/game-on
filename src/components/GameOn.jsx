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
        console.log("Resolution received:", resolution)
    
        const runnerResult = resolveRunnerMovement({
          bases: game.bases,
          batter: getCurrentBatter(game),
          batterDestination: resolution.batterDestination,
          runnerDecisions: resolution.runnerDecisions,
        })
    
        console.log("Runner Engine Result:", runnerResult)
    
        const resolvedPlay = {
          ...resolution,
          runnerAdvances: runnerResult.runnerAdvances,
          bases: runnerResult.bases,
          runs: runnerResult.runsScored,
          outsRecorded: runnerResult.outsRecorded,
          details: {
            ...resolution.details,
            runnerAdvances: runnerResult.runnerAdvances,
            resultingBases: runnerResult.bases,
          },
        }
    
        await handleGameAction({
          game,
          dispatch,
          action: {
            type: "RESOLVE_PLAY",
            resolution: resolvedPlay,
          },
          eventType: resolvedPlay.playType,
          label: `${resolvedPlay.playType} - ${getCurrentBatter(game).name}`,
          extraEventData: {
            runs: resolvedPlay.runs,
            rbi: resolvedPlay.rbi,
            outs_recorded: resolvedPlay.outsRecorded,
            details: resolvedPlay.details,
          },
        })
    
        setPendingHitType(null)
      } catch (error) {
        console.error("Could not resolve play:", error)
        alert(error.message || "Could not resolve play")
      }
    }}
  />
)}

{showOutResultDialog && (
  <OutResultDialog
    onCancel={() => setShowOutResultDialog(false)}
    onConfirm={async ({ eventType, label, action, details, outsRecorded }) => {
      try {
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
        console.error("Could not save result:", error)
        alert(error.message || "Could not save result")
      }
    }}
  />
)}

        <EventFeed events={game.events} />

        <BoxScore
          title={game.awayTeam}
          events={game.events}
          lineup={game.lineups[game.awayTeam]}
        />

        <BoxScore
          title={game.homeTeam}
          events={game.events}
          lineup={game.lineups[game.homeTeam]}
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