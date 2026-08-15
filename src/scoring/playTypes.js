export const playTypes = {
    single: {
      batterDestination: "first",
  
      metadata: {
        category: "hit",
        resultType: "single",
        isAtBat: true,
        isHit: true,
        rbiEligible: true,
      },
    },
  
    double: {
      batterDestination: "second",
  
      metadata: {
        category: "hit",
        resultType: "double",
        isAtBat: true,
        isHit: true,
        rbiEligible: true,
      },
    },
  
    triple: {
      batterDestination: "third",
  
      metadata: {
        category: "hit",
        resultType: "triple",
        isAtBat: true,
        isHit: true,
        rbiEligible: true,
      },
    },
  
    homeRun: {
      batterDestination: "home",
  
      metadata: {
        category: "hit",
        resultType: "homeRun",
        isAtBat: true,
        isHit: true,
        rbiEligible: true,
      },
    },
  
    walk: {
      batterDestination: "first",
  
      metadata: {
        category: "plateAppearance",
        resultType: "walk",
        isAtBat: false,
        isHit: false,
        rbiEligible: true,
      },
    },
  
    strikeout: {
      batterDestination: "out",
      holdExistingRunners: true,
  
      metadata: {
        category: "out",
        resultType: "strikeout",
        outType: "strikeout",
        isAtBat: true,
        isHit: false,
        rbiEligible: false,
      },
    },
  
    groundOut: {
      batterDestination: "out",
      holdExistingRunners: true,
  
      metadata: {
        category: "out",
        resultType: "groundOut",
        outType: "groundOut",
        battedBallType: "groundBall",
        isAtBat: true,
        isHit: false,
        rbiEligible: true,
      },
    },
  
    flyOut: {
      batterDestination: "out",
      holdExistingRunners: true,
  
      metadata: {
        category: "out",
        resultType: "flyOut",
        outType: "flyOut",
        battedBallType: "flyBall",
        isAtBat: true,
        isHit: false,
        rbiEligible: false,
      },
    },
  
    fielderChoice: {
      batterDestination: "first",
  
      metadata: {
        category: "out",
        resultType: "fielderChoice",
        isAtBat: true,
        isHit: false,
        rbiEligible: false,
      },
    },
  
    reachedOnError: {
      batterDestination: "first",
    
      metadata: {
        category: "plateAppearance",
        resultType: "reachedOnError",
    
        isPlateAppearance: true,
        endsPlateAppearance: true,
        isAtBat: true,
        isHit: false,
    
        isError: true,
        rbiEligible: false,
      },
    },

    stolenBase: {
      batterDestination: null,
      holdExistingRunners: true,
    
      metadata: {
        category: "runnerEvent",
        resultType: "stolenBase",
    
        isPlateAppearance: false,
        endsPlateAppearance: false,
    
        isAtBat: false,
        isHit: false,
        rbiEligible: false,
      },
    },

    passedBall: {
      batterDestination: null,
      holdExistingRunners: true,
    
      metadata: {
        category: "runnerEvent",
        resultType: "passedBall",
        isPlateAppearance: false,
        endsPlateAppearance: false,
        isAtBat: false,
        isHit: false,
        rbiEligible: false,
      },
    },
    wildPitch: {
      batterDestination: null,
      holdExistingRunners: true,
    
      metadata: {
        category: "runnerEvent",
        resultType: "wildPitch",
        isPlateAppearance: false,
        endsPlateAppearance: false,
        isAtBat: false,
        isHit: false,
        rbiEligible: false,
      },
    },

    hitByPitch: {
      batterDestination: "first",
    
      metadata: {
        category: "plateAppearance",
        resultType: "hitByPitch",
        isPlateAppearance: true,
        endsPlateAppearance: true,
        isAtBat: false,
        isHit: false,
        rbiEligible: true,
      },
    },

    caughtStealing: {
      batterDestination: null,
      holdExistingRunners: true,
    
      metadata: {
        category: "runnerEvent",
        resultType: "caughtStealing",
        isPlateAppearance: false,
        endsPlateAppearance: false,
        isAtBat: false,
        isHit: false,
        rbiEligible: false,
      },
    },

    fielderChoice: {
      batterDestination: "first",
    
      metadata: {
        category: "plateAppearance",
        resultType: "fielderChoice",
        isPlateAppearance: true,
        endsPlateAppearance: true,
        isAtBat: true,
        isHit: false,
        rbiEligible: false,
      },
    },

    pickoff: {
      batterDestination: null,
    
      metadata: {
        category: "runnerEvent",
        resultType: "pickoff",
    
        isPlateAppearance: false,
        endsPlateAppearance: false,
        isAtBat: false,
        isHit: false,
      },
    },

    
    
  };

  
  

  export function getPlayDefinition(playType) {
    return playTypes[playType];
  }