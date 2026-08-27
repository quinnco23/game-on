import {
  useEffect,
  useMemo,
  useState,
} from "react"

export function GameClock({
  gameClock,
  gameRules,
}) {
  const [now, setNow] =
    useState(Date.now())

  const startedAt =
    gameClock?.startedAt

  const durationMinutes =
    gameRules?.timeLimitMinutes ??
    gameClock?.durationMinutes ??
    100

  useEffect(() => {
    if (
      !startedAt ||
      gameClock?.status !== "running"
    ) {
      return
    }

    const intervalId =
      setInterval(() => {
        setNow(Date.now())
      }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [
    startedAt,
    gameClock?.status,
  ])

  const clock = useMemo(() => {
    if (!startedAt) {
      return {
        remainingMs: null,
        expired: false,
      }
    }

    const startedMs =
      new Date(startedAt).getTime()

    const durationMs =
      durationMinutes *
      60 *
      1000

    const endMs =
      startedMs + durationMs

    const remainingMs =
      Math.max(
        0,
        endMs - now
      )

    return {
      remainingMs,
      expired:
        endMs <= now,
    }
  }, [
    startedAt,
    durationMinutes,
    now,
  ])

  if (
    gameRules?.timeLimitMinutes ==
    null
  ) {
    return null
  }

  if (!startedAt) {
    return (
      <div className="text-center">
        <div className="scoreboard-label">
          Game Clock
        </div>

        <div className="scoreboard-number mt-1 text-2xl opacity-50">
          {formatDuration(
            durationMinutes * 60
          )}
        </div>

        <div className="mt-1 text-xs opacity-50">
          Starts on first pitch
        </div>
      </div>
    )
  }

  const totalSeconds =
    Math.floor(
      clock.remainingMs / 1000
    )

  return (
    <div className="text-center">
      <div className="scoreboard-label">
        Game Clock
      </div>

      <div
        className={`
          scoreboard-number
          mt-1
          text-3xl
          ${
            clock.expired
              ? "text-scoreboard-red"
              : ""
          }
        `}
      >
        {clock.expired
          ? "0:00"
          : formatDuration(
              totalSeconds
            )}
      </div>

      {clock.expired && (
  <div className="mt-2 rounded-none border border-scoreboard-red p-2 text-center">
    <div className="font-bold text-scoreboard-red">
      TIME LIMIT REACHED
    </div>

    <div className="mt-1 text-xs opacity-70">
      Continue scoring until the game is officially ended.
    </div>
  </div>
)}
    </div>
  )
}

function formatDuration(
  totalSeconds
) {
  const hours =
    Math.floor(
      totalSeconds / 3600
    )

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    )

  const seconds =
    totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(
      minutes
    ).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`
  }

  return `${minutes}:${String(
    seconds
  ).padStart(2, "0")}`
}