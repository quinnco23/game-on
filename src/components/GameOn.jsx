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
import { BaseDiamond } from "./BaseDiamond"
import { PlayControls } from "./PlayControls"
import { EventFeed } from "./EventFeed"
import { Button } from "./ui/button"
import { GameSummary } from "./GameSummary"
import { BoxScore } from "./BoxScore"
import { PlayResolutionDialog } from "./PlayResolutionDialog"
import { getCurrentBatter } from "../state/gameLogic"
import { handleGameAction } from "../services/gameActions"
import { OutResultDialog } from "./OutResultDialog"



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

  useEffect(() => {
    async function loadHomeData() {
      try {
        const active = await getActiveGame()
        const finished = await getFinishedGames()

        setActiveGame(active)
        setFinishedGames(finished || [])
      } catch (error) {
        console.error("Could not load home data:", error)
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
        onResume={() => {
          dispatch({
            type: "LOAD_GAME",
            game: activeGame.state,
          })
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
        <BaseDiamond bases={game.bases} />

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
      await handleGameAction({
        game,
        dispatch,
        action: {
          type: "RESOLVE_HIT",
          resolution,
        },
        eventType: resolution.playType,
        label: `${resolution.playType} - ${getCurrentBatter(game).name}`,
        extraEventData: {
          runs: resolution.runs,
          rbi: resolution.rbi,
          details: resolution.details,
        },
      })

      setPendingHitType(null)
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