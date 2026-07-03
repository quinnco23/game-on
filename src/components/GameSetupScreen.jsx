


import React, { useMemo, useReducer, useState } from "react";
import { Mic, Undo2, Video, Zap, Users, Trophy } from "lucide-react";
import { LineupEditor } from "./LineupEditor";
import {Card, CardContent} from "./ui/Card"
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
    <main className="min-h-screen bg-green-950 text-white p-4">
      <Card className="mx-auto w-full max-w-md rounded-3xl bg-white/10 border-white/10 text-white">
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Trophy className="h-7 w-7" /> GameOn
            </div>
            <p className="text-sm text-white/70 mt-2">With UmpAI </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-white/70">Away Team</span>
            <input className="w-full rounded-2xl p-3 text-white" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} />
          </label>

          <LineupEditor title={`${awayTeam} Lineup`} lineup={awayLineup} setLineup={setAwayLineup} />

          <label className="block space-y-2">
            <span className="text-sm text-white/70">Home Team</span>
            <input className="w-full rounded-2xl p-3 text-slate-900" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} />
          </label>

          <LineupEditor title={`${homeTeam} Lineup`} lineup={homeLineup} setLineup={setHomeLineup} />

          <Button
  className="w-full rounded-2xl text-lg py-6"
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
  variant="secondary"
  className="w-full"
  onClick={testConnection}
>
  Test Supabase
</Button>
        </CardContent>
      </Card>
    </main>
  );
}