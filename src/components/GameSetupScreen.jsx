


import React, {
  useEffect,
  useState,
} from "react"

import { Trophy } from "lucide-react"
import { LineupEditor } from "./LineupEditor"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"

import { createGame } from "../services/gamesService"
import { saveLineup, getTeamPlayers } from "../services/playersService"
import { getTeams } from "@/services/teamService"




export default function GameSetupScreen({ game, onStart }) {

  const [teams, setTeams] = useState([])

  const [homeTeamId, setHomeTeamId] =
    useState("")

  const [awayTeamId, setAwayTeamId] =
    useState("")

  const [homeRoster, setHomeRoster] =
    useState([])

  const [awayRoster, setAwayRoster] =
    useState([])

  const [homeLineup, setHomeLineup] =
    useState([])

  const [awayLineup, setAwayLineup] =
    useState([])


useEffect(() => {
  async function loadTeams() {
    try {
      const result = await getTeams()
      setTeams(result)
    } catch (error) {
      console.error(
        "Could not load teams:",
        error
      )
    }
  }

  loadTeams()
}, [])

async function handleHomeTeamChange(teamId) {
  setHomeTeamId(teamId)
  setHomeLineup([])

  if (!teamId) {
    setHomeRoster([])
    return
  }

  try {
    const roster =
      await getTeamPlayers(teamId)

    setHomeRoster(roster)
  } catch (error) {
    console.error(
      "Could not load home roster:",
      error
    )
  }
}

async function handleAwayTeamChange(teamId) {
  if (teamId === awayTeamId) {
    return
  }

  setAwayTeamId(teamId)

  // Only clear because this is genuinely a new team.
  setAwayLineup([])
  setAwayRoster([])

  if (!teamId) {
    return
  }

  try {
    const roster =
      await getTeamPlayers(teamId)

    setAwayRoster(roster)
  } catch (error) {
    console.error(
      "Could not load away roster:",
      error
    )
  }
}

const homeTeam =
    teams.find(
      (team) => team.id === homeTeamId
    )

  const awayTeam =
    teams.find(
      (team) => team.id === awayTeamId
    )
    const canStartGame =
    homeTeam &&
    awayTeam &&
    homeLineup.length > 0 &&
    awayLineup.length > 0

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

        <select
  className="scoreboard-input w-full"
  value={awayTeamId}
  onChange={(e) =>
    handleAwayTeamChange(e.target.value)
  }
>
  <option value="">
    Select Away Team
  </option>

  {teams.map((team) => (
    <option
      key={team.id}
      value={team.id}
    >
      {team.name}
    </option>
  ))}
</select>
      </label>

      <section className="border-t border-scoreboard-cream/30 pt-5">
        <LineupEditor
           title={`${awayTeam?.name ?? "Away"} Lineup`}
          lineup={awayLineup}
          roster={awayRoster}
          setLineup={setAwayLineup}
        />
      </section>

      <label className="block space-y-2">
        <span className="scoreboard-label">
          Home Team
        </span>

        <select
  className="scoreboard-input w-full"
  value={homeTeamId}
  onChange={(e) =>
    handleHomeTeamChange(e.target.value)
  }
>
  <option value="">
    Select Home Team
  </option>

  {teams.map((team) => (
    <option
      key={team.id}
      value={team.id}
    >
      {team.name}
    </option>
  ))}
</select>
      </label>

      <section className="border-t border-scoreboard-cream/30 pt-5">
        <LineupEditor
            title={`${homeTeam?.name ?? "Home"} Lineup`}
          lineup={homeLineup}
          roster={homeRoster}
          setLineup={setHomeLineup}
        />
      </section>

      <div className="space-y-3 border-t-2 border-scoreboard-red pt-5">
      <Button
      disabled={!canStartGame}
  className="scoreboard-button scoreboard-button-primary w-full rounded-none py-6 text-lg"
  onClick={async () => {
    console.log("START GAME BUTTON CLICKED")
  
    console.log("SETUP STATE:", {
      homeTeam,
      awayTeam,
      homeLineup,
      awayLineup,
      homeRoster,
      awayRoster,
    })
  
    try {
      // Make sure both teams are selected
      if (!homeTeam || !awayTeam) {
        alert(
          "Select both a home and away team."
        )
        return
      }
  
      // Make sure both lineups exist
      if (
        homeLineup.length === 0 ||
        awayLineup.length === 0
      ) {
        alert(
          "Both teams need at least one player in the lineup."
        )
        return
      }
  
      console.log("START LINEUPS:", {
        home: homeLineup.map(
          (player) => player.name
        ),
        away: awayLineup.map(
          (player) => player.name
        ),
      })
  
      console.log("ABOUT TO CREATE GAME")
  
      const savedGame =
        await createGame({
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
        })
  
        console.log("START LINEUPS:", {
          home: homeLineup.map(
            (player) => player.name
          ),
          away: awayLineup.map(
            (player) => player.name
          ),
        })

console.log(
  "GAME CREATED:",
  savedGame
)

console.log(
  "HOME LINEUP BEFORE SAVE:",
  homeLineup
)

console.log(
  "AWAY LINEUP BEFORE SAVE:",
  awayLineup
)

console.time("SAVE BOTH LINEUPS")

const [
  savedHomeLineup,
  savedAwayLineup,
] = await Promise.all([
  saveLineup({
    gameId: savedGame.id,
    teamId: homeTeam.id,
    lineup: homeLineup,
  }),

  saveLineup({
    gameId: savedGame.id,
    teamId: awayTeam.id,
    lineup: awayLineup,
  }),
])

console.timeEnd("SAVE BOTH LINEUPS")

console.log(
  "SAVED HOME LINEUP:",
  savedHomeLineup
)

console.log(
  "SAVED AWAY LINEUP:",
  savedAwayLineup
)

console.timeEnd("START GAME TOTAL")

onStart({
  gameId: savedGame.id,

  homeTeam: homeTeam.name,
  awayTeam: awayTeam.name,

  homeLineup: savedHomeLineup,
  awayLineup: savedAwayLineup,

  homeRoster,
  awayRoster,
})
    } catch (error) {
      console.error(
        "Could not start game:",
        error
      )

      alert(error.message)
    }
  }}
>
  Start Game
</Button>

       
      </div>
    </CardContent>
  </Card>
</main>
  );
}