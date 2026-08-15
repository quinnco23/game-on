import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createTeam } from "@/services/teamService"

export function NewTeamScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState("")

  async function handleCreate() {
    if (!name.trim()) return

    try {
      const team = await createTeam(name)

      navigate(`/teams/${team.id}`)
    } catch (error) {
      console.error("Could not create team:", error)
      alert(error.message)
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-5 p-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="scoreboard-title text-3xl">
        Add Team
      </h1>

      <input
        className="scoreboard-input w-full"
        placeholder="Team name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        type="button"
        className="scoreboard-button scoreboard-button-primary w-full"
        onClick={handleCreate}
      >
        Create Team
      </button>
    </main>
  )
}