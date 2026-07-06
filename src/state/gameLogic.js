export function getBattingTeam(state) {
  return state.half === "top" ? state.awayTeam : state.homeTeam
}

export function getCurrentBatter(state) {
  const battingTeam = getBattingTeam(state)
  const lineup = state.lineups[battingTeam] || []
  const index = state.battingIndex[battingTeam] || 0

  return (
    lineup[index % lineup.length] || {
      number: "",
      name: "Unknown batter",
      position: "",
    }
  )
}

export function formatPlayer(player) {
  if (!player) return ""

  return `#${player.number} ${player.name}${
    player.position ? ` (${player.position})` : ""
  }`
}

export function resetCount(state) {
  return {
    ...state,
    balls: 0,
    strikes: 0,
  }
}

export function scoreRun(state, team, runs = 1) {
  return {
    ...state,
    score: {
      ...state.score,
      [team]: state.score[team] + runs,
    },
  }
}

export function advanceBattingOrder(state) {
  const battingTeam = getBattingTeam(state)

  return {
    ...state,
    battingIndex: {
      ...state.battingIndex,
      [battingTeam]: (state.battingIndex[battingTeam] || 0) + 1,
    },
  }
}

export function logEvent(state, event) {
  const eventObject =
    typeof event === "string"
      ? { label: event, event_type: "note" }
      : event

  return {
    ...state,
    events: [
      ...state.events,
      {
        id: crypto.randomUUID(),
        inning: state.inning,
        half: state.half,
        timestamp: new Date().toLocaleTimeString(),
        ...eventObject,
      },
    ],
  }
}

export function applyWalk(state) {
  const battingTeam = getBattingTeam(state)
  const batter = getCurrentBatter(state)
  const bases = { ...state.bases }
  let nextState = resetCount(state)

  if (bases.first) {
    if (bases.second) {
      if (bases.third) {
        nextState = scoreRun(nextState, battingTeam, 1)
      }
      bases.third = bases.second
    }
    bases.second = bases.first
  }

  bases.first = batter

  const next = advanceBattingOrder({
    ...nextState,
    bases,
  })

  return logEvent(next, {
    event_type: "walk",
    label: `Walk - ${formatPlayer(batter)}`,
    player_id: batter.id,
  })
}

export function applyHit(state, label, basesEarned) {
  const battingTeam = getBattingTeam(state)
  const batter = getCurrentBatter(state)
  let nextState = resetCount(state)

  const nextBases = {
    first: null,
    second: null,
    third: null,
  }

  const runnerEntries = [
    ["third", state.bases.third, 3],
    ["second", state.bases.second, 2],
    ["first", state.bases.first, 1],
  ]

  runnerEntries.forEach(([_, runner, startBase]) => {
    if (!runner) return

    const destination = startBase + basesEarned

    if (destination >= 4) {
      nextState = scoreRun(nextState, battingTeam, 1)
    } else if (destination === 3) {
      nextBases.third = runner
    } else if (destination === 2) {
      nextBases.second = runner
    } else {
      nextBases.first = runner
    }
  })

  if (basesEarned === 1) nextBases.first = batter
  if (basesEarned === 2) nextBases.second = batter
  if (basesEarned === 3) nextBases.third = batter

  const next = advanceBattingOrder({
    ...nextState,
    bases: nextBases,
  })

  return logEvent(next, {
    event_type: label.toLowerCase().replace(" ", "_"),
    label: `${label} - ${formatPlayer(batter)}`,
    player_id: batter.id,
  })
}

export function applyHomeRun(state) {
  const battingTeam = getBattingTeam(state)
  const batter = getCurrentBatter(state)
  const runnersOn = [
    state.bases.first,
    state.bases.second,
    state.bases.third,
  ].filter(Boolean).length

  const runs = runnersOn + 1

  const next = advanceBattingOrder({
    ...scoreRun(resetCount(state), battingTeam, runs),
    bases: {
      first: null,
      second: null,
      third: null,
    },
  })

  return logEvent(next, {
    event_type: "home_run",
    label: `Home Run - ${formatPlayer(batter)} (${runs} run${runs > 1 ? "s" : ""})`,
    player_id: batter.id,
    rbi: runs,
  })
}

export function applyOut(state, label) {
  const batter = getCurrentBatter(state)
  const nextOuts = state.outs + 1

  if (nextOuts >= 3) {
    return logEvent(
      advanceBattingOrder({
        ...resetCount(state),
        outs: 0,
        half: state.half === "top" ? "bottom" : "top",
        inning: state.half === "bottom" ? state.inning + 1 : state.inning,
      }),
      `${label} - ${formatPlayer(batter)} - side retired`
    )
  }

  return logEvent(
    advanceBattingOrder({
      ...resetCount(state),
      outs: nextOuts,
    }),
    {
      event_type: label === "Strikeout" ? "strikeout" : "out",
      label: `${label} - ${formatPlayer(batter)}`,
      player_id: batter.id,
      outs_recorded: 1,
    }
  )
}


export function advanceRunner(state, from, to) {
  const runner = state.bases[from]
  if (!runner) return state

  const battingTeam = getBattingTeam(state)
  const nextBases = {
    ...state.bases,
    [from]: null,
  }
  const nextScore = { ...state.score }

  if (to === "home") {
    nextScore[battingTeam] += 1
  } else {
    nextBases[to] = runner
  }

  return logEvent(
    {
      ...state,
      bases: nextBases,
      score: nextScore,
    },
    `${formatPlayer(runner)} advanced to ${to}`
  )
}