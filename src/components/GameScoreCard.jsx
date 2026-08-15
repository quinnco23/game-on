function getSavedState(game) {
    return game?.state ?? game?.game_state ?? {}
  }
  
  function getScoreData(game) {
    const state = getSavedState(game)

    const awayTeam =
  state.awayTeam || "Away"

const homeTeam =
  state.homeTeam || "Home"

const awayHits =
  getTeamHits(state, awayTeam)

const homeHits =
  getTeamHits(state, homeTeam)
  
  return {
    awayTeam,
    homeTeam,
  
    awayScore:
      state.score?.[awayTeam] ?? 0,
  
    homeScore:
      state.score?.[homeTeam] ?? 0,
  
    awayHits,
    homeHits,
  
    inning: state.inning ?? 1,
    half: state.half ?? "top",
  
    outs: state.outs ?? 0,
    balls: state.balls ?? 0,
    strikes: state.strikes ?? 0,
  
    events: state.events ?? [],
  }
  }

  function getTeamHits(state, teamName) {
    const lineup =
      state.lineups?.[teamName] ?? []
  
    const batterStats =
      state.stats?.batters ?? {}
  
    return lineup.reduce(
      (total, player) =>
        total +
        (batterStats[player.id]?.hits ?? 0),
      0
    )
  }
  
  export function GameScoreCard({
    game,
    status = "live",
    onClick,
  }) {
    if (!game) {
      return null
    }
  
    const score = getScoreData(game)
  
    const isFinal = status === "final"
  
    return (
      <section
        className="
          overflow-hidden
         
          
         scoreboard-panel
        border-l border-scoreboard-cream/40 
          shadow-md
        "
      >
        {/* STATUS */}
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between ">
            <div
              className={[
                "text-xs font-black uppercase tracking-wide",
                isFinal
                  ? "text-slate-600"
                  : "text-red-600",
              ].join(" ")}
            >
              {isFinal ? "FINAL" : "LIVE"}
            </div>
  
            {!isFinal && (
              <div className="text-xs font-bold text-slate-500">
                {score.half === "top"
                  ? "TOP"
                  : "BOT"}{" "}
                {score.inning}
              </div>
            )}
          </div>
  
          <div className="mt-2 border-t border-slate-200" />
        </div>
  
        {/* SCORE */}
        <div className="px-4 py-4">
        <div className="mb-2 grid grid-cols-[1fr_42px_42px_42px] ">
  <div />

  <div className="text-center text-xs font-bold text-slate-500">
    R
  </div>

  <div className="text-center text-xs font-bold text-slate-500">
    H
  </div>

 
</div>
  
          {/* AWAY */}
          <div className="grid grid-cols-[1fr_42px_42px_42px] items-center py-1">
  <div className="truncate text-lg font-bold">
    {score.awayTeam}
  </div>

  <div className="text-center text-xl font-black">
    {score.awayScore}
  </div>

  <div className="text-center text-lg font-bold">
    {score.awayHits}
  </div>

  <div className="text-center text-lg font-bold">
    {score.awayErrors}
  </div>
</div>
  
          {/* HOME */}
          <div className="grid grid-cols-[1fr_42px_42px_42px] items-center py-1">
  <div className="truncate text-lg font-bold">
    {score.homeTeam}
  </div>

  <div className="text-center text-xl font-black">
    {score.homeScore}
  </div>

  <div className="text-center text-lg font-bold">
    {score.homeHits}
  </div>

  <div className="text-center text-lg font-bold">
    {score.homeErrors}
  </div>
</div>
        </div>
  
        {/* LIVE SITUATION */}
        {!isFinal && (
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>
                {score.outs}{" "}
                {score.outs === 1 ? "OUT" : "OUTS"}
              </span>
  
              <span>
                {score.balls}-{score.strikes} COUNT
              </span>
            </div>
          </div>
        )}
  
        {/* FINAL META */}
        {isFinal && (
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="text-xs font-semibold text-slate-500">
              {score.events.length} events
            </div>
          </div>
        )}
  
        {/* ACTION */}
        {onClick && (
          <button
            type="button"
            className="
              w-full
              border-t border-slate-200
              px-4 py-3
              text-sm font-black
              uppercase tracking-wide
              text-blue-700
              hover:bg-slate-50
            "
            onClick={onClick}
          >
            {isFinal
              ? "View Game"
              : "Resume Game"}
          </button>
        )}
      </section>
    )
  }