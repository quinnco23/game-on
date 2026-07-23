import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

function getSavedState(game) {
  return game?.state ?? game?.game_state ?? {}
}

function getFinalScore(game) {
  const state = getSavedState(game)

  return {
    awayTeam: state.awayTeam || "Away",
    homeTeam: state.homeTeam || "Home",
    awayScore: state.score?.[state.awayTeam] ?? 0,
    homeScore: state.score?.[state.homeTeam] ?? 0,
    inning: state.inning || 1,
    half: state.half || "top",
    events: state.events || [],
  }
}
function getPlayerOfGame(game) {
  const state = getSavedState(game)
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
  finishedGames = [],
  onNewGame,
  onResume,
  onViewFinished,
}) {

  const activeScore = activeGame
  ? getFinalScore(activeGame)
  : null
  return (
    <main className="scoreboard-shell min-h-screen p-4">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="border-b-2 border-scoreboard-red pb-4">
          <p className="scoreboard-label">
            Official Scoring System
          </p>

          <h1 className="scoreboard-title mt-1 text-3xl">
            GameOn
          </h1>
        </header>

        {activeGame && activeScore && (
  <section className="scoreboard-panel relative z-10 p-5">
    <div className="flex items-center justify-between">
      <div className="scoreboard-label">
        Game in progress
      </div>

      <div className="scoreboard-label text-scoreboard-amber">
        {activeScore.half === "top" ? "Top" : "Bottom"}{" "}
        {activeScore.inning}
      </div>
    </div>

    <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <div>
        <div className="scoreboard-label">
          Away
        </div>

        <div className="scoreboard-title mt-1">
          {activeScore.awayTeam}
        </div>
      </div>

      <div className="scoreboard-number whitespace-nowrap text-2xl">
        {activeScore.awayScore}

        <span className="mx-3 text-scoreboard-red">
          –
        </span>

        {activeScore.homeScore}
      </div>

      <div className="text-right">
        <div className="scoreboard-label">
          Home
        </div>

        <div className="scoreboard-title mt-1">
          {activeScore.homeTeam}
        </div>
      </div>
    </div>

    <div className="mt-4 border-t border-scoreboard-cream/30 pt-4">
      <button
        type="button"
        className="scoreboard-button scoreboard-button-primary w-full"
        onClick={() => onResume(activeGame)}
      >
        Resume Game
      </button>
    </div>
  </section>
)}

        <button
          type="button"
          className="scoreboard-button w-full"
          onClick={onNewGame}
        >
          Start New Game
        </button>

        <section className="space-y-3">
          <h2 className="scoreboard-title text-xl">
            Final Scores
          </h2>

          {finishedGames.length === 0 ? (
  <div className="scoreboard-panel p-5 text-center">
    <p className="scoreboard-label">
      No completed games yet
    </p>
  </div>
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
      type="button"
      onClick={onClick}
      className="scoreboard-panel relative z-10 block w-full p-4 text-left transition hover:bg-scoreboard-light"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="border border-scoreboard-red bg-scoreboard-red px-3 py-1 font-heading text-xs font-bold uppercase tracking-[0.14em] text-scoreboard-cream">
          Final
        </span>

        <span className="scoreboard-label text-right">
          {inning} innings · {events.length} events
        </span>
      </div>

      <div className="border border-scoreboard-cream/35">
        <div className="grid grid-cols-[1fr_70px]">
          <div className="border-b border-scoreboard-cream/30 p-3 font-heading text-lg font-bold uppercase tracking-wide">
            {awayTeam}
          </div>

          <div className="scoreboard-number border-b border-l border-scoreboard-cream/30 bg-scoreboard-dark p-3 text-center text-2xl">
            {awayScore}
          </div>

          <div className="p-3 font-heading text-lg font-bold uppercase tracking-wide">
            {homeTeam}
          </div>

          <div className="scoreboard-number border-l border-scoreboard-cream/30 bg-scoreboard-dark p-3 text-center text-2xl">
            {homeScore}
          </div>
        </div>
      </div>

      {playerOfGame && (
        <div className="mt-3 border-l-4 border-scoreboard-amber bg-scoreboard-dark/60 p-3">
          <div className="scoreboard-label text-scoreboard-amber">
            Player of the Game
          </div>

          <div className="mt-1 font-heading font-bold uppercase tracking-wide">
            #{playerOfGame.player.number}{" "}
            {playerOfGame.player.name}
          </div>

          <div className="scoreboard-label mt-1">
            {playerOfGame.hits} H · {playerOfGame.rbi} RBI
          </div>
        </div>
      )}
    </button>
  )
}