import { supabase } from "../lib/supabase"

export async function findOrCreateTeam(name) {
  const cleanName = name.trim()

  const { data: existingTeams, error: findError } = await supabase
    .from("teams")
    .select("*")
    .ilike("name", cleanName)
    .limit(1)

  if (findError) throw findError

  if (existingTeams.length > 0) {
    return existingTeams[0]
  }

  const { data: newTeam, error: createError } = await supabase
    .from("teams")
    .insert({ name: cleanName })
    .select()
    .single()

  if (createError) throw createError

  return newTeam
}