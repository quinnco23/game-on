export default function GameVideo({
    videoSrc,
    game,
    currentBatter,
    currentPitcher,
    pitchCount = 0,
    liveCount,
    controls = true,
  }) {
    const balls =
      liveCount?.balls ??
      game.balls ??
      0
  
    const strikes =
      liveCount?.strikes ??
      game.strikes ??
      0
  
    const outs =
      game.outs ?? 0
  
    const awayScore =
      game.score?.[game.awayTeam] ?? 0
  
    const homeScore =
      game.score?.[game.homeTeam] ?? 0
  
    return (
      <div className="relative w-full overflow-hidden bg-black">
        <video
          src={videoSrc}
          controls={controls}
          playsInline
          className="aspect-video w-full object-cover"
        />
  
        {/* COMPACT BROADCAST OVERLAY */}
        <div
  className="
    pointer-events-none
    absolute
    left-2
    top-2
    w-[300px]
    origin-top-left
    scale-[0.42]
  "
>
          <div
            className="
              overflow-hidden
              border
              border-white/20
              bg-black/85
              text-white
              shadow-lg
              backdrop-blur-sm
            "
          >
            {/* TOP SCORE STRIP */}
            <div className="grid grid-cols-[1fr_auto]">
              {/* TEAMS */}
              <div>
                <TeamRow
                  team={game.awayTeam}
                  score={awayScore}
                  batting={game.half === "top"}
                />
  
                <TeamRow
                  team={game.homeTeam}
                  score={homeScore}
                  batting={game.half === "bottom"}
                />
              </div>
  
              {/* INNING */}
              <div
                className="
                  flex
                  min-w-[64px]
                  flex-col
                  items-center
                  justify-center
                  border-l
                  border-white/15
                  bg-white/5
                  px-2
                "
              >
                <div
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-white/60
                  "
                >
                  Inning
                </div>
  
                <div className="mt-1 text-lg font-black leading-none">
                  {game.half === "top" ? "▲" : "▼"}{" "}
                  {game.inning}
                </div>
              </div>
            </div>
  
            {/* GAME STATE STRIP */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                border-t
                border-white/15
                bg-black/90
                px-3
                py-2
              "
            >
              <div className="flex items-center gap-3">
                <CompactCount
                  label="B"
                  value={balls}
                  total={3}
                />
  
                <CompactCount
                  label="S"
                  value={strikes}
                  total={2}
                />
  
                <CompactCount
                  label="O"
                  value={outs}
                  total={2}
                />
              </div>
  
              <BaseStatus bases={game.bases} />
            </div>
  
            {/* PLAYER STRIP */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                border-t
                border-white/10
                bg-white/5
                px-3
                py-2
                text-[10px]
              "
            >
              <div className="min-w-0 flex-1">
                <div
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-scoreboard-amber
                  "
                >
                  At Bat
                </div>
  
                <div className="truncate font-bold">
                  {formatPlayer(currentBatter)}
                </div>
              </div>
  
              <div className="min-w-0 flex-1 text-right">
                <div
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-scoreboard-amber
                  "
                >
                  Pitching
                </div>
  
                <div className="truncate font-bold">
                  {formatPlayer(currentPitcher)}
                </div>
  
                <div className="text-[9px] text-white/50">
                  {pitchCount} P
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  function TeamRow({
    team,
    score,
    batting = false,
  }) {
    return (
      <div
        className="
          flex
          min-h-[34px]
          items-center
          justify-between
          gap-3
          border-b
          border-white/10
          px-3
          last:border-b-0
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`
              h-2
              w-2
              rounded-full
              ${
                batting
                  ? "bg-scoreboard-amber"
                  : "bg-transparent"
              }
            `}
          />
  
          <span
            className="
              truncate
              text-[11px]
              font-black
              uppercase
              tracking-[0.08em]
            "
          >
            {team}
          </span>
        </div>
  
        <div
          className="
            scoreboard-number
            text-xl
            leading-none
          "
        >
          {score}
        </div>
      </div>
    )
  }
  
  function CompactCount({
    label,
    value,
    total,
  }) {
    return (
      <div className="flex items-center gap-1">
        <span
          className="
            text-[9px]
            font-black
            uppercase
            text-white/60
          "
        >
          {label}
        </span>
  
        <div className="flex gap-[2px]">
          {Array.from({
            length: total,
          }).map((_, index) => (
            <span
              key={index}
              className={`
                h-[6px]
                w-[6px]
                rounded-full
                ${
                  index < value
                    ? "bg-scoreboard-amber"
                    : "bg-white/20"
                }
              `}
            />
          ))}
        </div>
      </div>
    )
  }
  
  function BaseStatus({ bases }) {
    return (
      <div className="relative h-7 w-9">
        <Base
          active={Boolean(bases?.second)}
          className="
            absolute
            left-1/2
            top-0
            -translate-x-1/2
          "
        />
  
        <Base
          active={Boolean(bases?.third)}
          className="
            absolute
            bottom-0
            left-0
          "
        />
  
        <Base
          active={Boolean(bases?.first)}
          className="
            absolute
            bottom-0
            right-0
          "
        />
      </div>
    )
  }
  
  function Base({
    active,
    className = "",
  }) {
    return (
      <span
        className={`
          h-[7px]
          w-[7px]
          rotate-45
          border
          ${
            active
              ? "border-scoreboard-amber bg-scoreboard-amber"
              : "border-white/40 bg-transparent"
          }
          ${className}
        `}
      />
    )
  }
  
  function formatPlayer(player) {
    if (!player) {
      return "—"
    }
  
    const number =
      player.number
        ? `#${player.number} `
        : ""
  
    return `${number}${player.name ?? ""}`
  }