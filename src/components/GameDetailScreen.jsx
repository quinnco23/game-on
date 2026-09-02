import { useEffect, useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { getGameById } from "../services/gamesService"
import { GameScoreCard } from "./GameScoreCard"
import { BoxScore } from "./BoxScore"
import { LineScore } from "./LineScore"
import { PitchingBoxScore } from "./PitchingBoxScore"
import {
  StrikeZoneTracker,
} from "./StrikeZoneTracker"

import {
  LiveGameHeader,
} from "./LiveGameHeader"

import { supabase } from "../lib/supabase"

import {
  getGamePitchEvents,
} from "../services/pitchEventsService"
import { LiveGamePanel } from "./LiveGamePanel"
import { GameFeed } from "./GameFeed"

function GameSummary({ game }) {
    const events = game.events ?? []
  
    if (events.length === 0) {
      return (
        <div className="text-sm opacity-60">
          No game events recorded yet.
        </div>
      )
    }

    function formatPitchResult(result) {
      const labels = {
        ball: "Ball",
        calledStrike: "Called Strike",
        swingingStrike:
          "Swinging Strike",
        foul: "Foul",
        inPlay: "In Play",
      }
    
      return labels[result] ?? result
    }
  
    return (
      <div className="space-y-2">
        {[...events]
          .reverse()
          .slice(0, 20)
          .map((event, index) => (
            <div
              key={event.id ?? index}
              className="
                border-b
                border-white/10
                py-2
              "
            >
              <div className="text-sm font-bold">
                {event.label ??
                  event.event_type ??
                  "Play"}
              </div>
  
              <div className="text-xs opacity-60">
                {event.half
                  ? `${event.half === "top"
                      ? "Top"
                      : "Bottom"} ${event.inning}`
                  : ""}
              </div>
            </div>
          ))}
      </div>
    )
  }

export function GameDetailScreen() {
  const { gameId } = useParams()

  console.log(
    "FAN GAME ID:",
    gameId
  )
  const navigate = useNavigate()

  const [pitchEvents, setPitchEvents] =
  useState([])

  const [gameRecord, setGameRecord] =
    useState(null)
    const [gameEvents, setGameEvents] =
  useState([])

  const [loading, setLoading] =
    useState(true)

    useEffect(() => {
      async function loadGame() {
        try {
          const [
            gameResult,
            pitchResult,
            eventResult,
          ] = await Promise.all([
            getGameById(gameId),
            getGamePitchEvents(gameId),
          
            supabase
              .from("events")
              .select("*")
              .eq("game_id", gameId)
              .order("created_at", {
                ascending: true,
              }),
          ])

          setGameRecord(gameResult)
setPitchEvents(pitchResult)

if (eventResult.error) {
  throw eventResult.error
}

setGameEvents(
  eventResult.data ?? []
)
    
          setGameRecord(gameResult)
          setPitchEvents(pitchResult)
        } catch (error) {
          console.error(
            "Could not load game:",
            error
          )
        } finally {
          setLoading(false)
        }
      }
    
      loadGame()
    }, [gameId])

    

    useEffect(() => {
      if (!gameId) return
    
      const channel = supabase
        .channel(`game-pitches-${gameId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "pitch_events",
             filter: `game_id=eq.${gameId}`,
          },
          (payload) => {
            const newPitch = payload.new
    
            console.log(
              "LIVE PITCH RECEIVED:",
              newPitch
            )
    
            setPitchEvents((current) => {
              const alreadyExists =
                current.some(
                  (pitch) =>
                    pitch.id === newPitch.id
                )
    
              if (alreadyExists) {
                return current
              }
    
              return [
                ...current,
                newPitch,
              ].sort(
                (a, b) =>
                  a.sequence - b.sequence
              )
            })
          }
        )
        .subscribe((status) => {
          console.log(
            "PITCH REALTIME STATUS:",
            status
          )
        })
    
      return () => {
        supabase.removeChannel(channel)
      }
    }, [gameId])

    useEffect(() => {
      if (!gameId) return
    
      const channel = supabase
        .channel(`game-events-${gameId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "events",
            filter: `game_id=eq.${gameId}`,
          },
          (payload) => {
            const newEvent =
              payload.new
    
            console.log(
              "LIVE GAME EVENT RECEIVED:",
              newEvent
            )
    
            setGameEvents(
              (current) => {
                const alreadyExists =
                  current.some(
                    (event) =>
                      event.id ===
                      newEvent.id
                  )
    
                if (alreadyExists) {
                  return current
                }
    
                return [
                  ...current,
                  newEvent,
                ]
              }
            )
          }
        )
        .subscribe((status) => {
          console.log(
            "EVENT REALTIME STATUS:",
            status
          )
        })
    
      return () => {
        supabase.removeChannel(channel)
      }
    }, [gameId])

    useEffect(() => {
      if (!gameId) return
    
      const channel = supabase
        .channel(`game-state-${gameId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "games",
            filter: `id=eq.${gameId}`,
          },
          (payload) => {
            console.log(
              "LIVE GAME UPDATE:",
              payload.new
            )
    
            setGameRecord(payload.new)
          }
        )
        .subscribe((status) => {
          console.log(
            "GAME REALTIME STATUS:",
            status
          )
        })
    
      return () => {
        supabase.removeChannel(channel)
      }
    }, [gameId])

  if (loading) {
    return (
      <main className="p-4">
        Loading game...
      </main>
    )
  }

  if (!gameRecord) {
    return (
      <main className="p-4">
        Game not found.
      </main>
    )
  }

  const game =
    gameRecord.state ??
    gameRecord.game_state ??
    {}
    const isFinished =
    gameRecord.status === "final"
  
  const isLive =
    !isFinished &&
    (
      gameRecord.status === "scoring" ||
      game.status === "scoring"
    )

  const awayLineup =
    game.lineups?.[game.awayTeam] ?? []

  const homeLineup =
    game.lineups?.[game.homeTeam] ?? []

   

const battingTeam =
  game.half === "top"
    ? game.awayTeam
    : game.homeTeam

const lineup =
  game.lineups?.[battingTeam] ?? []

const battingIndex =
  game.battingIndex?.[battingTeam] ?? 0

const currentBatter =
  lineup[battingIndex] ?? null

const currentAtBatPitches =
  pitchEvents.filter(
    (pitch) =>
      pitch.inning === game.inning &&
      pitch.half === game.half &&
      pitch.batter_id ===
        currentBatter?.id
  )

  const latestPitch =
  [...pitchEvents]
    .sort(
      (a, b) =>
        b.sequence - a.sequence
    )[0] ?? null



    function getCountAfterPitch(pitch) {
      if (!pitch) {
        return {
          balls: game.balls ?? 0,
          strikes: game.strikes ?? 0,
        }
      }
    
      let balls =
        pitch.balls_before ?? 0
    
      let strikes =
        pitch.strikes_before ?? 0
    
      if (pitch.result === "ball") {
        balls += 1
      }
    
      if (
        pitch.result === "calledStrike" ||
        pitch.result === "swingingStrike"
      ) {
        strikes += 1
      }
    
      if (
        pitch.result === "foul" &&
        strikes < 2
      ) {
        strikes += 1
      }
    
      return {
        balls,
        strikes,
      }
    }
    
    const liveCount =
      getCountAfterPitch(latestPitch)

      const defensiveTeam =
  game.half === "top"
    ? game.homeTeam
    : game.awayTeam

const defensiveSide =
  game.half === "top"
    ? "home"
    : "away"

const defensiveRoster =
  game.gameRoster?.[defensiveTeam] ?? []

  const latestPitchForGame =
  [...pitchEvents]
    .sort(
      (a, b) =>
        b.sequence - a.sequence
    )[0] ?? null

const currentPitcherId =
  game.defense?.[defensiveSide]?.P ??
  latestPitchForGame?.pitcher_id ??
  null

const currentPitcher =
  defensiveRoster.find(
    (player) =>
      player.id === currentPitcherId
  ) ?? null

  const pitchCount =
  currentPitcherId
    ? pitchEvents.filter(
        (pitch) =>
          pitch.pitcher_id === currentPitcherId
      ).length
    : 0

  function formatPitchResult(result) {
    const labels = {
      ball: "Ball",
      calledStrike: "Called Strike",
      swingingStrike:
        "Swinging Strike",
      foul: "Foul",
      inPlay: "In Play",
    }

    
  
    return labels[result] ?? result
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-4">

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm font-bold"
      >
        ← Scores
      </button>

      {/* <GameScoreCard
        game={gameRecord}
        status={
          gameRecord.status === "final"
            ? "final"
            : "live"
        }
      /> */}
      <section className="space-y-3">
        
        
      <LineScore game={game} /> 
    
      {isLive && (
  <section className="space-y-6">

{isLive && (
  <>
  <LiveGamePanel
    game={game}
    currentBatter={currentBatter}
    currentPitcher={currentPitcher}
    pitchCount={pitchCount}
    liveCount={liveCount}
    pitches={currentAtBatPitches}
  />

  <GameFeed
  limit={5}
   events={gameEvents}
  title="Game Feed"
  compact
/>
</>
)}

    {/* Current At Bat */}
    {/* <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <div className="scoreboard-label text-scoreboard-amber">
            At Bat
          </div>

          <h2 className="scoreboard-title mt-1 text-xl">
            #{currentBatter?.number || "—"}{" "}
            {currentBatter?.name ?? "Batter"}
          </h2>
        </div>

        <div className="text-right">
          <div className="scoreboard-label">
            Count
          </div>

          <div className="scoreboard-number text-2xl">
            {liveCount.balls}-
            {liveCount.strikes}
          </div>
        </div>
      </div>

      <div className="scoreboard-panel overflow-hidden">
        {currentAtBatPitches.length === 0 ? (
          <div className="p-4 text-sm opacity-60">
            No pitches recorded this at-bat.
          </div>
        ) : (
          [...currentAtBatPitches]
            .sort(
              (a, b) =>
                b.sequence - a.sequence
            )
            .map((pitch, index) => {
              const isLatest =
                index === 0

              return (
                <div
                  key={pitch.id}
                  className={`
                    flex
                    items-center
                    justify-between
                    border-b
                    border-scoreboard-cream/20
                    px-4 py-3
                    last:border-b-0
                    ${
                      isLatest
                        ? "bg-scoreboard-amber/10"
                        : ""
                    }
                  `}
                >
                  <div>
                    <div className="font-bold">
                      Pitch {pitch.sequence}
                    </div>

                    <div className="scoreboard-label mt-1 opacity-60">
                      {pitch.balls_before}-
                      {pitch.strikes_before}
                      {" "}before pitch
                    </div>
                  </div>

                  <div className="scoreboard-label text-scoreboard-amber">
                    {formatPitchResult(
                      pitch.result
                    )}
                  </div>
                </div>
              )
            })
        )}
      </div>
    </section> */}

  </section>
)}

  {/* <h2 className="scoreboard-title text-xl">
    Linescore
  </h2> */}

  

</section>

      <section className="space-y-4">
        <h2 className="scoreboard-title text-xl">
          Box Score
        </h2>

        <BoxScore
          title={game.awayTeam}
          lineup={awayLineup}
          gameStats={game.stats}
        />

        <BoxScore
          title={game.homeTeam}
          lineup={homeLineup}
          gameStats={game.stats}
        />

<section className="space-y-4">
  <h2 className="scoreboard-title text-xl">
    Pitching
  </h2>

  <PitchingBoxScore
    game={game}
    teamName={game.awayTeam}
  />

  <PitchingBoxScore
    game={game}
    teamName={game.homeTeam}
  />
</section>
      </section>

      <section className="space-y-3">
        <h2 className="scoreboard-title text-xl">
          Game Summary
        </h2>

        <GameSummary game={game} />
      </section>

    </main>
  )
}