


import React, { useMemo, useReducer, useState } from "react";
import { Mic, Undo2, Video, Zap, Users, Trophy } from "lucide-react";
import { LineupEditor } from "./LineupEditor";
import {Card, CardContent} from "./ui/card"
import { Button } from "./ui/button";
import { createGame } from "../services/gamesService"
import { supabase } from "../lib/supabase"
import { saveLineup } from "../services/playersService"

import { findOrCreateTeam } from "../services/teamServices"


async function testConnection() {
  const { data, error } = await supabase
    .from("teams")
    .select("*")

  console.log("DATA:", data)
  console.log("ERROR:", error)
}
export default function GameSetupScreen({ game, onStart }) {
  const [homeTeam, setHomeTeam] = useState(game.homeTeam);
  const [awayTeam, setAwayTeam] = useState(game.awayTeam);
  const [homeLineup, setHomeLineup] = useState(game.lineups[game.homeTeam]);
  const [awayLineup, setAwayLineup] = useState(game.lineups[game.awayTeam]);


  

  return (
    <main className="scoreboard-shell p-4 md:p-6">
  <Card className="scoreboard-panel mx-auto w-full max-w-md rounded-none text-scoreboard-cream">
    <CardContent className="relative z-10 space-y-6 p-6">
      <header className="border-b-2 border-scoreboard-red pb-4">
        <div className="flex items-center gap-3">
          <Trophy className="h-7 w-7 text-scoreboard-amber" />

          <h1 className="scoreboard-title text-2xl">
            GameOn
          </h1>
        </div>

        <p className="scoreboard-label mt-2">
          With UmpAI
        </p>
      </header>

      <label className="block space-y-2">
        <span className="scoreboard-label">
          Away Team
        </span>

        <input
          className="scoreboard-input"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          placeholder="Enter away team"
        />
      </label>

      <section className="border-t border-scoreboard-cream/30 pt-5">
        <LineupEditor
          title={`${awayTeam} Lineup`}
          lineup={awayLineup}
          setLineup={setAwayLineup}
        />
      </section>

      <label className="block space-y-2">
        <span className="scoreboard-label">
          Home Team
        </span>

        <input
          className="scoreboard-input"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          placeholder="Enter home team"
        />
      </label>

      <section className="border-t border-scoreboard-cream/30 pt-5">
        <LineupEditor
          title={`${homeTeam} Lineup`}
          lineup={homeLineup}
          setLineup={setHomeLineup}
        />
      </section>

      <div className="space-y-3 border-t-2 border-scoreboard-red pt-5">
        <Button
          className="scoreboard-button scoreboard-button-primary w-full rounded-none py-6 text-lg"
          onClick={async () => {
            try {
              const savedHomeTeam = await findOrCreateTeam(homeTeam)
              const savedAwayTeam = await findOrCreateTeam(awayTeam)

              const savedGame = await createGame({
                homeTeamId: savedHomeTeam.id,
                awayTeamId: savedAwayTeam.id,
              })

              const savedHomeLineup = await saveLineup({
                gameId: savedGame.id,
                teamId: savedHomeTeam.id,
                lineup: homeLineup,
              })

              const savedAwayLineup = await saveLineup({
                gameId: savedGame.id,
                teamId: savedAwayTeam.id,
                lineup: awayLineup,
              })

              onStart({
                gameId: savedGame.id,
                homeTeam: savedHomeTeam.name,
                awayTeam: savedAwayTeam.name,
                homeLineup: savedHomeLineup,
                awayLineup: savedAwayLineup,
              })
            } catch (error) {
              console.error("Could not start game:", error)
              alert(error.message)
            }
          }}
        >
          Start Game
        </Button>

        <Button
          variant="outline"
          className="scoreboard-button w-full rounded-none"
          onClick={testConnection}
        >
          Test Supabase
        </Button>
      </div>
    </CardContent>
  </Card>
</main>
  );
}