import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getTeams } from "@/services/teamService"

export function TeamsScreen() {
  const navigate = useNavigate()

  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadTeams() {
    try {
      const result = await getTeams()
      setTeams(result)
    } catch (error) {
      console.error(
        "Could not load teams:",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  return (
    <main className="mx-auto max-w-md space-y-6 p-4">
      <header>
        <button
          type="button"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

        <h1 className="scoreboard-title mt-3 text-3xl">
          Teams
        </h1>
      </header>

      <button
        type="button"
        className="
          scoreboard-button
          scoreboard-button-primary
          w-full
        "
        onClick={() =>
          navigate("/teams/new")
        }
      >
        + Add Team
      </button>

      <section className="space-y-3">
        {loading ? (
          <div>Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="text-sm opacity-60">
            No teams yet.
          </div>
        ) : (
          teams.map((team) => (
            <button
              key={team.id}
              type="button"
              className="
                scoreboard-button
                flex w-full
                items-center
                justify-between
                text-left
              "
              onClick={() =>
                navigate(`/teams/${team.id}`)
              }
            >
              <span>{team.name}</span>
              <span>›</span>
            </button>
          ))
        )}
      </section>
    </main>
  )
}