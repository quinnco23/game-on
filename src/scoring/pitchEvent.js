// src/scoring/pitchEvent.js

export function createPitchEvent({
    pitcherId,
    batterId,
    result,
    inning,
    half,
  }) {
    return {
      id: crypto.randomUUID(),
      type: "pitch",
  
      pitcherId,
      batterId,
  
      result,
  
      inning,
      half,
  
      timestamp: Date.now(),
    }
  }

  export function derivePitchCountStats(result) {
    const strikeResults = new Set([
      "calledStrike",
      "swingingStrike",
      "foul",
      "inPlay",
    ])
  
    return {
      pitches: 1,
      strikes:
        strikeResults.has(result)
          ? 1
          : 0,
      balls:
        result === "ball"
          ? 1
          : 0,
    }
  }

  export const PITCH_RESULTS = {
    BALL: "ball",
    CALLED_STRIKE: "calledStrike",
    SWINGING_STRIKE: "swingingStrike",
    FOUL: "foul",
    IN_PLAY: "inPlay",
  }