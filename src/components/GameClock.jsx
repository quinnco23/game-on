
import {
    useEffect,
    useState,
  } from "react"
  
  export function GameClock({
    gameClock,
  }) {
    const [now, setNow] =
      useState(Date.now())
  
    useEffect(() => {
      if (
        gameClock?.status !== "running"
      ) {
        return
      }
  
      const interval =
        setInterval(() => {
          setNow(Date.now())
        }, 1000)
  
      return () =>
        clearInterval(interval)
    }, [gameClock?.status])
  
    if (!gameClock?.startedAt) {
      return (
        <div className="scoreboard-label opacity-60">
          Clock starts on first pitch
        </div>
      )
    }
  
    const startedAt =
      new Date(
        gameClock.startedAt
      ).getTime()
  
    const endAt =
      startedAt +
      (
        gameClock.durationMinutes ??
        100
      ) *
        60 *
        1000
  
    const remainingMs =
      Math.max(
        0,
        endAt - now
      )
  
    const totalSeconds =
      Math.floor(
        remainingMs / 1000
      )
  
    const minutes =
      Math.floor(
        totalSeconds / 60
      )
  
    const seconds =
      totalSeconds % 60
  
    const expired =
      remainingMs <= 0
  
    return (
      <div>
        <div className="scoreboard-label">
          Game Clock
        </div>
  
        <div className="scoreboard-number text-2xl">
          {expired
            ? "TIME"
            : `${minutes}:${String(
                seconds
              ).padStart(2, "0")}`}
        </div>
      </div>
    )
  }