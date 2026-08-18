import { useEffect, useState } from "react"
import { getTeams } from "@/services/teamService"


import {
    scheduleGame,
    getUpcomingGames,
    deleteScheduledGame,
  } from "@/services/gamesService"

export function ScheduleGameScreen() {
  const [teams, setTeams] = useState([])

  const [homeTeamId, setHomeTeamId] =
    useState("")

  const [awayTeamId, setAwayTeamId] =
    useState("")

  

    const [upcomingGames, setUpcomingGames] =
  useState([])

  const [venue, setVenue] =
  useState("")

const [fieldName, setFieldName] =
  useState("")

  const [scheduledDate, setScheduledDate] =
  useState("")

const [scheduledTime, setScheduledTime] =
  useState("")

  async function loadUpcomingGames() {
    try {
      const result =
        await getUpcomingGames()
  
      setUpcomingGames(result)
    } catch (error) {
      console.error(
        "Could not load scheduled games:",
        error
      )
    }
  }

  useEffect(() => {
    async function loadPage() {
      try {
        const teamResult = await getTeams()
  
        setTeams(teamResult)
  
        await loadUpcomingGames()
      } catch (error) {
        console.error(
          "Could not load scheduler:",
          error
        )
      }
    }
  
    loadPage()
  }, [])

  

  useEffect(() => {
    async function loadTeams() {
      const result = await getTeams()
      setTeams(result)
    }

    loadTeams()
  }, [])

  async function handleSchedule() {
    console.log("SCHEDULE FORM:", {
      homeTeamId,
      awayTeamId,
      scheduledDate,
      scheduledTime,
      venue,
      fieldName,
    })
  
    if (
      !homeTeamId ||
      !awayTeamId ||
      !scheduledDate ||
      !scheduledTime
    ) {
      alert("Complete all fields.")
      return
    }
  
    if (homeTeamId === awayTeamId) {
      alert(
        "Home and away teams must be different."
      )
      return
    }
  
    try {
      const scheduledAt =
        new Date(
          `${scheduledDate}T${scheduledTime}`
        ).toISOString()
  
      await scheduleGame({
        homeTeamId,
        awayTeamId,
        scheduledAt,
        venue,
        fieldName,
      })
  
      await loadUpcomingGames()
  
      setHomeTeamId("")
      setAwayTeamId("")
      setScheduledDate("")
      setScheduledTime("")
      setVenue("")
      setFieldName("")
    } catch (error) {
      console.error(
        "Could not schedule game:",
        error
      )
  
      alert(error.message)
    }
  }

  

  async function handleDeleteGame(game) {
    const confirmed = window.confirm(
      `Remove ${game.away_team?.name ?? "Away"} @ ${
        game.home_team?.name ?? "Home"
      }?`
    )
  
    if (!confirmed) return
  
    try {
      await deleteScheduledGame(game.id)
  
      setUpcomingGames((current) =>
        current.filter(
          (scheduledGame) =>
            scheduledGame.id !== game.id
        )
      )
    } catch (error) {
      console.error(
        "Could not remove scheduled game:",
        error
      )
  
      alert(
        error.message ||
          "Could not remove scheduled game"
      )
    }
  }

  return (
    <main className="scoreboard-shell min-h-screen p-4">
      <div className="scoreboard-panel mx-auto max-w-md space-y-5 p-5">

        <h1 className="scoreboard-title text-2xl">
          Schedule Game
        </h1>

        <select
          className="scoreboard-input w-full"
          value={awayTeamId}
          onChange={(e) =>
            setAwayTeamId(e.target.value)
          }
        >
          <option value="">
            Away Team
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

        <select
          className="scoreboard-input w-full"
          value={homeTeamId}
          onChange={(e) =>
            setHomeTeamId(e.target.value)
          }
        >
          <option value="">
            Home Team
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
        <div className="grid gap-4 sm:grid-cols-2">
  {/* DATE */}
  <label className="block space-y-2">
    <span className="scoreboard-label">
      Date
    </span>

    <div className="relative">
      {!scheduledDate && (
        <span className="
          pointer-events-none
          absolute
          inset-y-0
          left-3
          flex
          items-center
          text-base
          text-scoreboard-cream/50
          sm:hidden
        ">
          Select date
        </span>
      )}

      <input
        type="date"
        className="
          w-full
          h-[52px]
          rounded-none
          border
          border-scoreboard-cream/30
          bg-transparent
          px-3
          text-base
          text-scoreboard-cream
          [color-scheme:dark]
        "
        value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
      />
    </div>
  </label>

  {/* TIME */}
  <label className="block space-y-2">
    <span className="scoreboard-label">
      Time
    </span>

    <div className="relative">
      {!scheduledTime && (
        <span className="
          pointer-events-none
          absolute
          inset-y-0
          left-3
          flex
          items-center
          text-base
          text-scoreboard-cream/50
          sm:hidden
        ">
          Select time
        </span>
      )}

      <input
        type="time"
        className="
          w-full
          h-[52px]
          rounded-none
          border
          border-scoreboard-cream/30
          bg-transparent
          px-3
          text-base
          text-scoreboard-cream
          [color-scheme:dark]
        "
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
      />
    </div>
  </label>
</div>

<input
  type="text"
  className="scoreboard-input w-full"
  placeholder="Venue / Park"
  value={venue}
  onChange={(e) =>
    setVenue(e.target.value)
  }
/>

<input
  type="text"
  className="scoreboard-input w-full"
  placeholder="Field (optional)"
  value={fieldName}
  onChange={(e) =>
    setFieldName(e.target.value)
  }
/>

        <button
          type="button"
          className="
            scoreboard-button
            scoreboard-button-primary
            w-full
          "
          onClick={handleSchedule}
        >
          Schedule Game
        </button>
        <section className="space-y-3 border-t border-scoreboard-cream/20 pt-5">
  <div className="flex items-center justify-between">
    <h2 className="scoreboard-title text-xl">
      Scheduled Games
    </h2>

    <div className="scoreboard-label opacity-60">
      {upcomingGames.length} Upcoming
    </div>
  </div>

  {upcomingGames.length === 0 ? (
    <div className="scoreboard-label opacity-60">
      No games scheduled.
    </div>
  ) : (
    <div className="space-y-3">
      {upcomingGames.map((game) => (
        <div
          key={game.id}
          className="
            border
            border-scoreboard-cream/20
            bg-scoreboard-dark/60
            p-4
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="scoreboard-label text-scoreboard-amber">
                Upcoming
              </div>

              <div className="scoreboard-title mt-1">
                {game.away_team?.name ?? "Away"}
                {" @ "}
                {game.home_team?.name ?? "Home"}
              </div>
            </div>

            <div className="text-right">
              <div className="scoreboard-label">
                {new Date(
                  game.scheduled_at
                ).toLocaleDateString()}
              </div>

              <div className="mt-1 text-sm font-bold">
                {new Date(
                  game.scheduled_at
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-t border-scoreboard-cream/20 pt-3">
            <button
              type="button"
              className="scoreboard-button flex-1"
              onClick={() =>
                setEditingGame(game)
              }
            >
              Edit
            </button>

            <button
              type="button"
              className="
                scoreboard-button
                flex-1
                border-scoreboard-red
                text-scoreboard-red
              "
              onClick={() =>
                handleDeleteGame(game)
              }
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
      </div>

    
    </main>
  )
}