export function createPlayEvent({
    id,
    playType,
    batter,
    metadata = {},
    runnerDecisions = {},
    timestamp = new Date().toISOString(),
    source = "manual",
  }) {
    if (!playType) {
      throw new Error("A playType is required.");
    }
  
    return {
      id: id ?? crypto.randomUUID(),
  
      playType,
  
      batter: batter ?? null,
  
      runnerDecisions,
  
      metadata,
  
      timestamp,
  
      source,
    };
  }