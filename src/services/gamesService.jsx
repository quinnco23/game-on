import { supabase } from "../lib/supabase"

export async function getActiveGame() {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "scoring")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getFinishedGames() {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "final")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function finishGame(gameId, state) {
  const { data, error } = await supabase
    .from("games")
    .update({
      status: "final",
      state,
    })
    .eq("id", gameId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGameState(gameId, state) {
  const { data, error } = await supabase
    .from("games")
    .update({ state })
    .eq("id", gameId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getLatestGame() {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function createGame({
  homeTeamId,
  awayTeamId,
  state,
}) {
  const { data, error } = await supabase
    .from("games")
    .insert({
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      status: "scoring",
      state,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getPublicGames() {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .in("status", ["scoring", "final"])
    .order("created_at", { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function getGameById(gameId) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single()

  if (error) throw error

  return data
}