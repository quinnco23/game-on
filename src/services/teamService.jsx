import { supabase } from "../lib/supabase"

export async function getTeams() {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("active", true)
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

export async function deactivateTeam(teamId) {
  const { data, error } = await supabase
    .from("teams")
    .update({
      active: false,
    })
    .eq("id", teamId)
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

export async function updateTeam(
  teamId,
  updates
) {
  const { data, error } = await supabase
    .from("teams")
    .update(updates)
    .eq("id", teamId)
    .select()
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