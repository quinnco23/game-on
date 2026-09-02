export function GameFeed({
    events = [],
    title = "Game Feed",
    limit = 30,
    compact = false,
  }) {
    const visibleEvents =
      [...events]
        .reverse()
        .slice(0, limit)
  
    if (visibleEvents.length === 0) {
      return (
        <section className="scoreboard-panel p-4">
          <div className="scoreboard-label">
            {title}
          </div>
  
          <div className="mt-3 text-sm opacity-50">
            No plays recorded yet.
          </div>
        </section>
      )
    }
  
    return (
      <section className="scoreboard-panel overflow-hidden">
        <div
          className="
            border-b
            border-scoreboard-cream/20
            px-4 py-3
          "
        >
          <div className="scoreboard-label">
            {title}
          </div>
        </div>
  
        <div>
          {visibleEvents.map(
            (event, index) => (
              <GameFeedItem
                key={
                  event.id ??
                  `${event.inning}-${event.half}-${index}`
                }
                event={event}
                isLatest={index === 0}
                compact={compact}
              />
            )
          )}
        </div>
      </section>
    )
  }

  function GameFeedItem({
    event,
    isLatest,
    compact,
  }) {
    const inningLabel =
      event.half && event.inning
        ? `${
            event.half === "top"
              ? "Top"
              : "Bottom"
          } ${event.inning}`
        : ""
  
    const runs =
      event.runs ?? 0
  
    const outs =
      event.outs_recorded ?? 0
  
    return (
      <div
        className={`
          border-b
          border-scoreboard-cream/10
          px-4
          ${compact ? "py-2" : "py-3"}
          last:border-b-0
  
          ${
            isLatest
              ? "bg-scoreboard-amber/10"
              : ""
          }
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-scoreboard-amber
              "
            >
              {formatEventType(
                event.event_type
              )}
            </div>
  
            <div className="mt-1 font-bold">
              {event.label ?? "Play"}
            </div>
          </div>
  
          <div className="shrink-0 text-right">
            <div className="scoreboard-label opacity-60">
              {inningLabel}
            </div>
          </div>
        </div>
  
        {(runs > 0 || outs > 0) && (
          <div className="mt-2 flex gap-3 text-xs opacity-70">
            {runs > 0 && (
              <span>
                {runs}{" "}
                {runs === 1
                  ? "run"
                  : "runs"}
              </span>
            )}
  
            {outs > 0 && (
              <span>
                {outs}{" "}
                {outs === 1
                  ? "out"
                  : "outs"}
              </span>
            )}
          </div>
        )}
  
        <RunnerAdvances
          advances={
            event.details
              ?.runnerAdvances
          }
        />
      </div>
    )
  }

  function RunnerAdvances({
    advances = [],
  }) {
    if (!advances?.length) {
      return null
    }
  
    return (
      <div className="mt-2 space-y-1">
        {advances.map(
          (advance, index) => (
            <div
              key={
                advance.runnerId ??
                index
              }
              className="text-xs opacity-60"
            >
              {advance.runnerName ??
                advance.runner?.name ??
                "Runner"}{" "}
              {formatAdvance(
                advance
              )}
            </div>
          )
        )}
      </div>
    )
  }
  
  function formatAdvance(
    advance
  ) {
    const destination =
      advance.to
  
    if (
      destination === "home" ||
      advance.scored
    ) {
      return "scores"
    }
  
    if (destination === "out") {
      return "is out"
    }
  
    const labels = {
      first: "1st",
      second: "2nd",
      third: "3rd",
    }
  
    return `advances to ${
      labels[destination] ??
      destination
    }`
  }
  
  function formatEventType(type) {
    const labels = {
      single: "Single",
      double: "Double",
      triple: "Triple",
      homeRun: "Home Run",
      walk: "Walk",
      strikeout: "Strikeout",
      groundOut: "Groundout",
      flyOut: "Flyout",
      reachedOnError: "Error",
      fielderChoice:
        "Fielder's Choice",
      hitByPitch:
        "Hit By Pitch",
      stolenBase:
        "Stolen Base",
      caughtStealing:
        "Caught Stealing",
    }
  
    return labels[type] ?? type ?? "Play"
  }