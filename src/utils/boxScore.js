function countRunsForPlayer(events, playerId) {
  let runs = 0

  for (const event of events) {
    const details = event.details || {}

    // Existing baserunners who scored
    const runnerAdvances = details.runnerAdvances || []

    for (const advance of runnerAdvances) {
      if (
        advance.runnerId === playerId &&
        (advance.to === "home" || advance.scored === true)
      ) {
        runs += 1
      }
    }

    // Batter scored on a home run or another play
    if (
      event.player_id === playerId &&
      details.batterDestination === "home"
    ) {
      runs += 1
    }
  }

  return runs
}

export function buildBoxScore(events = [], lineup = []) {
  return lineup.map((player) => {
    const playerEvents = events.filter(
      (event) =>
        event.player_id === player.id ||
        event.playerId === player.id
    )

    const eventType = (event) =>
      event.event_type || event.type

    const hits = playerEvents.filter((event) =>
      ["single", "double", "triple", "home_run"].includes(
        eventType(event)
      )
    ).length

    const doubles = playerEvents.filter(
      (event) => eventType(event) === "double"
    ).length

    const triples = playerEvents.filter(
      (event) => eventType(event) === "triple"
    ).length

    const homeRuns = playerEvents.filter(
      (event) => eventType(event) === "home_run"
    ).length

    const walks = playerEvents.filter(
      (event) => eventType(event) === "walk"
    ).length

    const strikeouts = playerEvents.filter(
      (event) => eventType(event) === "strikeout"
    ).length

    const errorsReached = playerEvents.filter(
      (event) => eventType(event) === "error"
    ).length

    const fieldersChoices = playerEvents.filter(
      (event) => eventType(event) === "fielders_choice"
    ).length

    const sacrifices = playerEvents.filter(
      (event) =>
        event.details?.sacrifice === true
    ).length

    const atBats = playerEvents.filter((event) => {
      const type = eventType(event)
      const sacrifice = event.details?.sacrifice === true

      if (sacrifice) return false

      return [
        "single",
        "double",
        "triple",
        "home_run",
        "out",
        "groundout",
        "flyout",
        "lineout",
        "popout",
        "strikeout",
        "error",
        "fielders_choice",
      ].includes(type)
    }).length

    const runs = countRunsForPlayer(events, player.id)

    const rbi = playerEvents.reduce(
      (sum, event) => sum + Number(event.rbi || 0),
      0
    )

    const totalBases =
      hits +
      doubles +
      triples * 2 +
      homeRuns * 3

    const plateAppearances =
      atBats + walks + sacrifices

    return {
      id: player.id,
      number: player.number,
      name: player.name,
      position: player.position,

      PA: plateAppearances,
      AB: atBats,
      R: runs,
      H: hits,
      "2B": doubles,
      "3B": triples,
      HR: homeRuns,
      RBI: rbi,
      BB: walks,
      SO: strikeouts,
      ROE: errorsReached,
      FC: fieldersChoices,
      SAC: sacrifices,
      TB: totalBases,

      AVG:
        atBats > 0
          ? (hits / atBats).toFixed(3)
          : ".000",
    }
  })
}