export const PLAY_TYPES = {
    single: {
      batterDestination: "first",
      metadata: {
        category: "hit",
        battedBallType: null,
        hitValue: 1,
      },
    },
  
    double: {
      batterDestination: "second",
      metadata: {
        category: "hit",
        battedBallType: null,
        hitValue: 2,
      },
    },
  
    triple: {
      batterDestination: "third",
      metadata: {
        category: "hit",
        battedBallType: null,
        hitValue: 3,
      },
    },
  
    homeRun: {
      batterDestination: "home",
      metadata: {
        category: "hit",
        battedBallType: "flyBall",
        hitValue: 4,
      },
    },
  
    walk: {
      batterDestination: "first",
      metadata: {
        category: "plateAppearance",
        isAtBat: false,
      },
    },
  
    strikeout: {
      batterDestination: "out",
      holdExistingRunners: true,
      metadata: {
        category: "out",
        outType: "strikeout",
        isAtBat: true,
      },
    },
  
    flyOut: {
      batterDestination: "out",
      holdExistingRunners: true,
      metadata: {
        category: "out",
        outType: "flyOut",
        battedBallType: "flyBall",
        isAtBat: true,
      },
    },
  
    groundOut: {
      batterDestination: "out",
      holdExistingRunners: true,
      metadata: {
        category: "out",
        outType: "groundOut",
        battedBallType: "groundBall",
        isAtBat: true,
      },
    },
  };
  
  export function getPlayDefinition(playType) {
    return PLAY_TYPES[playType] ?? null;
  }