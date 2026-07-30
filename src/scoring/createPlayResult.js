export function createPlayResult(overrides = {}) {
    return {
      id: crypto.randomUUID(),
      playType: "",
      batterDestination: "out",
      runnerAdvances: [],
      bases: {
        first: null,
        second: null,
        third: null,
      },
      runs: 0,
      outsRecorded: 0,
  
      rbi: 0,
      isHit: false,
      hitValue: 0,
      isError: false,
      isSacrifice: false,
      isFieldersChoice: false,
  
      details: {},
  
      ...overrides,
    }
  }

  export function createPlayResult(overrides = {}) {
    return {
      id: crypto.randomUUID(),
      playType: "",
  
      batterId: null,
      batterDestination: null,
  
      runnerAdvances: [],
  
      outsRecorded: 0,
      runsScored: [],
  
      rbi: 0,
      isHit: false,
      hitValue: 0,
      isError: false,
      isSacrifice: false,
      isFieldersChoice: false,
  
      details: {},
  
      ...overrides,
    };
  }