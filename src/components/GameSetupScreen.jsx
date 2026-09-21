


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
import { resolveLineupPlayers } from "../services/playersService"
import { GameFormatSelector } from "./GameFormatSelector"

const defaultGameRules = {
  innings: 6,

  timeLimit: {
    enabled: false,
    minutes: 100,
  },

  runLimit: {
    enabled: false,

    home: {
      enabled: true,
      runs: 5,
    },

    away: {
      enabled: true,
      runs: 5,
    },

    lastInningUnlimited: false,
  },

  mercyRule: {
    enabled: false,

    thresholds: [
      {
        afterInning: 3,
        runDifferential: 15,
      },
      {
        afterInning: 4,
        runDifferential: 10,
      },
    ],
  },
}


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

    

    const [gameRules, setGameRules] = useState({
      // Regulation
      innings: 6,
    
      // Time limit
      timeLimitMinutes: 100,
      timeLimitRule: "no_new_inning",

      minimumPlayers: 9,
    
      // Extra innings
      allowExtraInnings: false,
    
      // Run limit per half-inning
      runLimit: {
        enabled: false,
    
        home: {
          enabled: true,
          runs: 5,
        },
    
        away: {
          enabled: true,
          runs: 5,
        },
    
        lastInningUnlimited: false,
      },
    
      // Mercy / run-differential rule
      mercyRule: {
        enabled: false,
    
        thresholds: [
          {
            afterInning: 3,
            runDifferential: 15,
          },
          {
            afterInning: 4,
            runDifferential: 10,
          },
        ],
      },
    })

  


    function swapHomeAway() {
      const previousHomeTeamId =
        homeTeamId
    
      const previousHomeRoster =
        homeRoster
    
      const previousHomeLineup =
        homeLineup
    
      setHomeTeamId(awayTeamId)
      setAwayTeamId(previousHomeTeamId)
    
      setHomeRoster(awayRoster)
      setAwayRoster(previousHomeRoster)
    
      setHomeLineup(awayLineup)
      setAwayLineup(previousHomeLineup)
    }

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


    const minimumPlayers =
  gameRules?.minimumPlayers ?? 9

const validHomePlayers =
  (homeLineup ?? []).filter(
    (player) => player?.name?.trim()
  )

const validAwayPlayers =
  (awayLineup ?? []).filter(
    (player) => player?.name?.trim()
  )

const homeLineupValid =
  validHomePlayers.length >= minimumPlayers

const awayLineupValid =
  validAwayPlayers.length >= minimumPlayers
  const canStartGame =
  homeTeam &&
  awayTeam &&
  homeLineupValid &&
  awayLineupValid

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
      <Button
  type="button"
  variant="secondary"
  className="
    w-full
    rounded-none
    border
    border-scoreboard-cream/30
    py-3
    font-bold
  "
  disabled={
    !homeTeamId ||
    !awayTeamId
  }
  onClick={swapHomeAway}
>
  ⇅ Swap Home / Away
</Button>
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

      <GameFormatSelector
  value={gameRules}
  onChange={setGameRules}
/>

{!canStartGame && homeTeam && awayTeam && (
  <div className="border border-scoreboard-red/50 p-3 text-sm">
    <div className="font-bold text-scoreboard-red">
      Lineups incomplete
    </div>

    <div className="mt-1 text-scoreboard-muted">
      Away: {validAwayPlayers.length}/{minimumPlayers}
      {" • "}
      Home: {validHomePlayers.length}/{minimumPlayers}
    </div>
  </div>
)}
      <Button
  disabled={!canStartGame}
  className="scoreboard-button scoreboard-button-primary w-full rounded-none py-6 text-lg"
  onClick={async () => {
    console.log("START GAME BUTTON CLICKED")

    try {
      if (!homeTeam || !awayTeam) {
        alert(
          "Select both a home and away team."
        )
        return
      }

      if (!homeLineupValid || !awayLineupValid) {
        alert(
          `Both teams need at least ${minimumPlayers} players in the lineup.`
        )
        return
      }

      console.log("START LINEUPS:", {
        home: homeLineup.map((player) => ({
          id: player.id,
          name: player.name,
          position: player.position,
          default_position:
            player.default_position,
        })),
      
        away: awayLineup.map((player) => ({
          id: player.id,
          name: player.name,
          position: player.position,
          default_position:
            player.default_position,
        })),
      })

      const requiredPositions = [
  "P",
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "LF",
  "CF",
  "RF",
]

function getAssignedPositions(lineup) {
  return new Set(
    lineup
      .map(
        (player) =>
          player.position?.trim()?.toUpperCase() ||
          player.default_position?.trim()?.toUpperCase() ||
          ""
      )
      .filter(Boolean)
  )
}

const homePositions =
  getAssignedPositions(homeLineup)

const awayPositions =
  getAssignedPositions(awayLineup)

console.log("DEFENSIVE POSITION CHECK:", {
  home: [...homePositions],
  away: [...awayPositions],
})

if (homePositions.size === 0) {
  alert(
    `${homeTeam.name} has no defensive positions assigned. Assign positions before starting the game.`
  )
  return
}

if (awayPositions.size === 0) {
  alert(
    `${awayTeam.name} has no defensive positions assigned. Assign positions before starting the game.`
  )
  return
}
      
    
      
      console.log("DEFENSIVE POSITION CHECK:", {
        home: [...homePositions],
        away: [...awayPositions],
      })

      //
      // 1. RESOLVE MANUAL PLAYERS FIRST
      //
      const [
        resolvedHomeLineup,
        resolvedAwayLineup,
      ] = await Promise.all([
        resolveLineupPlayers(
          homeLineup,
          homeTeam.id
        ),

        resolveLineupPlayers(
          awayLineup,
          awayTeam.id
        ),
      ])

      const resolvedHomeRoster = [
        ...homeRoster,
        ...resolvedHomeLineup.filter(
          (lineupPlayer) =>
            !homeRoster.some(
              (rosterPlayer) =>
                rosterPlayer.id === lineupPlayer.id
            )
        ),
      ]
      
      const resolvedAwayRoster = [
        ...awayRoster,
        ...resolvedAwayLineup.filter(
          (lineupPlayer) =>
            !awayRoster.some(
              (rosterPlayer) =>
                rosterPlayer.id === lineupPlayer.id
            )
        ),
      ]

      const normalizedHomeRoster =
  resolvedHomeRoster.map((player) => ({
    ...player,

    position:
  player.position?.trim() ||
  player.default_position?.trim() ||
  "",

default_position:
  player.default_position?.trim() ||
  player.position?.trim() ||
  "",
  }))

const normalizedAwayRoster =
  resolvedAwayRoster.map((player) => ({
    ...player,

    position:
  player.position?.trim() ||
  player.default_position?.trim() ||
  "",

default_position:
  player.default_position?.trim() ||
  player.position?.trim() ||
  "",
  }))

      console.log(
        "RESOLVED HOME LINEUP:",
        resolvedHomeLineup
      )

      console.log(
        "RESOLVED AWAY LINEUP:",
        resolvedAwayLineup
      )

      //
      // 2. ONLY CREATE GAME AFTER PLAYERS EXIST
      //
      console.log(
        "ABOUT TO CREATE GAME"
      )

      const savedGame =
        await createGame({
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
        })

      console.log(
        "GAME CREATED:",
        savedGame
      )

      //
      // 3. SAVE BOTH LINEUPS
      //
      console.time(
        "SAVE BOTH LINEUPS"
      )

      const [
        savedHomeLineup,
        savedAwayLineup,
      ] = await Promise.all([
        saveLineup({
          gameId: savedGame.id,
          teamId: homeTeam.id,
          lineup:
            resolvedHomeLineup,
        }),

        saveLineup({
          gameId: savedGame.id,
          teamId: awayTeam.id,
          lineup:
            resolvedAwayLineup,
        }),
      ])

      const normalizedHomeLineup =
  resolvedHomeLineup.map(
    (player, index) => ({
      ...player,

      position:
        player.position?.trim() ||
        player.default_position?.trim() ||
        "",

      default_position:
        player.default_position?.trim() ||
        player.position?.trim() ||
        "",

      battingOrder: index + 1,
    })
  )

const normalizedAwayLineup =
  resolvedAwayLineup.map(
    (player, index) => ({
      ...player,

      position:
        player.position?.trim() ||
        player.default_position?.trim() ||
        "",

      default_position:
        player.default_position?.trim() ||
        player.position?.trim() ||
        "",

      battingOrder: index + 1,
    })
  )

      console.timeEnd(
        "SAVE BOTH LINEUPS"
      )

      console.log(
        "SAVED HOME LINEUP:",
        savedHomeLineup
      )

      console.log(
        "SAVED AWAY LINEUP:",
        savedAwayLineup
      )

      //
      // 4. ENTER THE GAME
      //

      console.log(
        "FINAL LINEUPS SENT TO GAME:",
        {
          home: normalizedHomeLineup,
          away: normalizedAwayLineup,
        }
      )

      onStart({
        gameId: savedGame.id,

        homeTeam:
          homeTeam.name,

        awayTeam:
          awayTeam.name,

          homeLineup: normalizedHomeLineup,
          awayLineup: normalizedAwayLineup,

          homeRoster: normalizedHomeLineup,
awayRoster: normalizedAwayLineup,

        gameRules,
      })
    } catch (error) {
      console.error(
        "Could not start game:",
        error
      )

      alert(
        error.message ||
          "Could not start game"
      )
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