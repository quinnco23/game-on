import { supabase } from "../lib/supabase"

export async function saveEvent(event) {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single()

  if (error) throw error

  return data
}