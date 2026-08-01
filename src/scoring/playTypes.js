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
        category: "error",
        resultType: "reachedOnError",
        isAtBat: true,
        isError: true,
        isHit: false,
        rbiEligible: false,
      },
    },

    
  };

  export function getPlayDefinition(playType) {
    return playTypes[playType];
  }