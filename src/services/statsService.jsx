import { getPublicGames } from "./gamesService"

export async function getLeagueStats() {
  const games = await getPublicGames()

  const batterTotals = {}
  const pitcherTotals = {}

  for (const gameRecord of games) {
    if (gameRecord.status !== "final") {
      continue
    }

    const state =
      gameRecord.state ??
      gameRecord.game_state ??
      {}

    const lineups =
      state.lineups ?? {}

    const rosters =
      state.gameRoster ?? {}

    const batterStats =
      state.stats?.batters ?? {}

    const pitcherStats =
      state.stats?.pitchers ?? {}

    const allPlayers = [
      ...Object.values(lineups).flat(),
      ...Object.values(rosters).flat(),
    ]

    const playerMap = new Map()

    for (const player of allPlayers) {
      if (player?.id) {
        playerMap.set(player.id, player)
      }
    }

    for (const [playerId, stats] of Object.entries(
      batterStats
    )) {
      const player =
        playerMap.get(playerId)

      if (!player) continue

      if (!batterTotals[playerId]) {
        batterTotals[playerId] = {
          player,
          plateAppearances: 0,
          atBats: 0,
          runs: 0,
          hits: 0,
          doubles: 0,
          triples: 0,
          homeRuns: 0,
          rbi: 0,
          walks: 0,
          strikeouts: 0,
        }
      }

      const total =
        batterTotals[playerId]

      total.plateAppearances +=
        stats.plateAppearances ?? 0

      total.atBats +=
        stats.atBats ?? 0

      total.runs +=
        stats.runs ?? 0

      total.hits +=
        stats.hits ?? 0

      total.doubles +=
        stats.doubles ?? 0

      total.triples +=
        stats.triples ?? 0

      total.homeRuns +=
        stats.homeRuns ?? 0

      total.rbi +=
        stats.rbi ?? 0

      total.walks +=
        stats.walks ?? 0

      total.strikeouts +=
        stats.strikeouts ?? 0
    }

    for (const [playerId, stats] of Object.entries(
      pitcherStats
    )) {
      const player =
        playerMap.get(playerId)

      if (!player) continue

      if (!pitcherTotals[playerId]) {
        pitcherTotals[playerId] = {
          player,
          battersFaced: 0,
          outsRecorded: 0,
          hitsAllowed: 0,
          runsAllowed: 0,
          earnedRuns: 0,
          walksAllowed: 0,
          strikeouts: 0,
          pitches: 0,
          strikes: 0,
          balls: 0,
        }
      }

      const total =
        pitcherTotals[playerId]

      total.battersFaced +=
        stats.battersFaced ?? 0

      total.outsRecorded +=
        stats.outsRecorded ?? 0

      total.hitsAllowed +=
        stats.hitsAllowed ?? 0

      total.runsAllowed +=
        stats.runsAllowed ?? 0

      total.earnedRuns +=
        stats.earnedRuns ?? 0

      total.walksAllowed +=
        stats.walksAllowed ?? 0

      total.strikeouts +=
        stats.strikeouts ?? 0

      total.pitches +=
        stats.pitches ?? 0

      total.strikes +=
        stats.strikes ?? 0

      total.balls +=
        stats.balls ?? 0
    }
  }

  return {
    batters: Object.values(batterTotals),
    pitchers: Object.values(pitcherTotals),
  }
}