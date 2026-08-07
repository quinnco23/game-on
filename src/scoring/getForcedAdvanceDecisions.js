export function getForcedAdvanceDecisions(
    bases = {},
  ) {
    const decisions = {};
  
    if (bases.first) {
      decisions.first = "second";
    }
  
    if (bases.second) {
      decisions.second =
        bases.first ? "third" : "second";
    }
  
    if (bases.third) {
      decisions.third =
        bases.first && bases.second
          ? "home"
          : "third";
    }
  
    return decisions;
  }