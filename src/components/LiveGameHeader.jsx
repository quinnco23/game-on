import { GameClock } from "./GameClock"
export function LiveGameHeader({
    game,
    currentBatter,
    currentPitcher,
    pitchCount = 0,
    liveCount = {
      balls: 0,
      strikes: 0,
    },
  }) {
    const awayTeam =
      game.awayTeam ?? "Away"
  
    const homeTeam =
      game.homeTeam ?? "Home"
  
    const awayScore =
      game.score?.[awayTeam] ?? 0
  
    const homeScore =
      game.score?.[homeTeam] ?? 0
  
    const inningLabel =
      `${game.half === "bottom" ? "Bottom" : "Top"} ${
        game.inning ?? 1
      }`
  
    const outs =
      game.outs ?? 0
  
    const bases =
      game.bases ?? {
        first: null,
        second: null,
        third: null,
      }
  
    return (
      <section
        className="
          scoreboard-panel
          overflow-hidden
          border
          border-scoreboard-cream/20
        "
      >
        {/* STATUS */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-scoreboard-cream/20
            px-4 py-3
          "
        >
          <div className="scoreboard-label text-scoreboard-amber">
            ● Live
          </div>
  
          <div className="scoreboard-label">
            {inningLabel}
            {" · "}
            {outs} {outs === 1 ? "Out" : "Outs"}
          </div>

          <GameClock
  gameClock={game.gameClock}
/>
        </div>
  
        {/* SCORE */}
        <div className="space-y-3 px-4 py-5">
          <div
            className="
              grid
              grid-cols-[1fr_auto]
              items-center
              gap-4
            "
          >
            <div>
              <div className="scoreboard-label">
                Away
              </div>
  
              <div className="scoreboard-title mt-1 text-xl">
                {awayTeam}
              </div>
            </div>
  
            <div className="scoreboard-number text-4xl">
              {awayScore}
            </div>
          </div>
  
          <div
            className="
              grid
              grid-cols-[1fr_auto]
              items-center
              gap-4
            "
          >
            <div>
              <div className="scoreboard-label">
                Home
              </div>
  
              <div className="scoreboard-title mt-1 text-xl">
                {homeTeam}
              </div>
            </div>
  
            <div className="scoreboard-number text-4xl">
              {homeScore}
            </div>
          </div>
        </div>
  
        {/* DIAMOND + MATCHUP */}
        <div
          className="
            grid
            gap-5
            border-t
            border-scoreboard-cream/20
            px-4 py-5
            sm:grid-cols-[140px_1fr]
            sm:items-center
          "
        >
          <BaseDiamond bases={bases} />
  
          <div className="space-y-4">
            {/* <div>
              <div className="scoreboard-label text-scoreboard-amber">
                At Bat
              </div>
  
              <div className="scoreboard-title mt-1 text-xl">
                #{currentBatter?.number || "—"}{" "}
                {currentBatter?.name ?? "Batter"}
              </div>
            </div> */}
  
            <div
              className="
                grid
                grid-cols-2
                gap-3
                border-t
                border-scoreboard-cream/20
                pt-3
              "
            >
              <div>
                <div className="scoreboard-label">
                  Count
                </div>
  
                <div className="scoreboard-number mt-1 text-3xl">
                  {liveCount.balls}-
                  {liveCount.strikes}
                </div>
              </div>
  
              <div className="text-right">
                <div className="scoreboard-label">
                  Pitcher
                </div>
  
                <div className="mt-1 font-bold">
                  #{currentPitcher?.number || "—"}{" "}
                  {currentPitcher?.name ?? "Pitcher"}
                </div>
  
                <div className="scoreboard-label mt-1 opacity-60">
                  {pitchCount} pitches
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  function BaseDiamond({ bases }) {
    const occupied = {
      first: Boolean(bases?.first),
      second: Boolean(bases?.second),
      third: Boolean(bases?.third),
    }
  
    function baseClass(isOccupied) {
      return [
        "absolute",
        "h-7 w-7",
        "rotate-45",
        "border-2",
        "border-scoreboard-cream",
        isOccupied
          ? "bg-scoreboard-amber"
          : "bg-transparent",
      ].join(" ")
    }
  
    return (
      <div
        className="
          relative
          mx-auto
          h-32
          w-32
        "
      >
        {/* SECOND */}
        <div
          className={baseClass(
            occupied.second
          )}
          style={{
            left: "50%",
            top: "12%",
            transform:
              "translate(-50%, -50%) rotate(45deg)",
          }}
        />
  
        {/* THIRD */}
        <div
          className={baseClass(
            occupied.third
          )}
          style={{
            left: "22%",
            top: "45%",
            transform:
              "translate(-50%, -50%) rotate(45deg)",
          }}
        />
  
        {/* FIRST */}
        <div
          className={baseClass(
            occupied.first
          )}
          style={{
            left: "78%",
            top: "45%",
            transform:
              "translate(-50%, -50%) rotate(45deg)",
          }}
        />
  
        {/* HOME */}
        <div
          className="
            absolute
            bottom-1
            left-1/2
            h-5 w-5
            -translate-x-1/2
            rotate-45
            border-2
            border-scoreboard-cream/50
          "
        />
      </div>
    )
  }