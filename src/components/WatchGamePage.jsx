import {
    useEffect,
    useState,
  } from "react"
  
  import {
    useParams,
    useNavigate,
  } from "react-router-dom"
  
  import GameVideo from "../components/GameVideo"
  
  import {
    getGameById,
  } from "../services/gamesService"
  
  import {
    getGamePitchEvents,
  } from "../services/pitchEventsService"
  
  import { supabase } from "../lib/supabase"
  
  export default function WatchGamePage() {
    const { gameId } = useParams()
  
    const navigate = useNavigate()
  
    const [gameRecord, setGameRecord] =
      useState(null)
  
    const [pitchEvents, setPitchEvents] =
      useState([])
  
    const [loading, setLoading] =
      useState(true)
  
    /*
     * INITIAL LOAD
     */
    useEffect(() => {
      if (!gameId) return
  
      async function loadGame() {
        try {
          const [
            gameResult,
            pitchResult,
          ] = await Promise.all([
            getGameById(gameId),
            getGamePitchEvents(gameId),
          ])
  
          setGameRecord(gameResult)
          setPitchEvents(pitchResult)
        } catch (error) {
          console.error(
            "Could not load watch game:",
            error
          )
        } finally {
          setLoading(false)
        }
      }
  
      loadGame()
    }, [gameId])
  
    /*
     * LIVE GAME STATE
     */
    useEffect(() => {
      if (!gameId) return
  
      const channel = supabase
        .channel(`watch-game-${gameId}`)
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
              "WATCH GAME UPDATE:",
              payload.new
            )
  
            setGameRecord(payload.new)
          }
        )
        .subscribe()
  
      return () => {
        supabase.removeChannel(channel)
      }
    }, [gameId])
  
    /*
     * LIVE PITCH EVENTS
     */
    useEffect(() => {
      if (!gameId) return
  
      const channel = supabase
        .channel(`watch-pitches-${gameId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "pitch_events",
            filter: `game_id=eq.${gameId}`,
          },
          (payload) => {
            const newPitch =
              payload.new
  
            setPitchEvents((current) => {
              const exists =
                current.some(
                  (pitch) =>
                    pitch.id === newPitch.id
                )
  
              if (exists) {
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
        .subscribe()
  
      return () => {
        supabase.removeChannel(channel)
      }
    }, [gameId])
  
    if (loading) {
      return (
        <main
          className="
            min-h-screen
            bg-black
            p-6
            text-white
          "
        >
          Loading stream...
        </main>
      )
    }
  
    if (!gameRecord) {
      return (
        <main
          className="
            min-h-screen
            bg-black
            p-6
            text-white
          "
        >
          Game not found.
        </main>
      )
    }
  
    /*
     * Your games table stores the actual
     * GameOn state inside state/game_state.
     */
    const game =
      gameRecord.state ??
      gameRecord.game_state ??
      {}
  
    /*
     * CURRENT BATTER
     */
    const battingTeam =
      game.half === "top"
        ? game.awayTeam
        : game.homeTeam
  
    const battingLineup =
      game.lineups?.[battingTeam] ?? []
  
    const battingIndex =
      game.battingIndex?.[battingTeam] ?? 0
  
    const currentBatter =
      battingLineup[battingIndex] ?? null
  
    /*
     * DEFENSIVE TEAM
     */
    const defensiveSide =
      game.half === "top"
        ? "home"
        : "away"
  
    const defensiveTeam =
      game.half === "top"
        ? game.homeTeam
        : game.awayTeam
  
    const defensiveRoster =
      game.gameRoster?.[
        defensiveTeam
      ] ?? []
  
    /*
     * LATEST PITCH
     */
    const latestPitch =
      [...pitchEvents]
        .sort(
          (a, b) =>
            (b.sequence ?? 0) -
            (a.sequence ?? 0)
        )[0] ?? null
  
    /*
     * CURRENT PITCHER
     *
     * Primary source:
     * defensive alignment
     *
     * Fallback:
     * latest recorded pitch
     */
    const currentPitcherId =
      game.defense?.[
        defensiveSide
      ]?.P ??
      latestPitch?.pitcher_id ??
      null
  
    const currentPitcher =
      defensiveRoster.find(
        (player) =>
          player.id ===
          currentPitcherId
      ) ?? null
  
    /*
     * PITCH COUNT
     */
    const pitchCount =
      currentPitcherId
        ? pitchEvents.filter(
            (pitch) =>
              pitch.pitcher_id ===
              currentPitcherId
          ).length
        : 0
  
    /*
     * LIVE COUNT
     *
     * We derive this from the latest pitch event
     * because the watch screen receives pitches
     * independently from the scorer.
     */
    const liveCount =
      getCountAfterPitch(
        latestPitch,
        game
      )
  
    return (
      <main className="min-h-screen bg-black text-white">
        {/* TOP BAR */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-4
            py-3
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.12em]
              text-white/70
              hover:text-white
            "
          >
            ← Back
          </button>
  
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-black
              uppercase
              tracking-[0.12em]
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />
  
            Live
          </div>
        </div>
  
        {/* VIDEO */}
        <div className="mx-auto max-w-7xl">
          <GameVideo
            videoSrc="/video/test-game.mp4"
            game={game}
            currentBatter={
              currentBatter
            }
            currentPitcher={
              currentPitcher
            }
            pitchCount={
              pitchCount
            }
            liveCount={
              liveCount
            }
            controls
          />
        </div>
      </main>
    )
  }
  
  function getCountAfterPitch(
    pitch,
    game
  ) {
    /*
     * If we don't have a pitch yet,
     * fall back to persisted game state.
     */
    if (!pitch) {
      return {
        balls:
          game.balls ?? 0,
  
        strikes:
          game.strikes ?? 0,
      }
    }
  
    let balls =
      pitch.balls_before ?? 0
  
    let strikes =
      pitch.strikes_before ?? 0
  
    if (
      pitch.result === "ball"
    ) {
      balls += 1
    }
  
    if (
      pitch.result ===
        "calledStrike" ||
      pitch.result ===
        "swingingStrike"
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