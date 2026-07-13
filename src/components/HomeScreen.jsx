import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

function getFinalScore(game) {
  const state = game.state || {}

  return {
    awayTeam: state.awayTeam || "Away",
    homeTeam: state.homeTeam || "Home",
    awayScore: state.score?.[state.awayTeam] ?? 0,
    homeScore: state.score?.[state.homeTeam] ?? 0,
    inning: state.inning || 1,
    events: state.events || [],
  }
}

function getPlayerOfGame(game) {
  const state = game.state || {}
  const events = state.events || []
  const lineups = state.lineups || {}

  const allPlayers = Object.values(lineups).flat()
  const playerStats = {}

  for (const player of allPlayers) {
    playerStats[player.id] = {
      player,
      hits: 0,
      rbi: 0,
    }
  }

  for (const event of events) {
    const playerId = event.player_id
    if (!playerId || !playerStats[playerId]) continue

    if (["single", "double", "triple", "home_run"].includes(event.event_type)) {
      playerStats[playerId].hits += 1
    }

    playerStats[playerId].rbi += event.rbi || 0
  }

  const ranked = Object.values(playerStats).sort((a, b) => {
    if (b.rbi !== a.rbi) return b.rbi - a.rbi
    return b.hits - a.hits
  })

  const top = ranked[0]

  if (!top || (top.hits === 0 && top.rbi === 0)) {
    return null
  }

  return top
}

export function HomeScreen({
  activeGame,
  finishedGames,
  onResume,
  onNewGame,
  onViewFinished,
}) {
  return (
    <main className="min-h-screen bg-green-950 text-white p-4">
      <div className="mx-auto max-w-md space-y-4">
        <header className="rounded-3xl bg-black/40 border border-white/10 p-5 text-center">
          <div className="text-sm tracking-[0.3em] text-green-300 ">
            GameOn
          </div>
          <h1 className="text-4xl font-black mt-2">Scoreboard</h1>
          <p className="text-white/60 text-sm mt-1">
            Live games, final scores, and box score leaders
          </p>
        </header>

        {activeGame?.state && (
          <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Live Game</h2>
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold">
                  LIVE
                </span>
              </div>

              <MiniScoreboard game={activeGame} />

              <Button className="w-full rounded-2xl py-5" onClick={onResume}>
                Resume Current Game
              </Button>
            </CardContent>
          </Card>
        )}

        <Button className="w-full rounded-2xl py-6 text-lg" onClick={onNewGame}>
          Start New Game
        </Button>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">Around the League</h2>

          {finishedGames.length === 0 ? (
            <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
              <CardContent className="p-5 text-white/60">
                No finished games yet.
              </CardContent>
            </Card>
          ) : (
            finishedGames.map((game) => (
              <FinishedGameCard
                key={game.id}
                game={game}
                onClick={() => onViewFinished(game)}
              />
            ))
          )}
        </section>
      </div>
    </main>
  )
}

function MiniScoreboard({ game }) {
  const {
    awayTeam,
    homeTeam,
    awayScore,
    homeScore,
    inning,
  } = getFinalScore(game)

  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
      <div className="grid grid-cols-[1fr_64px] text-sm">
        <div className="p-3 border-b border-white/10 font-bold">
          {awayTeam}
        </div>
        <div className="p-3 border-b border-white/10 text-center text-2xl font-black">
          {awayScore}
        </div>

        <div className="p-3 font-bold">
          {homeTeam}
        </div>
        <div className="p-3 text-center text-2xl font-black">
          {homeScore}
        </div>
      </div>

      <div className="bg-white/5 px-3 py-2 text-xs text-white/60">
        Inning {inning}
      </div>
    </div>
  )
}

function FinishedGameCard({ game, onClick }) {
  const {
    awayTeam,
    homeTeam,
    awayScore,
    homeScore,
    inning,
    events,
  } = getFinalScore(game)

  const playerOfGame = getPlayerOfGame(game)

  return (
    <button
      onClick={onClick}
      className="block w-full text-left rounded-3xl bg-white/10 border border-white/10 p-4 hover:bg-white/15 transition"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
          FINAL
        </span>

        <span className="text-xs text-white/50">
          {inning} innings · {events.length} events
        </span>
      </div>

      <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_64px]">
          <div className="p-3 border-b border-white/10 font-bold">
            {awayTeam}
          </div>
          <div className="p-3 border-b border-white/10 text-center text-2xl font-black">
            {awayScore}
          </div>

          <div className="p-3 font-bold">
            {homeTeam}
          </div>
          <div className="p-3 text-center text-2xl font-black">
            {homeScore}
          </div>
        </div>
      </div>

      {playerOfGame && (
        <div className="mt-3 rounded-2xl bg-yellow-400/10 border border-yellow-300/20 p-3">
          <div className="text-xs uppercase tracking-widest text-yellow-200/80">
            Player of the Game
          </div>
          <div className="font-bold mt-1">
            #{playerOfGame.player.number} {playerOfGame.player.name}
          </div>
          <div className="text-sm text-white/60">
            {playerOfGame.hits} H · {playerOfGame.rbi} RBI
          </div>
        </div>
      )}
    </button>
  )
}