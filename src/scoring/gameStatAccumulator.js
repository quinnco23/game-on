function addStatDelta(current = {}, delta = {}) {
    const next = {
      ...current,
    };
  
    for (const [statName, value] of Object.entries(delta)) {
      if (typeof value !== "number") {
        continue;
      }
  
      next[statName] = (next[statName] ?? 0) + value;
    }
  
    return next;
  }
  
  export function createEmptyGameStats() {
    return {
      batters: {},
      pitchers: {},
      fielders: {},
    };
  }
  
  export function accumulateGameStats(
    currentStats,
    {
      batterId,
      pitcherId,
      batterStats,
      pitcherStats,
      fielderStats = [],
    } = {},
  ) {
    const existingStats =
      currentStats ?? createEmptyGameStats();
  
    const nextStats = {
      batters: {
        ...(existingStats.batters ?? {}),
      },
  
      pitchers: {
        ...(existingStats.pitchers ?? {}),
      },
  
      fielders: {
        ...(existingStats.fielders ?? {}),
      },
    };
  
    if (batterId && batterStats) {
      nextStats.batters[batterId] = addStatDelta(
        nextStats.batters[batterId],
        batterStats,
      );
    }
  
    if (pitcherId && pitcherStats) {
      nextStats.pitchers[pitcherId] = addStatDelta(
        nextStats.pitchers[pitcherId],
        pitcherStats,
      );
    }
  
    for (const fielderStat of fielderStats) {
      const fielderId = fielderStat?.fielderId;
  
      if (!fielderId) {
        continue;
      }
  
      nextStats.fielders[fielderId] = addStatDelta(
        nextStats.fielders[fielderId],
        fielderStat,
      );
    }
  
    return nextStats;
  }