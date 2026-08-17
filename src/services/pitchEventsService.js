import { supabase } from "../lib/supabase"

export async function savePitchEvent({
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

  absCall = null,
  scorerCall = null,
  finalCall = null,

  modelVersion = null,
  calibrationId = null,
}) {
  const { data, error } = await supabase
    .from("pitch_events")
    .insert({
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

      abs_call: absCall,
      scorer_call: scorerCall,
      final_call: finalCall,

      model_version: modelVersion,
      calibration_id: calibrationId,
    })
    .select()
    .single()

  if (error) throw error

  return data
}