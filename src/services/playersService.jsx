import { supabase } from "../lib/supabase"



export async function saveLineup({
  gameId,
  teamId,
  lineup,
}) {
  const savedPlayers = []

  for (let index = 0; index < lineup.length; index++) {
    const player = lineup[index]

    if (!player.name?.trim()) continue

    const savedPlayer = await findOrCreatePlayer({
      teamId,
      name: player.name,
      number: player.number,
      position: player.position,
    })

    const { error: gamePlayerError } = await supabase
      .from("game_players")
      .insert({
        game_id: gameId,
        team_id: teamId,
        player_id: savedPlayer.id,
        batting_order: index + 1,
        position: player.position,
        is_starter: true,
      })

    if (gamePlayerError) throw gamePlayerError

    savedPlayers.push({
      id: savedPlayer.id,
      number: savedPlayer.number,
      name: savedPlayer.name,
      position: player.position,
      battingOrder: index + 1,
    })
  }

  return savedPlayers
}
export async function loadGameLineup({ gameId, teamId }) {
  const { data, error } = await supabase
    .from("game_players")
    .select(`
      id,
      batting_order,
      position,
      players (
        id,
        name,
        number,
        default_position
      )
    `)
    .eq("game_id", gameId)
    .eq("team_id", teamId)
    .order("batting_order", { ascending: true })

  if (error) throw error

  return data.map((row) => ({
    id: row.players.id,
    number: row.players.number,
    name: row.players.name,
    position: row.position || row.players.default_position,
    battingOrder: row.batting_order,
  }))
}

export async function findOrCreatePlayer({
  teamId,
  name,
  number,
  position,
}) {
  const cleanName = name.trim()
  const cleanNumber =
    String(number || "").trim()

  const { data: existingPlayers, error: findError } =
    await supabase
      .from("players")
      .select("*")
      .eq("team_id", teamId)
      .eq("number", cleanNumber)
      .ilike("name", cleanName)
      .limit(1)

  if (findError) throw findError

  if (existingPlayers.length > 0) {
    return existingPlayers[0]
  }

  return createPlayer({
    teamId,
    name: cleanName,
    number: cleanNumber,
    position,
  })
}



export async function getTeamPlayers(teamId) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .eq("active", true)
    .order("number", { ascending: true })

  if (error) throw error

  return data ?? []
}

export async function createPlayer({
  teamId,
  name,
  number = "",
  position = "",
  bats = "",
  throws = "",
}) {
  const { data, error } = await supabase
    .from("players")
    .insert({
      team_id: teamId,
      name: name.trim(),
      number: String(number || "").trim(),
      default_position:
        position?.trim().toUpperCase() || null,
      bats: bats || null,
      throws: throws || null,
      active: true,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updatePlayer(playerId, updates) {
  const payload = {}

  if (updates.name !== undefined) {
    payload.name = updates.name.trim()
  }

  if (updates.number !== undefined) {
    payload.number =
      String(updates.number || "").trim()
  }

  if (updates.position !== undefined) {
    payload.default_position =
      updates.position || null
  }

  if (updates.bats !== undefined) {
    payload.bats =
      updates.bats || null
  }

  if (updates.throws !== undefined) {
    payload.throws =
      updates.throws || null
  }

  const { data, error } = await supabase
    .from("players")
    .update(payload)
    .eq("id", playerId)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deactivatePlayer(playerId) {
  const { data, error } = await supabase
    .from("players")
    .update({
      active: false,
    })
    .eq("id", playerId)
    .select()
    .single()

  if (error) throw error

  return data
}