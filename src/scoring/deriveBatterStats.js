export function deriveBatterStats(metadata = {}) {
    const playType = metadata.playType;
    const playDefinition = metadata.playDefinition ?? {};
    const event = metadata.event ?? {};
    const runsScored = metadata.runsScored ?? 0;
    const rbiCount = metadata.rbiCount ?? 0;
    const isHit = playDefinition.isHit === true;
   

    const isSacrificeFly =
  playType === "flyOut" &&
  event.sacrificeFly === true

  const isSacrificeBunt =
  playType === "groundOut" &&
  event.sacrificeBunt === true
  const isAtBat = playDefinition.isAtBat === true &&
  !isSacrificeFly &&
  !isSacrificeBunt;
    
    const hitValueMap = {
      single: 1,
      double: 2,
      triple: 3,
      homeRun: 4,
    };
  
    const totalBases = isHit
      ? hitValueMap[playType] ?? 0
      : 0;

      const isPlateAppearance =
  playDefinition.isPlateAppearance !== false &&
  playDefinition.endsPlateAppearance !== false;
  
    return {
      plateAppearances:
  isPlateAppearance ? 1 : 0,

atBats:
  isAtBat ? 1 : 0,

hits:
  isHit ? 1 : 0,

singles:
  playType === "single" ? 1 : 0,

doubles:
  playType === "double" ? 1 : 0,

triples:
  playType === "triple" ? 1 : 0,

homeRuns:
  playType === "homeRun" ? 1 : 0,

walks:
  playType === "walk" ? 1 : 0,

hitByPitch:
  playType === "hitByPitch" ? 1 : 0,

strikeouts:
  playType === "strikeout" ? 1 : 0,

runs:
  event.batterScored === true ? 1 : 0,

rbi:
  rbiCount,

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

runsProduced:
  runsScored,

  sacrificeFlies:
  isSacrificeFly
? 1
    : 0,

    sacrificeHits:
  isSacrificeBunt ? 1 : 0,
    };
  }