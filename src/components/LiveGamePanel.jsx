import { StrikeZoneTracker } from "./StrikeZoneTracker"

function MiniBases({
    bases = {},
  }) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="
            relative
            h-16
            w-16
            shrink-0
          "
        >
          {/* SECOND */}
  
          <MiniBase
            occupied={bases.second}
            className="
              left-1/2
              top-1
            "
          />
  
          {/* THIRD */}
  
          <MiniBase
            occupied={bases.third}
            className="
              left-2
              top-1/2
            "
          />
  
          {/* FIRST */}
  
          <MiniBase
            occupied={bases.first}
            className="
              right-0
              top-1/2
            "
          />
  
          {/* HOME PLATE */}
  
          <div
            className="
              absolute
              bottom-0
              left-1/2
              h-3
              w-4
              -translate-x-1/2
              border
              border-scoreboard-cream/50
              bg-scoreboard-cream/10
              [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]
            "
          />
        </div>
      </div>
    )
  }
  
  function MiniBase({
    occupied,
    className,
  }) {
    return (
      <div
        className={`
          absolute
          h-4
          w-4
          -translate-x-1/2
          -translate-y-1/2
          rotate-45
          border-2
          border-scoreboard-cream
  
          ${
            occupied
              ? "bg-scoreboard-amber"
              : "bg-scoreboard-dark"
          }
  
          ${className}
        `}
      />
    )
  }
  
  function Base({
    occupied,
    className,
  }) {
    return (
      <div
        className={`
          absolute
          h-4
          w-4
          -translate-x-1/2
          -translate-y-1/2
          rotate-45
          border-2
          border-scoreboard-cream
          ${  
            occupied
              ? "bg-scoreboard-amber"
              : "bg-transparent"
          }
          ${className}
        `}
      />
    )
  }

export function LiveGamePanel({
  game,
  currentBatter,
  currentPitcher,
  pitchCount,
  liveCount,
  pitches,
}) {
  return (
    <section className="scoreboard-panel overflow-hidden">

      {/* TOP BAR */}
      <div className="
        flex
        items-center
        justify-between
        border-b
        border-scoreboard-cream/20
        px-4
        py-3
      ">
        <div className="
          text-xs
          font-black
          uppercase
          tracking-widest
          text-scoreboard-red
        ">
          ● Live
        </div>

        <div className="scoreboard-label">
          {game.half === "top"
            ? "Top"
            : "Bottom"}{" "}
          {game.inning}
          {" · "}
          {game.outs}{" "}
          {game.outs === 1
            ? "Out"
            : "Outs"}
        </div>
      </div>

      {/* SCORE */}
      <div className="
        grid
        grid-cols-2
        border-b
        border-scoreboard-cream/20
      ">
        <TeamScore
          name={game.awayTeam}
          score={
            game.score?.[
              game.awayTeam
            ] ?? 0
          }
        />

        <TeamScore
          name={game.homeTeam}
          score={
            game.score?.[
              game.homeTeam
            ] ?? 0
          }
        />
       </div>

     

   {/* STRIKE ZONE */}
<div className="p-4">
  <StrikeZoneTracker
    pitches={pitches}
    batter={currentBatter}
    liveCount={liveCount}
    bases={game.bases ?? {}}
    currentPitcher={currentPitcher}
    pitchCount={pitchCount}
  />
</div>

</section>
  )
}

function TeamScore({
  name,
  score,
}) {
  return (
    <div className="p-4 text-center">
      <div className="
        truncate
        text-xs
        font-bold
        uppercase
        opacity-60
      ">
        {name}
      </div>

      <div className="scoreboard-number mt-1 text-4xl">
        {score}
      </div>
    </div>
  )
}