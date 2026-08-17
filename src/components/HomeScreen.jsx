import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { GameScoreCard } from "./GameScoreCard"

function getSavedState(game) {
  return game?.state ?? game?.game_state ?? {}
}

function getFinalScore(game) {
  const state = getSavedState(game)

  return {
    awayTeam: state.awayTeam || "Away",
    homeTeam: state.homeTeam || "Home",

    awayScore:
      state.score?.[state.awayTeam] ?? 0,

    homeScore:
      state.score?.[state.homeTeam] ?? 0,

    inning: state.inning || 1,
    half: state.half || "top",

    outs: state.outs ?? 0,
    balls: state.balls ?? 0,
    strikes: state.strikes ?? 0,

    events: state.events || [],
  }
}
function getPlayerOfGame(game) {
  const state =
    game?.state ??
    game?.game_state ??
    {}

  const lineups =
    state.lineups ?? {}

  const batterStats =
    state.stats?.batters ?? {}

  const allPlayers =
    Object.values(lineups).flat()

  const ranked = allPlayers
    .map((player) => {
      const stats =
        batterStats[player.id] ?? {}

      return {
        player,
        hits: stats.hits ?? 0,
        rbi: stats.rbi ?? 0,
      }
    })
    .sort((a, b) => {
      if (b.rbi !== a.rbi) {
        return b.rbi - a.rbi
      }

      return b.hits - a.hits
    })

  const top = ranked[0]

  if (
    !top ||
    (top.hits === 0 &&
      top.rbi === 0)
  ) {
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
  onTeams,
}) {

  const activeScore = activeGame
  ? getFinalScore(activeGame)
  : null

  console.log("HomeScreen activeGame:", activeGame)
  console.log(
    "HomeScreen savedState:",
    getSavedState(activeGame)
  )

  
  return (
    <main className="scoreboard-shell min-h-screen p-4">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="border-b-2 border-scoreboard-red pb-4  ">
          <p className="scoreboard-label  text-3xl">
            SCSA
          </p>

          <h1 className=" mt-1 text-sm">
            Powered by <span className="text-scoreboard-red">gameOnAI </span>
          </h1>

          <button
  className="scoreboard-button w-full mb-3.5"
  onClick={onTeams}
>
  Teams & Rosters
</button>
        </header>

        {activeGame && (
  <GameScoreCard
    game={activeGame}
    status="live"
    onClick={() =>
      onResume(activeGame)
    }
  />
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
  <div
  className="mt-3 border-l-4 border-scoreboard-amber bg-scoreboard-dark/60 p-3">
    <span className="scoreboard-label text-scoreboard-amber">
      Player of the Game:
    </span>{" "}
    <div className="mt-1 font-heading font-bold uppercase tracking-wide">
    #{playerOfGame.player.number || "—"}{" "}
    {playerOfGame.player.name}
    </div>
    <span className="scoreboard-label mt-1">
    {playerOfGame.hits} H ·{" "}
    {playerOfGame.rbi} RBI
    </span>
  </div>
)}
    </button>
  )
}





