import { useEffect, useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { getTeam, updateTeam } from "@/services/teamService"
import {
  createPlayer,
  getTeamPlayers,
  updatePlayer,
  deactivatePlayer,
} from "@/services/playersService"



export function TeamScreen() {
  const { teamId } = useParams()
  const navigate = useNavigate()

  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editingTeam, setEditingTeam] =
  useState(false)

const [editTeamName, setEditTeamName] =
  useState("")

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    number: "",
    position: "",
    bats: "",
    throws: "",
  })

  const [editingPlayer, setEditingPlayer] =
  useState(null)

const [editPlayer, setEditPlayer] =
  useState({
    name: "",
    number: "",
    position: "",
    bats: "",
    throws: "",
  })

  

  async function loadTeam() {
    try {
      setLoading(true)

      const [teamResult, playersResult] =
        await Promise.all([
          getTeam(teamId),
          getTeamPlayers(teamId),
        ])

      setTeam(teamResult)
      setPlayers(playersResult)
    } catch (error) {
      console.error(
        "Could not load team:",
        error
      )

      alert(
        error.message ||
          "Could not load team"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [teamId])

  async function handleSaveTeam() {
    const name = editTeamName.trim()
  
    if (!name) {
      alert("Enter a team name.")
      return
    }
  
    try {
      setSaving(true)
  
      const updatedTeam =
        await updateTeam(teamId, {
          name,
        })
  
      setTeam(updatedTeam)
      setEditingTeam(false)
    } catch (error) {
      console.error(
        "Could not update team:",
        error
      )
  
      alert(
        error.message ||
          "Could not update team"
      )
    } finally {
      setSaving(false)
    }
  }

  function updateNewPlayer(field, value) {
    setNewPlayer((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleAddPlayer() {
    if (!newPlayer.name.trim()) {
      alert("Enter a player name.")
      return
    }

    try {
      setSaving(true)

      const player = await createPlayer({
        teamId,
        name: newPlayer.name,
        number: newPlayer.number,
        position: newPlayer.position,
        bats: newPlayer.bats,
        throws: newPlayer.throws,
      })

      // Add immediately to the displayed roster.
      setPlayers((current) => [
        ...current,
        player,
      ])

      // Reset form.
      setNewPlayer({
        name: "",
        number: "",
        position: "",
        bats: "",
        throws: "",
      })
    } catch (error) {
      console.error(
        "Could not add player:",
        error
      )

      alert(
        error.message ||
          "Could not add player"
      )
    } finally {
      setSaving(false)
    }
  }

  function handleEditPlayer(player) {
    setEditingPlayer(player)
  
    setEditPlayer({
      name: player.name ?? "",
      number: player.number ?? "",
      position:
        player.default_position ?? "",
      bats: player.bats ?? "",
      throws: player.throws ?? "",
    })
  }

  async function handleSavePlayer() {
    if (!editingPlayer) return
  
    try {
      await updatePlayer(
        editingPlayer.id,
        editPlayer
      )
  
      setEditingPlayer(null)
  
      await loadTeam()
    } catch (error) {
      console.error(
        "Could not update player:",
        error
      )
  
      alert(
        error.message ||
          "Could not update player"
      )
    }
  }

  async function handleRemovePlayer(player) {
    const confirmed = window.confirm(
      `Remove ${player.name} from the active roster?`
    )
  
    if (!confirmed) return
  
    try {
      await deactivatePlayer(player.id)
  
      await loadTeam()
    } catch (error) {
      console.error(
        "Could not remove player:",
        error
      )
  
      alert(
        error.message ||
          "Could not remove player"
      )
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-md p-4">
        <div className="scoreboard-label">
          Loading roster...
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-4">

      {/* HEADER */}

      <header>
        <button
          type="button"
          className="scoreboard-label"
          onClick={() => navigate("/teams")}
        >
          ← Teams
        </button>

        <div className="mt-4">
  <div className="scoreboard-label">
    Team
  </div>

  {!editingTeam ? (
    <div
      className="
        mt-1
        flex
        items-center
        justify-between
        gap-3
      "
    >
      <h1 className="scoreboard-title text-3xl">
        {team?.name ?? "Team"}
      </h1>

      <button
        type="button"
        className="text-xs font-bold"
        onClick={() => {
          setEditTeamName(
            team?.name ?? ""
          )
          setEditingTeam(true)
        }}
      >
        Edit
      </button>
    </div>
  ) : (
    <div className="mt-3 space-y-2">
      <input
        className="scoreboard-input w-full"
        value={editTeamName}
        onChange={(e) =>
          setEditTeamName(
            e.target.value
          )
        }
        placeholder="Team name"
        autoFocus
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="scoreboard-button"
          onClick={() =>
            setEditingTeam(false)
          }
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving}
          className="
            scoreboard-button
            scoreboard-button-primary
          "
          onClick={handleSaveTeam}
        >
          {saving
            ? "Saving..."
            : "Save"}
        </button>
      </div>
    </div>
  )}
</div>
      </header>


      {/* ROSTER */}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="scoreboard-title text-xl">
            Roster
          </h2>

          <div className="scoreboard-label">
            {players.length} Players
          </div>
        </div>

        {players.length === 0 ? (
  <div
    className="
      border
      border-scoreboard-cream/30
      p-4
      text-sm
      opacity-60
    "
  >
    No players on this roster yet.
  </div>
) : (
  <div className="space-y-2">
    {players.map((player) => (
      <div
        key={player.id}
        className="
          flex
          items-center
          justify-between
          gap-3
          border
          border-scoreboard-cream/30
          p-3
        "
      >
        <div className="flex min-w-0 items-center gap-3">

          <div className="scoreboard-number min-w-10 text-center text-xl">
            {player.number || "—"}
          </div>

          <div className="min-w-0">
            <div className="truncate font-bold">
              {player.name}
            </div>

            <div className="scoreboard-label mt-1">
              {player.default_position ||
                "No position"}
            </div>
          </div>
        </div>

        {/* These MUST be inside players.map */}
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className="text-xs font-bold"
            onClick={() =>
              handleEditPlayer(player)
            }
          >
            Edit
          </button>

          <button
            type="button"
            className="text-xs font-bold text-red-400"
            onClick={() =>
              handleRemovePlayer(player)
            }
          >
            Remove
          </button>
        </div>
      </div>
    ))}
  </div>
)}

{editingPlayer && (
  <div
    className="
      fixed inset-0 z-50
      flex items-end
      bg-black/70
      sm:items-center
      sm:justify-center
    "
  >
    <div
      className="
        w-full
        space-y-3
        rounded-t-3xl
        bg-green-900
        p-5
        sm:max-w-md
        sm:rounded-3xl
      "
    >
      <h2 className="scoreboard-title text-xl">
        Edit Player
      </h2>

      <input
        className="scoreboard-input w-full"
        value={editPlayer.name}
        onChange={(e) =>
          setEditPlayer((current) => ({
            ...current,
            name: e.target.value,
          }))
        }
        placeholder="Player name"
      />

      <input
        className="scoreboard-input w-full"
        value={editPlayer.number}
        onChange={(e) =>
          setEditPlayer((current) => ({
            ...current,
            number: e.target.value,
          }))
        }
        placeholder="Number"
      />

      <select
        className="scoreboard-input w-full"
        value={editPlayer.position}
        onChange={(e) =>
          setEditPlayer((current) => ({
            ...current,
            position: e.target.value,
          }))
        }
      >
        <option value="">
          Primary Position
        </option>
        <option value="P">P</option>
        <option value="C">C</option>
        <option value="1B">1B</option>
        <option value="2B">2B</option>
        <option value="3B">3B</option>
        <option value="SS">SS</option>
        <option value="LF">LF</option>
        <option value="CF">CF</option>
        <option value="RF">RF</option>
        <option value="IF">IF</option>
        <option value="OF">OF</option>
        <option value="UTIL">UTIL</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <select
          className="scoreboard-input"
          value={editPlayer.bats}
          onChange={(e) =>
            setEditPlayer((current) => ({
              ...current,
              bats: e.target.value,
            }))
          }
        >
          <option value="">Bats</option>
          <option value="R">Right</option>
          <option value="L">Left</option>
          <option value="S">Switch</option>
        </select>

        <select
          className="scoreboard-input"
          value={editPlayer.throws}
          onChange={(e) =>
            setEditPlayer((current) => ({
              ...current,
              throws: e.target.value,
            }))
          }
        >
          <option value="">Throws</option>
          <option value="R">Right</option>
          <option value="L">Left</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="scoreboard-button"
          onClick={() =>
            setEditingPlayer(null)
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="
            scoreboard-button
            scoreboard-button-primary
          "
          onClick={handleSavePlayer}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
      </section>


      {/* ADD PLAYER */}

      <section
        className="
          space-y-3
          border-t
          border-scoreboard-cream/30
          pt-5
        "
      >
        <h2 className="scoreboard-title text-xl">
          Add Player
        </h2>

        <input
          className="scoreboard-input w-full"
          placeholder="Player name"
          value={newPlayer.name}
          onChange={(e) =>
            updateNewPlayer(
              "name",
              e.target.value
            )
          }
        />

        <input
          className="scoreboard-input w-full"
          placeholder="Number"
          value={newPlayer.number}
          onChange={(e) =>
            updateNewPlayer(
              "number",
              e.target.value
            )
          }
        />

        {/* POSITION */}

        <select
          className="scoreboard-input w-full"
          value={newPlayer.position}
          onChange={(e) =>
            updateNewPlayer(
              "position",
              e.target.value
            )
          }
        >
          <option value="">
            Primary Position
          </option>

          <option value="P">P</option>
          <option value="C">C</option>

          <option value="1B">
            1B
          </option>

          <option value="2B">
            2B
          </option>

          <option value="3B">
            3B
          </option>

          <option value="SS">
            SS
          </option>

          <option value="LF">
            LF
          </option>

          <option value="CF">
            CF
          </option>

          <option value="RF">
            RF
          </option>

          <option value="IF">
            IF
          </option>

          <option value="OF">
            OF
          </option>

          <option value="UTIL">
            UTIL
          </option>
        </select>


        {/* BATS / THROWS */}

        <div className="grid grid-cols-2 gap-2">

          <select
            className="scoreboard-input w-full"
            value={newPlayer.bats}
            onChange={(e) =>
              updateNewPlayer(
                "bats",
                e.target.value
              )
            }
          >
            <option value="">
              Bats
            </option>

            <option value="R">
              Right
            </option>

            <option value="L">
              Left
            </option>

            <option value="S">
              Switch
            </option>
          </select>

          <select
            className="scoreboard-input w-full"
            value={newPlayer.throws}
            onChange={(e) =>
              updateNewPlayer(
                "throws",
                e.target.value
              )
            }
          >
            <option value="">
              Throws
            </option>

            <option value="R">
              Right
            </option>

            <option value="L">
              Left
            </option>
          </select>

        </div>


        {/* SAVE */}

        <button
          type="button"
          disabled={saving}
          className="
            scoreboard-button
            scoreboard-button-primary
            w-full
          "
          onClick={handleAddPlayer}
        >
          {saving
            ? "Adding..."
            : "+ Add Player"}
        </button>
      </section>
    </main>
  )
}