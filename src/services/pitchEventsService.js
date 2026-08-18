import { supabase } from "../lib/supabase"

export async function savePitchEvent({
  id,
  gameId,
  pitcherId,
  batterId,
  sequence,
  inning,
  half,
  ballsBefore,
  strikesBefore,
  outsBefore,
  result,
  source = "manual",

  plateX = null,
  plateZ = null,
  velocityMph = null,
  confidence = null,
  modelVersion = null,
}) {
  const { data, error } = await supabase
    .from("pitch_events")
    .insert({
      id,

      game_id: gameId,

      pitcher_id: pitcherId,
      batter_id: batterId,

      sequence,

      inning,
      half,

      balls_before: ballsBefore,
      strikes_before: strikesBefore,
      outs_before: outsBefore,

      result,
      source,

      plate_x: plateX,
      plate_z: plateZ,
      velocity_mph: velocityMph,
      confidence,

      model_version: modelVersion,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getGamePitchEvents(
  gameId
) {
  const { data, error } = await supabase
    .from("pitch_events")
    .select("*")
    .eq("game_id", gameId)
    .order("sequence", {
      ascending: true,
    })

  if (error) throw error

  return data ?? []
}