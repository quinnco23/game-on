import { supabase } from "../lib/supabase"

export async function getStandings() {
  const { data: games, error } =
    await supabase
      .from("games")
      .select("*")
      .eq("status", "final")

  if (error) throw error

  return buildStandings(games ?? [])
}

function buildStandings(games) {
  const teams = new Map()

  function getTeam(name) {
    if (!teams.has(name)) {
      teams.set(name, {
        team: name,
        wins: 0,
        losses: 0,
        ties: 0,
        games: 0,
        runsFor: 0,
        runsAgainst: 0,
      })
    }

    return teams.get(name)
  }

  for (const record of games) {
    const game =
      record.state ??
      record.game_state ??
      {}

    const homeName = game.homeTeam
    const awayName = game.awayTeam

    if (!homeName || !awayName) {
      continue
    }

    const homeScore =
      game.score?.[homeName] ?? 0

    const awayScore =
      game.score?.[awayName] ?? 0

    const home = getTeam(homeName)
    const away = getTeam(awayName)

    home.games += 1
    away.games += 1

    home.runsFor += homeScore
    home.runsAgainst += awayScore

    away.runsFor += awayScore
    away.runsAgainst += homeScore

    if (homeScore > awayScore) {
      home.wins += 1
      away.losses += 1
    } else if (awayScore > homeScore) {
      away.wins += 1
      home.losses += 1
    } else {
      home.ties += 1
      away.ties += 1
    }
  }

  return Array.from(teams.values())
    .map((team) => ({
      ...team,

      pct:
        team.games > 0
          ? (
              (team.wins +
                team.ties * 0.5) /
              team.games
            )
          : 0,

      runDiff:
        team.runsFor -
        team.runsAgainst,
    }))
    .sort((a, b) => {
      if (b.pct !== a.pct) {
        return b.pct - a.pct
      }

      return b.runDiff - a.runDiff
    })
}