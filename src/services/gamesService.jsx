import { supabase } from "../lib/supabase"

export async function createGame({ homeTeamId, awayTeamId }) {
  const { data, error } = await supabase
    .from("games")
    .insert({
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      status: "scoring",
    })
    .select()
    .single()

  if (error) throw error

  return data
}