import { supabase } from "../lib/supabase"

export async function getTeams() {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("name")

  if (error) throw error

  return data ?? []
}

export async function createTeam(name) {
  const cleanName = name.trim()

  const { data, error } = await supabase
    .from("teams")
    .insert({
      name: cleanName,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getTeam(teamId) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single()

  if (error) throw error

  return data
}

export async function findOrCreateTeam(name) {
  const cleanName = name.trim()

  const { data: existingTeam, error: findError } =
    await supabase
      .from("teams")
      .select("*")
      .eq("name", cleanName)
      .maybeSingle()

  if (findError) throw findError

  if (existingTeam) {
    return existingTeam
  }

  return createTeam(cleanName)
}