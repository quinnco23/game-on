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
  console.log("SAVE PITCH START:", {
    operation: "savePitchEvent",
    gameId,
    pitchId: id,
    sequence,
    inning,
    half,
    result,
    pitcherId,
    batterId,
    online: navigator.onLine,
  })

  try {
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

    if (error) {
      throw error
    }

    console.log("SAVE PITCH OK:", {
      gameId,
      pitchId: id,
      sequence,
      result,
    })

    return data
  } catch (error) {
    console.error("SAVE PITCH FAILED:", {
      operation: "savePitchEvent",

      gameId,
      pitchId: id,

      sequence,
      inning,
      half,
      result,

      online: navigator.onLine,

      errorName:
        error?.name,

      errorMessage:
        error?.message,

      error,
    })

    throw error
  }
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

  if (error) {
    console.error(
      "Could not load pitch events:",
      error
    )

    throw error
  }

  return data ?? []
}