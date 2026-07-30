export function createGameState(overrides = {}) {
    const defaultState = {
      id: crypto.randomUUID(),
  
      status: "setup",
  
      version: 0,
  
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
  
      inning: 1,
      half: "top",
  
      outs: 0,
      balls: 0,
      strikes: 0,
  
      score: {
        home: 0,
        away: 0,
      },
  
      bases: {
        first: null,
        second: null,
        third: null,
      },
  
      homeTeam: {
        id: null,
        name: "",
        lineup: [],
      },
  
      awayTeam: {
        id: null,
        name: "",
        lineup: [],
      },
  
      batting: {
        offense: "away",
        homeIndex: 0,
        awayIndex: 0,
      },
  
      isGameOver: false,
    };
  
    return {
      ...defaultState,
      ...overrides,
    };
  }