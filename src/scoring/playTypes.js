// src/scoring/playTypes.js

// src/scoring/playTypes.js

export const PLAY_TYPES = {
    single: {
      batterDestination: "first",
      holdExistingRunners: false,
    },
  
    double: {
      batterDestination: "second",
      holdExistingRunners: false,
    },
  
    triple: {
      batterDestination: "third",
      holdExistingRunners: false,
    },
  
    homeRun: {
      batterDestination: "home",
      holdExistingRunners: false,
    },
  
    walk: {
      batterDestination: "first",
      holdExistingRunners: false,
    },
  
    strikeout: {
      batterDestination: "out",
      holdExistingRunners: true,
    },
  };
  
  export function getPlayDefinition(playType) {
    return PLAY_TYPES[playType] ?? null;
  }