/**
 * Runner Engine
 *
 * Responsible for:
 * - Moving existing runners
 * - Moving the batter
 * - Producing the new base state
 * - Recording all runner advances
 * - Counting runs and outs
 *
 * Not responsible for:
 * - RBI
 * - Hits
 * - Walks
 * - At-bats
 * - Errors
 * - Saving to the database
 */

export function resolveRunnerMovement({
    bases,
    batter,
    batterDestination,
    runnerDecisions = {},
  }) {
    const nextBases = {
      first: null,
      second: null,
      third: null,
    }
  
    const runnerAdvances = []
  
    let runsScored = 0
    let outsRecorded = 0
  
    function applyMovement(runner, from, to) {
      if (!runner || !to) {
        return
      }
  
      const normalizedTo = normalizeDestination(to)
  
      const advance = {
        runnerId: runner.id,
        runnerName: runner.name,
        from,
        to: normalizedTo,
        scored: normalizedTo === "home",
        out: normalizedTo === "out",
      }
  
      runnerAdvances.push(advance)
  
      if (normalizedTo === "home") {
        runsScored += 1
        return
      }
  
      if (normalizedTo === "out") {
        outsRecorded += 1
        return
      }
  
      placeRunner(nextBases, normalizedTo, runner)
    }
  
    // Process the lead runner first.
    applyMovement(
      bases?.third,
      "third",
      runnerDecisions.third
    )
  
    applyMovement(
      bases?.second,
      "second",
      runnerDecisions.second
    )
  
    applyMovement(
      bases?.first,
      "first",
      runnerDecisions.first
    )
  
    applyMovement(
      batter,
      "batter",
      batterDestination
    )
  
    return {
      bases: nextBases,
      runnerAdvances,
      runsScored,
      outsRecorded,
    }
  }
  
  function normalizeDestination(destination) {
    const value = String(destination).trim().toLowerCase()
  
    const destinationMap = {
      "1b": "first",
      first: "first",
  
      "2b": "second",
      second: "second",
  
      "3b": "third",
      third: "third",
  
      home: "home",
      scored: "home",
  
      out: "out",
    }
  
    const normalized = destinationMap[value]
  
    if (!normalized) {
      throw new Error(
        `Unsupported runner destination: ${destination}`
      )
    }
  
    return normalized
  }
  
  function placeRunner(bases, destination, runner) {
    if (!["first", "second", "third"].includes(destination)) {
      throw new Error(
        `Cannot place runner at destination: ${destination}`
      )
    }
  
    if (bases[destination]) {
      throw new Error(
        `Base collision: ${destination} is already occupied`
      )
    }
  
    bases[destination] = runner
  }

  const result = resolveRunnerMovement({
    bases: {
      first: null,
      second: null,
      third: null,
    },
  
    batter: {
      id: "1",
      name: "Jake",
    },
  
    batterDestination: "1B",
  
    runnerDecisions: {},
  })
  
  console.log(result)