import React, { useMemo, useReducer, useState } from "react";
import { Mic, Undo2, Video, Zap, Users, Trophy } from "lucide-react";

import { gameReducer } from "../state/gameReducer";
import { initialGame } from "../state/initialGame";
import {CountControls} from "../components/CountControls";
import GameSetupScreen from "./GameSetupScreen";
import { Scoreboard } from "./Scoreboard";
import { BaseDiamond } from "./BaseDiamond";
import { PlayControls } from "./PlayControls";
import { EventFeed } from "./EventFeed";
import { Button } from "./ui/button";
import { GameSummary } from "./GameSummary";

/**
 * TapScore AI - V1 React Component Structure
 *CountControls}
 * This is intentionally frontend-only and mock-data driven.
 * It gives you a clean component hierarchy for:
 * - Game setup
 * - Main scoring screen
 * - Voice confirmation
 * - Audio-assist event prompt
 * - Game summary
 *
 * Suggested future split:
 * /app
 *   App.tsx
 * /components
 *   HomeScreen.tsx
 *   GameSetupScreen.tsx
 *   Scoreboard.tsx
 *   CountControls.tsx
 *   PlayControls.tsx
 *   BaseDiamond.tsx
 *   VoiceInputModal.tsx
 *   AudioAssistPrompt.tsx
 *   GameSummary.tsx
 * /state
 *   gameReducer.ts
 *   gameTypes.ts
 */






export default function TapScorePrototype() {
  const [game, dispatch] = useReducer(gameReducer, initialGame);
  const [showVoiceConfirm, setShowVoiceConfirm] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);

  if (game.status === "setup") {
    return <GameSetupScreen game={game} onStart={(payload) => dispatch({ type: "START_GAME", ...payload })} />;
  }

  if (game.status === "summary") {
    return <GameSummary game={game} onRestart={() => window.location.reload()} />;
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
/>
        <EventFeed events={game.events} />

        <Button className="w-full rounded-2xl" variant="secondary" onClick={() => dispatch({ type: "END_GAME" })}>
          End Game
        </Button>
      </div>

      {showVoiceConfirm && (
        <VoiceInputModal
          heardText="Single to center, runner to second"
          parsedPlay="Single"
          onCancel={() => setShowVoiceConfirm(false)}
          onConfirm={() => {
            dispatch({ type: "SINGLE" });
            setShowVoiceConfirm(false);
          }}
        />
      )}

      {showAudioPrompt && (
        <AudioAssistPrompt
          onClose={() => setShowAudioPrompt(false)}
          onPlay={(type) => {
            dispatch({ type });
            setShowAudioPrompt(false);
          }}
        />
      )}
    </main>
  );
}











