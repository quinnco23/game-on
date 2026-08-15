// src/scoring/derivePitcherStats.js

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

export function derivePitcherStats(metadata = {}) {
    const playType = metadata.playType;
    const playDefinition = metadata.playDefinition ?? {};
    const event = metadata.event ?? {};
  
    const outsRecorded = metadata.outsRecorded ?? 0;
    const runsScored = metadata.runsScored ?? 0;
  
    const isHit = playDefinition.isHit === true;
    const isError = playDefinition.isError === true;
  
    /*
     * At the current engine stage, every completed play passed here
     * represents one completed batter appearance.
     */
    const isRunnerEvent =
  playType === "pickoff" ||
  playType === "stolenBase" ||
  playType === "caughtStealing" ||
  playType === "passedBall" ||
  playType === "wildPitch";

const battersFaced =
  isRunnerEvent ? 0 : 1;
  
    /*
     * Runs are initially charged to the active pitcher.
     *
     * Later, when pitching changes and inherited runners are supported,
     * runs should be assigned according to each runner's responsiblePitcherId.
     */
    const runsAllowed = runsScored;
  
    /*
     * Earned-run determination eventually requires reconstructing the
     * inning without errors. Until that system exists, callers may provide
     * an explicit earnedRuns value.
     *
     * Otherwise:
     * - runs on an error are treated as unearned
     * - other runs are provisionally treated as earned
     */
    const earnedRuns =
      Number.isInteger(event.earnedRuns)
        ? event.earnedRuns
        : isError
          ? 0
          : runsAllowed;
          const isPickoff =
          playType === "pickoff";
        
        const isSuccessfulPickoff =
          isPickoff &&
          event.runnerOut === true;


    return {
      battersFaced,
  
      // Store innings pitched as actual outs.
      outsRecorded,
      pickoffAttempts:
  isPickoff ? 1 : 0,

pickoffs:
  isSuccessfulPickoff ? 1 : 0,
  
      hitsAllowed: isHit ? 1 : 0,
  
      singlesAllowed: playType === "single" ? 1 : 0,
      doublesAllowed: playType === "double" ? 1 : 0,
      triplesAllowed: playType === "triple" ? 1 : 0,
      homeRunsAllowed: playType === "homeRun" ? 1 : 0,
  
      walksAllowed: playType === "walk" ? 1 : 0,
      strikeouts: playType === "strikeout" ? 1 : 0,
  
      runsAllowed,
      earnedRuns,


    };
  }