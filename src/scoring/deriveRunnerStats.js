export function deriveRunnerStats(metadata = {}) {
  const runnerAdvances =
    metadata.runnerAdvances ?? [];

  const playType = metadata.playType;

  const statsByRunner = new Map();

  function getStats(runnerId) {
    if (!statsByRunner.has(runnerId)) {
      statsByRunner.set(runnerId, {
        runnerId,
        runs: 0,
        stolenBases: 0,
        caughtStealing: 0,
      });
    }

    return statsByRunner.get(runnerId);
  }

  for (const advance of runnerAdvances) {
    const runnerId =
      advance.runnerId ??
      advance.runner?.id;

    if (!runnerId) {
      continue;
    }

    const destination =
      advance.to ??
      advance.destination;

    const runnerStats =
      getStats(runnerId);

    const scored =
      advance.scored === true ||
      advance.result === "scored" ||
      destination === "home";

    const retired =
      advance.out === true ||
      advance.result === "out" ||
      destination === "out";

    if (scored) {
      runnerStats.runs += 1;
    }

    if (
      playType === "stolenBase" &&
      !retired
    ) {
      runnerStats.stolenBases += 1;
    }

    if (
      playType === "caughtStealing" &&
      retired
    ) {
      runnerStats.caughtStealing += 1;
    }
  }

  return Array.from(statsByRunner.values())
    .filter(
      (stats) =>
        stats.runs > 0 ||
        stats.stolenBases > 0 ||
        stats.caughtStealing > 0,
    );
}