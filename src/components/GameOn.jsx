import React, { useEffect, useReducer, useState } from "react"

import { gameReducer } from "../state/gameReducer"
import { initialGame } from "../state/initialGame"
import { getLatestGame } from "../services/gamesService"

import { CountControls } from "./CountControls"
import GameSetupScreen from "./GameSetupScreen"
import { Scoreboard } from "./Scoreboard"
import { BaseDiamond } from "./BaseDiamond"
import { PlayControls } from "./PlayControls"
import { EventFeed } from "./EventFeed"
import { Button } from "./ui/button"
import { GameSummary } from "./GameSummary"
import { BoxScore } from "./BoxScore"

export default function TapScorePrototype() {
  const [game, dispatch] = useReducer(gameReducer, initialGame)
  const [loading, setLoading] = useState(true)
  const [showVoiceConfirm, setShowVoiceConfirm] = useState(false)
  const [showAudioPrompt, setShowAudioPrompt] = useState(false)

  useEffect(() => {
    async function loadDefaultGame() {
      try {
        const savedGame = await getLatestGame()

        if (savedGame?.state) {
          dispatch({
            type: "LOAD_GAME",
            game: savedGame.state,
          })
        }
      } catch (error) {
        console.error("Could not load saved game:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDefaultGame()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-green-950 text-white p-4">
        Loading game...
      </main>
    )
  }

  if (game.status === "setup") {
    return (
      <GameSetupScreen
        game={game}
        onStart={(payload) =>
          dispatch({
            type: "START_GAME",
            ...payload,
          })
        }
      />
    )
  }

  if (game.status === "summary") {
    return (
      <GameSummary
        game={game}
        onRestart={() => window.location.reload()}
      />
    )
  }

  return (
    <main className="min-h-screen bg-green-950 text-white p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Scoreboard game={game} />
        <BaseDiamond bases={game.bases} />

        <CountControls
          game={game}
          dispatch={dispatch}
        />

        <PlayControls
          game={game}
          dispatch={dispatch}
          onVoice={() => setShowVoiceConfirm(true)}
          onFakeAudioAssist={() => setShowAudioPrompt(true)}
        />

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
          onClick={() => dispatch({ type: "END_GAME" })}
        >
          End Game
        </Button>
      </div>

      {showVoiceConfirm && (
        <VoiceInputModal
          heardText="Single to center, runner to second"
          parsedPlay="Single"
          onCancel={() => setShowVoiceConfirm(false)}
          onConfirm={() => {
            dispatch({ type: "SINGLE" })
            setShowVoiceConfirm(false)
          }}
        />
      )}

      {showAudioPrompt && (
        <AudioAssistPrompt
          onClose={() => setShowAudioPrompt(false)}
          onPlay={(type) => {
            dispatch({ type })
            setShowAudioPrompt(false)
          }}
        />
      )}
    </main>
  )
}