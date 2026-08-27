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
            left-13.5
            top-1/2
          "
        />

        {/* HOME PLATE */}

        <div
          className="
            absolute
            top-13
            bottom-0
            left-1/2
            h-3
            w-4
            -translate-x-1/2
            border-8
            border-scoreboard-cream/50
            bg-scoreboard-cream/10
            [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]
          "
        />
      </div>
    </div>
  )
}



function getPitchType(result) {
    if (result === "ball") {
      return "ball"
    }
  
    if (
      result === "calledStrike" ||
      result === "swingingStrike" ||
      result === "foul"
    ) {
      return "strike"
    }
  
    if (result === "inPlay") {
      return "inPlay"
    }
  
    return "unknown"
  }
  
  function getTemporaryPitchPosition(
    pitch,
    index,
    total
  ) {
    /*
     * TEMPORARY visualization until ABS coordinates exist.
     *
     * Keep every pitch generally down the center of the plate,
     * but stagger them slightly vertically/horizontally so
     * consecutive pitches remain visible.
     */
  
    const offsets = [
      { x: 50, y: 50 },
      { x: 47, y: 42 },
      { x: 53, y: 58 },
      { x: 49, y: 34 },
      { x: 51, y: 66 },
      { x: 45, y: 50 },
      { x: 55, y: 46 },
    ]
  
    const fallback =
      offsets[index % offsets.length]
  
    /*
     * Later ABS can simply override this:
     *
     * pitch.plate_x
     * pitch.plate_z
     */
  
    return fallback
  }
  
  export function StrikeZoneTracker({
    pitches = [],
    batter,
  
    liveCount = {
      balls: 0,
      strikes: 0,
    },
  
    game,
    currentPitcher,
    pitchCount = 0,
  }) {
    const sortedPitches =
      [...pitches].sort(
        (a, b) =>
          a.sequence - b.sequence
      )
  
    return (
      <section
  className="
    scoreboard-panel
    overflow-hidden
    border
    border-scoreboard-cream/20
  "
>

  {/* GAME SITUATION */}

<div
  className="
    grid
    grid-cols-[72px_1fr]
    items-center
    gap-3
    border-b
    border-scoreboard-cream/20
    px-4
    py-3
  "
>
  <MiniBases bases={game?.bases} />

  <div className="min-w-0">
    <div className="scoreboard-label">
      Pitching
    </div>

    <div className="mt-1 truncate font-bold">
      #{currentPitcher?.number || "—"}{" "}
      {currentPitcher?.name ?? "Pitcher"}
    </div>

    <div className="mt-0.5 text-xs opacity-60">
      {pitchCount}{" "}
      {pitchCount === 1
        ? "pitch"
        : "pitches"}
    </div>
  </div>
</div>
  {/* TRACKER */}

  <div
    className="
      grid
      grid-cols-[90px_1fr]
      items-end
      gap-2
      px-4 py-6
      sm:grid-cols-[130px_1fr]
    "
  >
    {/* BATTER FIGURE */}

    <BatterFigure />

    {/* STRIKE ZONE AREA */}

    <div className="flex justify-center">
      <div
        className="
          relative
          h-72
          w-56
          max-w-full
        "
      >
        {/* subtle centerline */}

        <div
          className="
            absolute
            bottom-0
            left-1/2
            top-0
            border-l
            border-dashed
            border-scoreboard-cream/10
          "
        />

        {/* STRIKE ZONE */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-40
            w-32
            -translate-x-1/2
            -translate-y-1/2
            border-2
            border-scoreboard-cream
          "
        >
          <div className="absolute left-1/3 top-0 h-full border-l border-scoreboard-cream/20" />
          <div className="absolute left-2/3 top-0 h-full border-l border-scoreboard-cream/20" />

          <div className="absolute left-0 top-1/3 w-full border-t border-scoreboard-cream/20" />
          <div className="absolute left-0 top-2/3 w-full border-t border-scoreboard-cream/20" />
        </div>

        {/* HOME PLATE */}

        <div
          className="
            absolute
            bottom-2
            left-1/2
            h-5
            w-12
            -translate-x-1/2
            border
            border-scoreboard-cream/40
          "
        />

        {/* PITCHES */}

        {sortedPitches.map(
          (pitch, index) => {
            const position =
              getTemporaryPitchPosition(
                pitch,
                index,
                sortedPitches.length
              )

            const pitchType =
              getPitchType(
                pitch.result
              )

            const isLatest =
              index ===
              sortedPitches.length - 1

            return (
              <div
                key={pitch.id}
                className={`
                  absolute
                  flex
                  h-8
                  w-8
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  text-xs
                  font-black
                  shadow-lg
                  transition-all
                  duration-300

                  ${
                    pitchType === "ball"
                      ? `
                        border-scoreboard-amber
                        bg-scoreboard-dark
                        text-scoreboard-amber
                      `
                      : ""
                  }

                  ${
                    pitchType === "strike"
                      ? `
                        border-scoreboard-red
                        bg-scoreboard-red
                        text-scoreboard-cream
                      `
                      : ""
                  }

                  ${
                    pitchType === "inPlay"
                      ? `
                        border-scoreboard-cream
                        bg-scoreboard-cream
                        text-scoreboard-dark
                      `
                      : ""
                  }

                  ${
                    isLatest
                      ? "z-20 scale-110"
                      : "z-10 opacity-80"
                  }
                `}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                title={pitch.result}
              >
                {index + 1}
              </div>
            )
          }
        )}
      </div>
    </div>
  </div>

  {/* CURRENT AT BAT */}

  <div
    className="
      flex
      items-center
      justify-between
      gap-4
      border-t
      border-scoreboard-cream/20
      px-4 py-3
    "
  >
    <div className="min-w-0">
      <div className="scoreboard-label text-scoreboard-amber">
        At Bat
      </div>

      <div className="scoreboard-title mt-1 truncate">
        #{batter?.number || "—"}{" "}
        {batter?.name ?? "Batter"}
      </div>
    </div>

    <div className="shrink-0 text-right">
      <div className="scoreboard-label">
        Count
      </div>

      <div className="scoreboard-number text-3xl">
        {liveCount.balls}-
        {liveCount.strikes}
      </div>
    </div>
  </div>

  {/* LEGEND */}

  <div
    className="
      flex
      flex-wrap
      gap-4
      border-t
      border-scoreboard-cream/20
      px-4 py-3
    "
  >
    <LegendItem
      type="strike"
      label="Strike"
    />

    <LegendItem
      type="ball"
      label="Ball"
    />

    <LegendItem
      type="inPlay"
      label="In Play"
    />
  </div>
</section>
    )
  }
  
  function BatterFigure() {
    return (
      <div
        className="
          relative
          mx-auto
          h-56
          w-20
          opacity-70
        "
      >
        {/* HEAD */}
  
        <div
          className="
            absolute
            left-1/2
            top-2
            h-8
            w-8
            -translate-x-1/2
            rounded-full
            border-2
            border-scoreboard-cream
          "
        />
  
        {/* BODY */}
  
        <div
          className="
            absolute
            left-1/2
            top-10
            h-20
            -translate-x-1/2
            border-l-4
            border-scoreboard-cream
          "
        />
  
        {/* ARMS */}
  
        <div
          className="
            absolute
            left-1/2
            top-14
            h-14
            rotate-[55deg]
            border-l-4
            border-scoreboard-cream
          "
        />
  
        <div
          className="
            absolute
            left-[38%]
            top-16
            h-12
            -rotate-[45deg]
            border-l-4
            border-scoreboard-cream
          "
        />
  
        {/* LEGS */}
  
        <div
          className="
            absolute
            bottom-5
            left-[42%]
            h-24
            rotate-[12deg]
            border-l-4
            border-scoreboard-cream
          "
        />
  
        <div
          className="
            absolute
            bottom-5
            left-[58%]
            h-24
            -rotate-[12deg]
            border-l-4
            border-scoreboard-cream
          "
        />
  
        {/* BAT */}
  
        <div
          className="
            absolute
            right-0
            top-7
            h-28
            rotate-[25deg]
            border-l-4
            border-scoreboard-amber
          "
        />
      </div>
    )
  }
  
  function LegendItem({
    type,
    label,
  }) {
    const className =
      type === "strike"
        ? "bg-scoreboard-red border-scoreboard-red"
        : type === "ball"
        ? "bg-scoreboard-dark border-scoreboard-amber"
        : "bg-scoreboard-cream border-scoreboard-cream"
  
    return (
      <div className="flex items-center gap-2">
        <div
          className={`
            h-3
            w-3
            rounded-full
            border
            ${className}
          `}
        />
  
        <span className="scoreboard-label opacity-60">
          {label}
        </span>
      </div>
    )
  }