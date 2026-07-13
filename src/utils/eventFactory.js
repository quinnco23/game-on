export function createEventDetails(overrides = {}) {
    return {
      playType: null,
  
      battedBallType: null,
  
      result: null,
  
      fieldedByPosition: null,
  
      putoutPosition: null,
  
      assists: [],
  
      notation: null,
  
      reachedOnError: false,
  
      errorPosition: null,
  
      sacrifice: false,
  
      runnerAdvances: [],
  
      batterDestination: null,
  
      ...overrides,
    }
  }