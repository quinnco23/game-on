export function deriveBatterStats(metadata = {}) {
    const playType = metadata.playType;
    const playDefinition = metadata.playDefinition ?? {};
    const event = metadata.event ?? {};
  
    const runsScored = metadata.runsScored ?? 0;
    const rbiCount = metadata.rbiCount ?? 0;
  
    const isHit = playDefinition.isHit === true;
    const isAtBat = playDefinition.isAtBat === true;
  
    const hitValueMap = {
      single: 1,
      double: 2,
      triple: 3,
      homeRun: 4,
    };
  
    const totalBases = isHit
      ? hitValueMap[playType] ?? 0
      : 0;
  
    return {
      plateAppearances: 1,
      atBats: isAtBat ? 1 : 0,
  
      hits: isHit ? 1 : 0,
      singles: playType === "single" ? 1 : 0,
      doubles: playType === "double" ? 1 : 0,
      triples: playType === "triple" ? 1 : 0,
      homeRuns: playType === "homeRun" ? 1 : 0,
  
      walks: playType === "walk" ? 1 : 0,
      strikeouts: playType === "strikeout" ? 1 : 0,
  
      runs: event.batterScored === true ? 1 : 0,
      rbi: rbiCount,
  
      totalBases,
  
      reachedOnError:
        playType === "reachedOnError"
          ? 1
          : 0,
  
      fieldersChoices:
        playType === "fielderChoice"
          ? 1
          : 0,
  
      groundedIntoDoublePlay:
        playType === "groundOut" &&
        event.doublePlay === true
          ? 1
          : 0,
  
      runsProduced: runsScored,
    };
  }