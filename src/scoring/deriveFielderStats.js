// src/scoring/deriveFielderStats.js

function createEmptyFielderStats(fielderId) {
    return {
      fielderId,
  
      putouts: 0,
      assists: 0,
      errors: 0,
  
      doublePlays: 0,
      triplePlays: 0,
    };
  }
  
  function incrementStat(statsByFielder, fielderId, statName) {
    if (!fielderId) {
      return;
    }
  
    if (!statsByFielder.has(fielderId)) {
      statsByFielder.set(
        fielderId,
        createEmptyFielderStats(fielderId),
      );
    }
  
    const stats = statsByFielder.get(fielderId);
  
    stats[statName] += 1;
  }
  
  export function deriveFielderStats(metadata = {}) {
    const event = metadata.event ?? {};
    const fielding = event.fielding ?? {};
  
    const putouts = Array.isArray(fielding.putouts)
      ? fielding.putouts
      : [];
  
    const assists = Array.isArray(fielding.assists)
      ? fielding.assists
      : [];
  
    const errors = Array.isArray(fielding.errors)
      ? fielding.errors
      : [];
  
    const statsByFielder = new Map();
  
    for (const fielderId of putouts) {
      incrementStat(
        statsByFielder,
        fielderId,
        "putouts",
      );
    }
  
    for (const fielderId of assists) {
      incrementStat(
        statsByFielder,
        fielderId,
        "assists",
      );
    }
  
    for (const fielderId of errors) {
      incrementStat(
        statsByFielder,
        fielderId,
        "errors",
      );
    }
  
    /*
     * Credit double-play or triple-play participation to every
     * fielder who received a putout or assist on the play.
     *
     * A fielder should receive only one participation credit,
     * even if that fielder recorded both a putout and an assist.
     */
    const participatingFielders = new Set([
      ...putouts,
      ...assists,
    ]);
  
    if (event.doublePlay === true) {
      for (const fielderId of participatingFielders) {
        incrementStat(
          statsByFielder,
          fielderId,
          "doublePlays",
        );
      }
    }
  
    if (event.triplePlay === true) {
      for (const fielderId of participatingFielders) {
        incrementStat(
          statsByFielder,
          fielderId,
          "triplePlays",
        );
      }
    }
  
    return Array.from(statsByFielder.values());
  }