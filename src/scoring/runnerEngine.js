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
  bases = {},
  batter,
  batterDestination,
  runnerDecisions = {},
  holdExistingRunners = false,
}) {
  const currentBases = {
    first: bases.first ?? null,
    second: bases.second ?? null,
    third: bases.third ?? null,
  };

  /*
   * A strikeout or similar stationary out preserves all existing runners.
   * The batter is still recorded as out.
   */


  const nextBases = {
    first: null,
    second: null,
    third: null,
  };

  let runsScored = 0;
  let outsRecorded = 0;
  const runnerAdvances = [];

  /*
   * Existing runners are processed from third base backward.
   * This avoids base-collision problems while rebuilding the base state.
   */
  const existingRunners = [
    {
      origin: "third",
      runner: currentBases.third,
      destination: runnerDecisions.third,
    },
    {
      origin: "second",
      runner: currentBases.second,
      destination: runnerDecisions.second,
    },
    {
      origin: "first",
      runner: currentBases.first,
      destination: runnerDecisions.first,
    },
  ];

  for (const movement of existingRunners) {
    if (!movement.runner) {
      continue;
    }

    /*
     * No decision means the runner stays on the current base.
     */
    const destination =
      movement.destination == null
        ? movement.origin
        : normalizeDestination(movement.destination);

    const result = resolveDestination({
      runner: movement.runner,
      origin: movement.origin,
      destination,
    });

    runsScored += result.runsScored;
    outsRecorded += result.outsRecorded;

    if (result.baseDestination) {
      placeRunner(
        nextBases,
        result.baseDestination,
        movement.runner,
      );
    }

    if (result.runnerAdvance) {
      runnerAdvances.push(result.runnerAdvance);
    }
  }

  /*
   * Resolve the batter after the existing runners.
   */
  if (batterDestination != null) {
    const normalizedBatterDestination =
      normalizeDestination(batterDestination);

    const batterResult = resolveDestination({
      runner: batter,
      origin: "batter",
      destination: normalizedBatterDestination,
    });

    runsScored += batterResult.runsScored;
    outsRecorded += batterResult.outsRecorded;

    if (batterResult.baseDestination) {
      placeRunner(
        nextBases,
        batterResult.baseDestination,
        batter,
      );
    }

    if (batterResult.runnerAdvance) {
      runnerAdvances.push(batterResult.runnerAdvance);
    }
  }

  return {
    ok: true,
    bases: nextBases,
    runsScored,
    outsRecorded,
    runnerAdvances,
  };
}

function resolveDestination({
  runner,
  origin,
  destination,
}) {
  if (destination == null) {
    return {
      baseDestination: null,
      runsScored: 0,
      outsRecorded: 0,
      runnerAdvance: null,
    };
  }

  const normalizedDestination =
    normalizeDestination(destination);

  if (normalizedDestination === "home") {
    return {
      baseDestination: null,
      runsScored: 1,
      outsRecorded: 0,
      runnerAdvance: {
        runner,
        from: origin,
        to: "home",
        result: "scored",
      },
    };
  }

  if (normalizedDestination === "out") {
    return {
      baseDestination: null,
      runsScored: 0,
      outsRecorded: 1,
      runnerAdvance: {
        runner,
        from: origin,
        to: "out",
        result: "out",
      },
    };
  }

  return {
    baseDestination: normalizedDestination,
    runsScored: 0,
    outsRecorded: 0,
    runnerAdvance: {
      runner,
      from: origin,
      to: normalizedDestination,
      result:
        origin === normalizedDestination
          ? "held"
          : "advanced",
    },
  };
}

function normalizeDestination(destination) {
  const value = String(destination)
    .trim()
    .toLowerCase();

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
  };

  const normalized = destinationMap[value];

  if (!normalized) {
    throw new Error(
      `Unsupported runner destination: ${destination}`,
    );
  }

  return normalized;
}

function placeRunner(bases, destination, runner) {
  if (!["first", "second", "third"].includes(destination)) {
    throw new Error(
      `Cannot place runner at destination: ${destination}`,
    );
  }

  if (bases[destination]) {
    throw new Error(
      `Base collision: ${destination} is already occupied`,
    );
  }

  bases[destination] = runner;
}