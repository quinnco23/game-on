import React, {
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"

import { gameReducer } from "../state/gameReducer";
import { initialGame } from "../state/initialGame";
import {
  getActiveGame,
  getFinishedGames,
  finishGame,
} from "../services/gamesService";

import {

  updateGameState,
} from "../services/gamesService"

import { HomeScreen } from "./HomeScreen";
import { CountControls } from "./CountControls";
import GameSetupScreen from "./GameSetupScreen";
import { Scoreboard } from "./Scoreboard";
// import { BaseDiamond } from "./BaseDiamond"
import { PlayControls } from "./PlayControls";
import { EventFeed } from "./EventFeed";
import { Button } from "./ui/button";
import { GameSummary } from "./GameSummary";
import { BoxScore } from "./BoxScore";
import { PlayResolutionDialog } from "./PlayResolutionDialog";
import { getCurrentBatter } from "../state/gameLogic";
import { handleGameAction } from "../services/gameActions";
import { OutResultDialog } from "./OutResultDialog";
import { BaseRunnersField } from "./BaseRunnersField";
import { resolveRunnerMovement } from "@/scoring/runnerEngine";
import { applyPlay } from "../scoring/playEngine";
import { getForcedAdvanceDecisions } from "@/scoring/getForcedAdvanceDecisions";
import { createOutPlayEvent } from "../scoring/createOutPlayEvent"
import { DefenseAlignment } from "./DefenseAlignment"
import { DefensiveAlignmentField } from "./DefensiveAlignmentField";

import { PitcherChangeDialog } from "./PitcherChangeDialog";
import {
  createPitchEvent,
  PITCH_RESULTS,
} from "../scoring/pitchEvent"
import { TeamScreen } from "./TeamScreen";
import { useNavigate } from "react-router-dom"
// import { savePitchEvent } from "@/services/pitchEventsService";

import {
  derivePitchCountStats,
  
} from "../scoring/pitchEvent"

import {
  getGamePitchEvents,
   savePitchEvent,
 } from "@/services/pitchEventsService"

 import {
  GameClock,
} from "./GameClock"
import { GameFeed } from "./GameFeed";

// function FieldBase({ runner, label, className = "" }) {
//   const occupied = Boolean(runner);


//   return (
//     <div className={className}>
//       <div
//         className={[
//           "ballpark-base",
//           occupied ? "ballpark-base-occupied" : "ballpark-base-empty",
//         ].join(" ")}
//         title={
//           occupied ? `${runner.name || "Runner"} on ${label}` : `${label} empty`
//         }
//       >
//         <span className="ballpark-base-label">{label}</span>
//       </div>

//       {occupied && (
//         <div
//           className="
//             absolute left-1/2 top-10 w-24 -translate-x-1/2
//             truncate text-center font-heading text-[9px]
//             font-bold uppercase tracking-wide text-scoreboard-cream
//           "
//         >
//           {runner.name}
//         </div>
//       )}
//     </div>
//   );
// }

function createPersistedGameSnapshot(game) {
  return {
    ...game,

    // These live in their own tables
    pitchEvents: [],
    events: [],

    // Never persist the in-memory undo stack
    history: [],
  }
}
   
export default function TapScorePrototype() {
  const [game, dispatch] = useReducer(gameReducer, initialGame);
  console.log(
    "BATTER STATS:",
    game.stats?.batters
  )
  
  console.log(
    "FIELDER STATS:",
    game.stats?.fielders


  )

  console.log(
    "PITCHER STATS:",
    game.stats?.pitchers
  )

  console.log("GAME LINEUPS:", game.lineups)
  const [pendingHitType, setPendingHitType] = useState(null);

  const [screen, setScreen] = useState("home");
  const [activeGame, setActiveGame] = useState(null);
  const [finishedGames, setFinishedGames] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showVoiceConfirm, setShowVoiceConfirm] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [showOutResultDialog, setShowOutResultDialog] = useState(false);
  const [showPitcherChange, setShowPitcherChange] =
  useState(false)
  const [selectedTeam, setSelectedTeam] =
  useState(null)
  const navigate = useNavigate()

  const saveInFlightRef =
  useRef(false)

const pendingGameRef =
  useRef(null)

  const [
    regulationComplete,
    setRegulationComplete,
  ] = useState(null)

  // useEffect(() => {
  //   const result = resolveRunnerMovement({
  //     bases: {
  //       first: null,
  //       second: null,
  //       third: null,
  //     },

  //     batter: {
  //       id: "1",
  //       name: "Jake",
  //     },

  //     batterDestination: "1B",
  //     runnerDecisions: {},
  //   })

  //   console.log("Runner engine result:", result)
  
  // }, [])

  

 const defensiveSide =
  game.half === "top"
    ? "home"
    : "away"

const defensiveTeamName =
  defensiveSide === "home"
    ? game.homeTeam
    : game.awayTeam

    const defensivePlayers =
  game.gameRoster?.[defensiveTeamName] ?? []

  const derivedDefense =
  Object.fromEntries(
    defensivePlayers
      .map((player) => [
        player.default_position ??
          player.position,
        player.id,
      ])
      .filter(([position]) => position)
  )

  

  const defensiveAlignment =
  Object.keys(
    game.defense?.[defensiveSide] ?? {}
  ).length > 0
    ? game.defense[defensiveSide]
    : derivedDefense


    const currentPitcherId =
    defensiveAlignment?.P ?? null

const currentPitcher =
  game.gameRoster?.[defensiveTeamName]
    ?.find(
      (player) =>
        player.id === currentPitcherId
    ) ?? null
   
    
   

    
  
 
    
    useEffect(() => {
      if (
        !game.id ||
        game.status !== "scoring"
      ) {
        return
      }
    
      pendingGameRef.current =
        game
    
      const timeoutId =
        setTimeout(async () => {
          if (saveInFlightRef.current) {
            return
          }
    
          saveInFlightRef.current =
            true
    
            try {
              while (
                pendingGameRef.current
              ) {
                const gameToSave =
                  pendingGameRef.current
            
                pendingGameRef.current =
                  null
            
                console.time(
                  "GAME SNAPSHOT SAVE"
                )
            
                console.log(
                  "SNAPSHOT SAVE START:",
                  {
                    operation:
                      "gameSnapshot",
            
                    gameId:
                      gameToSave.id,
            
                    inning:
                      gameToSave.inning,
            
                    half:
                      gameToSave.half,
            
                    version:
                      gameToSave.version,
            
                    online:
                      navigator.onLine,
                  }
                )
            
                const snapshot =
                  createPersistedGameSnapshot(
                    gameToSave
                  )
            
                await updateGameState(
                  snapshot.id,
                  snapshot
                )
            
                console.log(
                  "SNAPSHOT SAVE OK:",
                  {
                    gameId:
                      snapshot.id,
            
                    inning:
                      snapshot.inning,
            
                    half:
                      snapshot.half,
            
                    version:
                      snapshot.version,
                  }
                )
            
                console.timeEnd(
                  "GAME SNAPSHOT SAVE"
                )
              }
            } catch (error) {
              console.error(
                "SNAPSHOT SAVE FAILED:",
                {
                  operation:
                    "gameSnapshot",
            
                  gameId:
                    game?.id,
            
                  inning:
                    game?.inning,
            
                  half:
                    game?.half,
            
                  version:
                    game?.version,
            
                  online:
                    navigator.onLine,
            
                  errorName:
                    error?.name,
            
                  errorMessage:
                    error?.message,
            
                  error,
                }
              )
            
              console.error(
                "Could not persist game state:",
                error
              )
            } finally {
              saveInFlightRef.current =
                false
            }
        }, 400)
    
      return () => {
        clearTimeout(timeoutId)
      }
    }, [game])

      useEffect(() => {
        async function loadHomeData() {
          try {
            const [currentGame, completedGames] = await Promise.all([
              getActiveGame(),
              getFinishedGames(),
            ]);
      
            console.log("Active game:", currentGame);
            console.log("Finished games:", completedGames);
      
            setActiveGame(currentGame);
            setFinishedGames(completedGames);
          } catch (error) {
            console.error("Could not load game data:", error);
          } finally {
            setLoading(false);
          }
        }
      
        loadHomeData();
      }, []);

    
      const currentPitchCount =
      currentPitcherId
        ? (game.pitchEvents ?? []).filter(
            (pitch) =>
              (
                pitch.pitcherId ??
                pitch.pitcher_id
              ) === currentPitcherId
          ).length
        : 0

  if (loading) {
    return (
      <main className="min-h-screen bg-green-950 text-white p-4">
        Loading...
      </main>
    );
  }

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  console.log("PITCH COUNT DEBUG:", {
    currentPitcherId,
    currentPitchCount,
  
    pitchEvents:
      (game.pitchEvents ?? []).map(
        (pitch) => ({
          id: pitch.id,
          pitcherId: pitch.pitcherId,
          pitcher_id: pitch.pitcher_id,
          result: pitch.result,
        })
      ),
  })

  if (screen === "home") {
    return (
      <HomeScreen
        activeGame={activeGame}
        onTeams={() => navigate("/teams")}
        finishedGames={finishedGames}
        onResume={async (selectedGame) => {
          const savedState =
            selectedGame.state ??
            selectedGame.game_state
        
          if (!savedState) {
            console.error(
              "Active game has no saved state:",
              selectedGame
            )
        
            alert(
              "This game does not contain a saved game state."
            )
        
            return
          }
        
          try {
            const persistedPitches =
              await getGamePitchEvents(
                selectedGame.id
              )
        
            const restoredPitchEvents =
              persistedPitches.map(
                (pitch) => ({
                  ...pitch,
        
                  // Normalize DB names back to
                  // the local GameOn shape.
                  pitcherId:
                    pitch.pitcher_id,
        
                  batterId:
                    pitch.batter_id,
        
                  ballsBefore:
                    pitch.balls_before,
        
                  strikesBefore:
                    pitch.strikes_before,
        
                  outsBefore:
                    pitch.outs_before,
                })
              )
        
            dispatch({
              type: "LOAD_GAME",
        
              game: {
                ...savedState,
        
                pitchEvents:
                  restoredPitchEvents,
              },
            })
        
            setActiveGame(selectedGame)
            setScreen("scoring")
          } catch (error) {
            console.error(
              "Could not resume pitch history:",
              error
            )
        
            alert(
              error.message ||
                "Could not resume game"
            )
          }
        }}
        onNewGame={() => {
          dispatch({
            type: "LOAD_GAME",
            game: initialGame,
          });
          setScreen("setup");
        }}
        onViewFinished={(finishedGame) => {
          dispatch({
            type: "LOAD_GAME",
            game: finishedGame.state,
          });
          setScreen("summary");
        }}
      />
    );
  }

  if (screen === "teams") {
    return (
      <TeamScreen
        onBack={() => setScreen("home")}
        onSelectTeam={(team) => {
          setSelectedTeam(team)
          setScreen("team")
        }}
      />
    )
  }

  if (screen === "setup" || game.status === "setup") {
    return (
      <GameSetupScreen
      game={game}
      onStart={(payload) => {
        console.log("START GAME PAYLOAD:", payload)
    
        dispatch({
          type: "START_GAME",
          ...payload,
        })
    
        setScreen("scoring")
      }}
    />
    );
  }

  if (screen === "summary" || game.status === "summary") {
    return <GameSummary game={game} onRestart={() => setScreen("home")} />;
  }
  async function handleUndo() {
    const confirmed = window.confirm("Undo the last play?");

    if (!confirmed) return;

    dispatch({
      type: "UNDO",
    });
  }

  async function handleStolenBase(from, to) {
    try {
      const runner = game.bases?.[from];

      if (!runner) {
        throw new Error(`There is no runner on ${from}.`);
      }

      const engineGameState = {
        ...game,

        score: {
          home: game.score?.[game.homeTeam] ?? 0,

          away: game.score?.[game.awayTeam] ?? 0,
        },

        version: game.version ?? 0,

        gameRules: game.gameRules,

runsThisHalf:
  game.runsThisHalf ?? 0,
      };

      const playEvent = {
        id: crypto.randomUUID(),
        playType: "stolenBase",

        // Current batter remains at bat, but receives no stats.
        batter: getCurrentBatter(game),

        runnerDecisions: {
          [from]: to,
        },

        metadata: {
          runnerId: runner.id,
          runnerName: runner.name,
          from,
          to,
        },
      };

      const result = applyPlay(engineGameState, playEvent);

      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ?? "Could not record the stolen base."
        );
      }
      result.state = {
        ...result.state,
      
        score: {
          [game.homeTeam]:
            result.state.score?.home ?? 0,
      
          [game.awayTeam]:
            result.state.score?.away ?? 0,
        },
      }

      await handleGameAction({
        game,
        dispatch,

        action: {
          type: "APPLY_PLAY_RESULT",
          result,

          // Do not accumulate batter stats for a runner event.
          batterId: null,

          pitcherId: game.currentPitcher?.id ?? game.pitcher?.id ?? null,

          label: `Stolen base - ${runner.name} to ${to}`,
        },

        eventType: "stolenBase",

        label: `Stolen base - ${runner.name} to ${to}`,

        extraEventData: {
          player_id: runner.id,
          runs: result.metadata?.runsScored ?? 0,
          rbi: 0,
          outs_recorded: 0,

          details: {
            playId: playEvent.id,
            runnerId: runner.id,
            from,
            to,
            runnerAdvances: result.metadata?.runnerAdvances,
          },
        },
      });
    } catch (error) {
      console.error("Could not record stolen base:", error);

      alert(error.message || "Could not record stolen base");
    }
  }

  async function handlePassedBall(from, to) {
    try {
      const runner = game.bases?.[from];

      if (!runner) {
        throw new Error(`There is no runner on ${from}.`);
      }

      const engineGameState = {
        ...game,

        score: {
          home: game.score?.[game.homeTeam] ?? 0,

          away: game.score?.[game.awayTeam] ?? 0,
        },

        version: game.version ?? 0,
      };

      const playEvent = {
        id: crypto.randomUUID(),
        playType: "passedBall",

        batter: getCurrentBatter(game),

        runnerDecisions: {
          [from]: to,
        },

        metadata: {
          runnerId: runner.id,
          runnerName: runner.name,
          from,
          to,
          advancementReason: "passedBall",
        },
      };

     

      const result = applyPlay(engineGameState, playEvent);

      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ?? "Could not record the passed ball."
        );
      }

      result.state = {
        ...result.state,
      
        score: {
          [game.homeTeam]:
            result.state.score?.home ?? 0,
      
          [game.awayTeam]:
            result.state.score?.away ?? 0,
        },
      }

      const label =
        to === "home"
          ? `Passed ball - ${runner.name} scores`
          : `Passed ball - ${runner.name} to ${to}`;

      await handleGameAction({
        game,
        dispatch,

        action: {
          type: "APPLY_PLAY_RESULT",
          result,

          // Runner event; do not credit the batter.
          batterId: null,

          pitcherId: game.currentPitcher?.id ?? game.pitcher?.id ?? null,

          label,
        },

        eventType: "passedBall",
        label,

        extraEventData: {
          player_id: runner.id,

          runs: result.metadata?.runsScored ?? 0,

          rbi: 0,
          outs_recorded: 0,

          details: {
            playId: playEvent.id,
            runnerId: runner.id,
            from,
            to,
            advancementReason: "passedBall",
            runnerAdvances: result.metadata?.runnerAdvances,
          },
        },
      });
    } catch (error) {
      console.error("Could not record passed ball:", error);

      alert(error.message || "Could not record passed ball");
    }
  }

  async function handleWildPitch(from, to) {
    try {
      const runner = game.bases?.[from];

      if (!runner) {
        throw new Error(`There is no runner on ${from}.`);
      }

      const engineGameState = {
        ...game,

        score: {
          home: game.score?.[game.homeTeam] ?? 0,

          away: game.score?.[game.awayTeam] ?? 0,
        },

        version: game.version ?? 0,
      };

      const playEvent = {
        id: crypto.randomUUID(),
        playType: "wildPitch",

        batter: getCurrentBatter(game),

        runnerDecisions: {
          [from]: to,
        },

        metadata: {
          runnerId: runner.id,
          runnerName: runner.name,
          from,
          to,
          advancementReason: "wildPitch",
        },
      };

      const result = applyPlay(engineGameState, playEvent);

      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ?? "Could not record the wild pitch."
        );
      }

      const label =
        to === "home"
          ? `Wild pitch - ${runner.name} scores`
          : `Wild pitch - ${runner.name} to ${to}`;

      await handleGameAction({
        game,
        dispatch,

        action: {
          type: "APPLY_PLAY_RESULT",
          result,
          batterId: null,

          pitcherId: game.currentPitcher?.id ?? game.pitcher?.id ?? null,

          label,
        },

        eventType: "wildPitch",
        label,

        extraEventData: {
          player_id: runner.id,
          runs: result.metadata?.runsScored ?? 0,
          rbi: 0,
          outs_recorded: 0,

          details: {
            playId: playEvent.id,
            runnerId: runner.id,
            from,
            to,
            advancementReason: "wildPitch",
            runnerAdvances: result.metadata?.runnerAdvances,
          },
        },
      });
    } catch (error) {
      console.error("Could not record wild pitch:", error);

      alert(error.message || "Could not record wild pitch");
    }
  }

  async function handleHitByPitch() {
    try {
      const batter = getCurrentBatter(game);

      if (!batter) {
        throw new Error("Could not identify the current batter.");
      }

      const runnerDecisions = getForcedAdvanceDecisions(game.bases);

      const engineGameState = {
        ...game,

        score: {
          home: game.score?.[game.homeTeam] ?? 0,
          away: game.score?.[game.awayTeam] ?? 0,
        },

        bases: game.bases ?? {
          first: null,
          second: null,
          third: null,
        },

        inning: game.inning ?? 1,
        half: game.half ?? "top",
        outs: game.outs ?? 0,
        version: game.version ?? 0,
      };

      const playEvent = {
        id: crypto.randomUUID(),
        playType: "hitByPitch",
        batter,
        runnerDecisions,

        metadata: {
          resultType: "hitByPitch",
        },
      };

      const result = applyPlay(engineGameState, playEvent);

      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ?? "Could not record hit by pitch."
        );
      }

      const label = `Hit by pitch - ${batter.name}`;

      await handleGameAction({
        game,
        dispatch,

        action: {
          type: "APPLY_PLAY_RESULT",
          result,
          batterId: batter.id,

          pitcherId: game.currentPitcher?.id ?? game.pitcher?.id ?? null,

          label,
        },

        eventType: "hitByPitch",
        label,

        extraEventData: {
          player_id: batter.id,
          runs: result.metadata?.runsScored ?? 0,
          rbi: result.metadata?.rbiCount ?? 0,
          outs_recorded: 0,

          details: {
            playId: playEvent.id,
            runnerDecisions,
            runnerAdvances: result.metadata?.runnerAdvances,
          },
        },
      });
    } catch (error) {
      console.error("Could not record hit by pitch:", error);

      alert(error.message || "Could not record hit by pitch");
    }
  }
  async function handleCaughtStealing(from) {
    try {
      const runner = game.bases?.[from];

      if (!runner) {
        throw new Error(`There is no runner on ${from}.`);
      }

      const engineGameState = {
        ...game,

        score: {
          home: game.score?.[game.homeTeam] ?? 0,

          away: game.score?.[game.awayTeam] ?? 0,
        },

        bases: game.bases ?? {
          first: null,
          second: null,
          third: null,
        },

        inning: game.inning ?? 1,
        half: game.half ?? "top",
        outs: game.outs ?? 0,
        version: game.version ?? 0,
      };

      const playEvent = {
        id: crypto.randomUUID(),
        playType: "caughtStealing",

        batter: getCurrentBatter(game),

        runnerDecisions: {
          [from]: "out",
        },

        metadata: {
          runnerId: runner.id,
          runnerName: runner.name,
          from,
          to: "out",
        },
      };

      const result = applyPlay(engineGameState, playEvent);

      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ?? "Could not record caught stealing."
        );
      }

      const destinationLabel = {
        first: "second",
        second: "third",
        third: "home",
      }[from];

      const label = `Caught stealing ${destinationLabel} - ${runner.name}`;

      await handleGameAction({
        game,
        dispatch,

        action: {
          type: "APPLY_PLAY_RESULT",
          result,

          batterId: null,

          pitcherId: game.currentPitcher?.id ?? game.pitcher?.id ?? null,

          label,
        },

        eventType: "caughtStealing",
        label,

        extraEventData: {
          player_id: runner.id,
          runs: 0,
          rbi: 0,

          outs_recorded: result.metadata?.outsRecorded ?? 1,

          details: {
            playId: playEvent.id,
            runnerId: runner.id,
            from,
            to: "out",
            runnerAdvances: result.metadata?.runnerAdvances,
          },
        },
      });
    } catch (error) {
      console.error("Could not record caught stealing:", error);

      alert(error.message || "Could not record caught stealing");
    }
  }

  async function handlePickoff(from, runnerOut) {
    try {
      const runner = game.bases?.[from]
  
      if (!runner) {
        throw new Error(`There is no runner on ${from}.`)
      }
  
      const engineGameState = {
        ...game,
  
        score: {
          home: game.score?.[game.homeTeam] ?? 0,
          away: game.score?.[game.awayTeam] ?? 0,
        },
  
        bases: game.bases ?? {
          first: null,
          second: null,
          third: null,
        },
  
        inning: game.inning ?? 1,
        half: game.half ?? "top",
        outs: game.outs ?? 0,
        version: game.version ?? 0,
      }
  
      const playEvent = {
        id: crypto.randomUUID(),
        playType: "pickoff",
  
        batter: getCurrentBatter(game),
  
        runnerDecisions:
          runnerOut
            ? {
                [from]: "out",
              }
            : {},
  
        metadata: {
          runnerId: runner.id,
          runnerName: runner.name,
          from,
          to: runnerOut ? "out" : from,
          runnerOut,
        },
      }
  
      const result = applyPlay(
        engineGameState,
        playEvent,
      )
  
      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ??
            "Could not record pickoff.",
        )
      }
  
      const label =
        runnerOut
          ? `Pickoff - ${runner.name} out at ${from}`
          : `Pickoff attempt - ${runner.name} safe at ${from}`
  
      await handleGameAction({
        game,
        dispatch,
  
        action: {
          type: "APPLY_PLAY_RESULT",
          result,
  
          batterId: null,
  
          pitcherId:
            game.currentPitcher?.id ??
            game.pitcher?.id ??
            null,
  
          label,
        },
  
        eventType: "pickoff",
        label,
  
        extraEventData: {
          player_id: runner.id,
  
          runs: 0,
          rbi: 0,
  
          outs_recorded:
            result.metadata?.outsRecorded ?? 0,
  
          details: {
            playId: playEvent.id,
            runnerId: runner.id,
            from,
            runnerOut,
            runnerAdvances:
              result.metadata?.runnerAdvances,
          },
        },
      })
    } catch (error) {
      console.error(
        "Could not record pickoff:",
        error,
      )
  
      alert(
        error.message ||
          "Could not record pickoff"
      )
    }
  }

  

  async function handlePitch(result) {
    console.log(
      "HANDLE PITCH FIRED:",
      result
    )

    if (
      !game.gameClock?.startedAt
    ) {
      dispatch({
        type: "START_GAME_CLOCK",
        startedAt:
          new Date().toISOString(),
      })
    }
  
    const batter =
      getCurrentBatter(game)
  
    const label =
      getPitchLabel(
        result,
        game,
        batter
      )
  
    const activeDefensiveSide =
      game.half === "top"
        ? "home"
        : "away"
  
    const activePitcherId =
      game.defense?.[activeDefensiveSide]?.P ??
      defensiveAlignment?.P ??
      null

      console.log(
        "PITCHER BEING SAVED:",
        activePitcherId
      )
    
  
      const pitchEvent = {
        ...createPitchEvent({
          pitcherId: activePitcherId,
      
          batterId:
            batter?.id ?? null,
      
          result,
      
          inning:
            game.inning,
      
          half:
            game.half,
        }),
      
        label,
      
        batter: batter
          ? {
              id: batter.id,
              number: batter.number,
              name: batter.name,
            }
          : null,
      
        ballsBefore:
          game.balls ?? 0,
      
        strikesBefore:
          game.strikes ?? 0,
      }
  
    const pitchStats =
      derivePitchCountStats(result)
  
    dispatch({
      type: "PITCH_EVENT",
      pitchEvent,
      pitcherId: activePitcherId,
      pitcherStats: pitchStats,
    })
  
    try {
      await savePitchEvent({
        id: pitchEvent.id,
  
        gameId:
          game.gameId ??
          game.id,
  
        pitcherId:
          activePitcherId,
  
        batterId:
          batter?.id ?? null,
  
        sequence:
          (game.pitchEvents?.length ?? 0) + 1,
  
        inning:
          game.inning ?? 1,
  
        half:
          game.half ?? "top",
  
        ballsBefore:
          game.balls ?? 0,
  
        strikesBefore:
          game.strikes ?? 0,
  
        outsBefore:
          game.outs ?? 0,
  
        result,
        source: "manual",
      })
    } catch (error) {
      console.error(
        "Could not persist pitch:",
        error
      )
    }
  }

  function getPitchLabel(result, game, batter) {
    const number =
      batter?.number
        ? `#${batter.number} `
        : ""
  
    const name =
      batter?.name ?? "Batter"
  
    if (result === PITCH_RESULTS.BALL) {
      return `Ball ${
        (game.balls ?? 0) + 1
      } to ${number}${name}`
    }
  
    if (
      result ===
      PITCH_RESULTS.CALLED_STRIKE
    ) {
      return `Called Strike ${
        (game.strikes ?? 0) + 1
      } to ${number}${name}`
    }
  
    if (
      result ===
      PITCH_RESULTS.SWINGING_STRIKE
    ) {
      return `Swinging Strike ${
        (game.strikes ?? 0) + 1
      } to ${number}${name}`
    }
  
    if (result === PITCH_RESULTS.FOUL) {
      return `Foul to ${number}${name}`
    }
  
    if (
      result === PITCH_RESULTS.IN_PLAY
    ) {
      return `Ball in play - ${number}${name}`
    }
  
    return `${result} - ${number}${name}`
  }
  async function handleStrikeoutPitch(strikeResult)  {
    try {
      const batter = getCurrentBatter(game)
  
      if (!batter) {
        throw new Error(
          "Could not identify the current batter."
        )
      }
  
      // First: record pitch #3.
      handlePitch(strikeResult)

  
      const engineGameState = {
        ...game,
  
        score: {
          home:
            game.score?.[game.homeTeam] ?? 0,
  
          away:
            game.score?.[game.awayTeam] ?? 0,
        },
  
        bases: game.bases ?? {
          first: null,
          second: null,
          third: null,
        },
  
        inning: game.inning ?? 1,
        half: game.half ?? "top",
        outs: game.outs ?? 0,
        version: game.version ?? 0,
      }
  
      const playEvent = {
        id: crypto.randomUUID(),
  
        playType: "strikeout",
  
        batter,
  
        runnerDecisions: {},
  
        metadata: {
          resultType: "strikeout",
        },
      }
  
      const result = applyPlay(
        engineGameState,
        playEvent
      )
  
      if (!result.ok) {
        throw new Error(
          result.errors?.[0]?.message ??
            "Could not record strikeout."
        )
      }
  
      await handleGameAction({
        game,
        dispatch,
  
        action: {
          type: "APPLY_PLAY_RESULT",
  
          result,
  
          batterId: batter.id,
  
          pitcherId:
            game.defense?.[defensiveSide]?.P ??
            derivedDefense?.P ??
            null,
  
          label: `Strikeout - ${batter.name}`,
        },
  
        eventType: "strikeout",
  
        label: `Strikeout - ${batter.name}`,
  
        extraEventData: {
          player_id: batter.id,
          runs: 0,
          rbi: 0,
  
          outs_recorded:
            result.metadata?.outsRecorded ?? 1,
  
          details: {
            playId: playEvent.id,
          },
        },
      })
    } catch (error) {
      console.error(
        "Could not record strikeout:",
        error
      )
  
      alert(
        error.message ||
          "Could not record strikeout"
      )
    }
  }
  async function handleEndAtRegulation() {
    if (!regulationComplete) {
      return
    }
  
    const {
      result,
      batterId,
      pitcherId,
    } = regulationComplete
  
    const endedAt =
      new Date().toISOString()
  
    const finalResult = {
      ...result,
  
      state: {
        ...result.state,
  
        // Keep the game at the completed
        // bottom of regulation.
        inning:
          game.gameRules?.innings ?? 6,
  
        half: "bottom",
  
        outs: 3,
  
        bases: {
          first: null,
          second: null,
          third: null,
        },
      },
    }
  
    dispatch({
      type: "APPLY_PLAY_RESULT",
      result: finalResult,
      batterId,
      pitcherId,
    })
  
    dispatch({
      type: "FINALIZE_GAME",
      reason: "regulation",
      endedAt,
    })
  
    setRegulationComplete(null)
  }

  function handleContinueExtraInnings() {
    if (!regulationComplete) {
      return
    }
  
    const {
      result,
      batterId,
      pitcherId,
    } = regulationComplete
  
    dispatch({
      type: "APPLY_PLAY_RESULT",
      result,
      batterId,
      pitcherId,
    })
  
    setRegulationComplete(null)
  }

  
  return (
    <main className="min-h-screen bg-green-950 text-white p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Scoreboard game={game} />

        <div className="scoreboard-panel p-4">
  <GameClock
    gameClock={game.gameClock}
    gameRules={game.gameRules}
  />
</div>
        <div className="relative">
  <BaseRunnersField 
  bases={game.bases} 
  batter={getCurrentBatter(game)}
  outs={game.outs}
  game={game}/>
{/* <pre className="text-xs bg-white p-2">
  {JSON.stringify(
    {
      defensiveTeam,
      defensivePlayers,
      defensiveAlignment,
    },
    null,
    2
  )}
</pre> */}
{/* <pre className="text-xs bg-white text-black p-2 overflow-auto">
  {JSON.stringify(
    {
      defensivePlayers,
      defensiveAlignment,
    },
    null,
    2
  )}
</pre> */}



<DefensiveAlignmentField
  defense={defensiveAlignment}
  players={defensivePlayers}
  pitchCount={currentPitchCount}
  
  onAssign={(position, playerId) => {
    dispatch({
      type: "SET_DEFENSIVE_POSITION",
      team: defensiveSide,
      position,
      playerId,
    })
  }}
  onPitcherChange={() => {
    console.log("OPENING PITCHER DIALOG")

    setShowPitcherChange(true)
  }}
  
/>
{showPitcherChange && (
  <PitcherChangeDialog
    currentPitcher={currentPitcher}
    players={defensivePlayers}
    
  pitchCount={currentPitchCount}
    onCancel={() =>
      setShowPitcherChange(false)
    }
    onSelect={(playerId) => {
      dispatch({
        type: "CHANGE_PITCHER",
        team: defensiveSide,
        playerId,
        currentDefense:
          defensiveAlignment,
      })

      setShowPitcherChange(false)
    }}
  />
)}
</div>
        {/* <DefenseAlignment
  team={defensiveTeam}
  players={defensivePlayers}
  defense={defensiveAlignment}
  onAssign={(position, playerId) => {
    dispatch({
      type: "SET_DEFENSIVE_POSITION",
      team: defensiveTeam,
      position,
      playerId,
    })
  }}
/> */}

<CountControls
  game={game}
  dispatch={dispatch}

  onBall={() => {
    handlePitch(PITCH_RESULTS.BALL)

    dispatch({
      type: "BALL",
    })
  }}

  onCalledStrike={() => {
    handlePitch(
      PITCH_RESULTS.CALLED_STRIKE
    )

    dispatch({
      type: "STRIKE",
    })
  }}

  onSwingingStrike={() => {
    handlePitch(
      PITCH_RESULTS.SWINGING_STRIKE
    )

    dispatch({
      type: "STRIKE",
    })
  }}

  onFoul={() => {
    handlePitch(PITCH_RESULTS.FOUL)

    dispatch({
      type: "FOUL",
    })
  }}

  onInPlay={() => {
  handlePitch(PITCH_RESULTS.IN_PLAY)
}}

  onStrikeout={handleStrikeoutPitch}
/>

        <PlayControls
          game={game}
          dispatch={dispatch}
          onVoice={() => setShowVoiceConfirm(true)}
          onFakeAudioAssist={() => setShowAudioPrompt(true)}
          onOpenOutDialog={() => setShowOutResultDialog(true)}
          onOpenPlayResolution={(playType) => setPendingHitType(playType)}
          onUndo={handleUndo}
          onStolenBase={handleStolenBase}
          onPassedBall={handlePassedBall}
          onWildPitch={handleWildPitch}
          onHitByPitch={handleHitByPitch}
          onCaughtStealing={handleCaughtStealing}
          onPickoff={handlePickoff}
        />

        {pendingHitType && (
          <PlayResolutionDialog
            playType={pendingHitType}
            batter={getCurrentBatter(game)}
            bases={game.bases}
            onCancel={() => setPendingHitType(null)}
            onConfirm={async (resolution) => {
              try {
                const batter = getCurrentBatter(game);

                if (!batter) {
                  throw new Error("No current batter was found.");
                }

                /*
                 * Adapt the existing UI state to the scoring-engine state.
                 *
                 * Your UI currently stores scores using team names:
                 * score[game.homeTeam]
                 *
                 * The engine currently expects:
                 * score.home / score.away
                 */
                const engineGameState = {
                  ...game,

                  score: {
                    home: game.score?.[game.homeTeam] ?? 0,
                    away: game.score?.[game.awayTeam] ?? 0,
                  },

                  bases: game.bases ?? {
                    first: null,
                    second: null,
                    third: null,
                  },

                  inning: game.inning ?? 1,
                  half: game.half ?? "top",
                  outs: game.outs ?? 0,
                  version: game.version ?? 0,
                };

                const playEvent = {
                  id: crypto.randomUUID(),
                  playType: resolution.playType,
                  batter,

                  runnerDecisions: resolution.runnerDecisions ?? {},

                  metadata: {
                    ...(resolution.details ?? {}),

                    batterDestination: resolution.batterDestination,

                    notation: resolution.notation,

                    fielding: resolution.fielding,

                    doublePlay: resolution.doublePlay === true,

                    triplePlay: resolution.triplePlay === true,
                  },
                };

                const result = applyPlay(engineGameState, playEvent, {
                  thirdOut: resolution.thirdOut,
                });

                console.log("Ground-out batter stats:", {
                  batterId: batter.id,
                  playDefinition: result.metadata.playDefinition,
                  batterStats: result.metadata.batterStats,
                });

                if (!result.ok) {
                  console.error(
                    "Play engine rejected the play:",
                    result.errors
                  );

                  throw new Error(
                    result.errors?.[0]?.message ??
                      "The play could not be scored."
                  );
                }

                console.log("Completed play result:", result);

                // await handleGameAction({
                //   game,
                //   dispatch,

                //   action: {
                //     type: "APPLY_PLAY_RESULT",

                //     result,

                //     batterId: batter.id,

                //     /*
                //      * This may remain undefined until the current
                //      * defensive pitcher is stored in game state.
                //      */
                //     pitcherId:
                //       game.currentPitcher?.id ??
                //       game.pitcher?.id ??
                //       null,
                //   },

                //   eventType: pendingHitType,

                //   label: `${pendingHitType} - ${batter.name}`,

                //   // extraEventData: {
                //   //   play_id: playEvent.id,
                //   //   player_id: batter.id,

                //   //   runs:
                //   //     result.metadata.runsScored,

                //   //   rbi:
                //   //     result.metadata.rbiCount,

                //   //   outs_recorded:
                //   //     result.metadata.outsRecorded,

                //   //   runner_advances:
                //   //     result.metadata.runnerAdvances,

                //   //    batter_stats:
                //   //      result.metadata.batterStats,

                //   //    pitcher_stats:
                //   //      result.metadata.pitcherStats,

                //   //    fielder_stats:
                //   //      result.metadata.fielderStats,

                //   //   details:
                //   //     result.metadata.event,
                //   // },

                //   extraEventData: {
                //     runs: result.metadata.runsScored,
                //     rbi: result.metadata.rbiCount,
                //     outs_recorded: result.metadata.outsRecorded,

                //     details: {
                //       ...result.metadata.event,
                //       playId: playEvent.id,
                //       runnerAdvances:
                //         result.metadata.runnerAdvances,
                //     },
                //   },
                // });

                await handleGameAction({
                  game,
                  dispatch,

                  action: {
                    type: "APPLY_PLAY_RESULT",
                    result,
                    batterId: batter.id,
                    pitcherId:
                      game.currentPitcher?.id ?? game.pitcher?.id ?? null,
                  },

                  eventType: resolution.playType,
label: `${resolution.playType} - ${batter.name}`,
                });

                setPendingHitType(null);

                setPendingHitType(null);
                setPendingHitType(null);
              } catch (error) {
                console.error("Could not resolve play:", error);

                alert(error.message || "Could not resolve play");
              }
            }}
          />
        )}

        {showOutResultDialog && (
          <OutResultDialog
          bases={game.bases}
          defense={defensiveAlignment}
          onCancel={() => setShowOutResultDialog(false)}
          onConfirm={async ({
              eventType,
              label,
              action,
              details,
              outsRecorded,
              
              
            }) => {
              try {
                /*
                 * Migrate ground outs through the new engine.
                 * Other out types temporarily keep using the old path.
                 */
                if (
                  eventType === "groundout" ||
                  eventType === "sacrificeBunt" ||
                  eventType === "popout" ||
                  eventType === "flyout" ||
                  eventType === "lineout" ||
                  eventType === "fielders_choice" ||
                  eventType === "error"
                ) {
                  const batter = getCurrentBatter(game);

                  if (!batter) {
                    throw new Error("Could not identify the current batter.");
                  }

                 

                  const enginePlayType =
                  eventType === "groundout" ||
                  eventType === "sacrificeBunt"
                    ? "groundOut"
                
                    : eventType === "flyout" ||
                      eventType === "lineout" ||
                      eventType === "popout"
                    ? "flyOut"
                
                    : eventType === "error"
                    ? "reachedOnError"
                
                    : "fielderChoice"

    const isDoublePlay =
  (
    eventType === "groundout" ||
    eventType === "flyout" ||
    eventType === "lineout"
  ) &&
  details.doublePlay === true;
                    

                  const engineGameState = {
                    ...game,

                    score: {
                      home: game.score?.[game.homeTeam] ?? 0,

                      away: game.score?.[game.awayTeam] ?? 0,
                    },

                    bases: game.bases ?? {
                      first: null,
                      second: null,
                      third: null,
                    },

                    inning: game.inning ?? 1,
                    half: game.half ?? "top",
                    outs: game.outs ?? 0,
                    version: game.version ?? 0,
                  };

                  const fielding =
                  details.fielding ?? {
                    putouts: [],
                    assists: [],
                    errors: [],
                  }

                  if (
                    eventType === "groundout" &&
                    isDoublePlay &&
                    !game.bases?.first
                  ) {
                    throw new Error(
                      "A standard ground-ball double play requires a runner on first."
                    );
                  }
                  if (
                    (
                      eventType === "flyout" ||
                      eventType === "lineout"
                    ) &&
                    isDoublePlay &&
                    !game.bases?.[details.retiredRunnerBase]
                  ) {
                    throw new Error(
                      `There is no runner on ${details.retiredRunnerBase}.`
                    );
                  }

                  const isFieldersChoice = eventType === "fielders_choice";

                  if (
                    isFieldersChoice &&
                    !game.bases?.[details.retiredRunnerBase]
                  ) {
                    throw new Error(
                      `There is no runner on ${details.retiredRunnerBase}.`
                    );
                  }

                  const isError = eventType === "error";
                 
                  const isSacrificeFly =
  eventType === "flyout" &&
  details.sacrifice === true

  const isSacrificeBunt =
  eventType === "sacrificeBunt" ||
  (
    eventType === "groundout" &&
    details.sacrifice === true
  )

  

  const runnerDecisions =
  isFieldersChoice
    ? {
        [details.retiredRunnerBase]: "out",
      }

    : isDoublePlay
    ? {
        [details.retiredRunnerBase]: "out",
        batter: "out",
      }

      : isError
      ? details.runnerDecisions ??
        getForcedAdvanceDecisions(game.bases)

    : (
        eventType === "groundout" ||
        eventType === "sacrificeBunt" ||
        eventType === "flyout" ||
        eventType === "lineout" ||
        eventType === "popout"
      )
    ? details.runnerDecisions ?? {}

    : {}

                  const batterDestination = isFieldersChoice
                    ? "first"
                    : isError
                    ? details.batterDestination ?? "first"
                    : undefined;

                  const playEvent = {
                    id: crypto.randomUUID(),
                    playType: enginePlayType,
                    batter,

                    batterDestination: isFieldersChoice
                      ? "first"
                      : isError
                      ? details.batterDestination ?? "first"
                      : undefined,

                    runnerDecisions,

                    metadata: {
                      ...details,
                      notation: details.notation,
                      fielding,
                      
                      sacrificeFly: isSacrificeFly,
                      sacrificeBunt: isSacrificeBunt,

                      doublePlay: isDoublePlay,
                      triplePlay: false,
                    },
                  };
                  console.log(
                    "PLAY EVENT FIELDING BEFORE ENGINE:",
                    playEvent.metadata.fielding
                  )

                  console.log("AIR DP DEBUG:", {
                    eventType,
                    doublePlayFromDialog:
                      details.doublePlay,
                    isDoublePlay,
                    retiredRunnerBase:
                      details.retiredRunnerBase,
                    runnerDecisions,
                    basesBefore: game.bases,
                    enginePlayType,
                  });

                  const result = applyPlay(engineGameState, playEvent);

                  console.log(
                    "BASES AFTER PLAY ENGINE:",
                    result.gameState?.bases ??
                      result.state?.bases ??
                      result
                  );

                  if (!result.ok) {
                    throw new Error(
                      result.errors?.[0]?.message ??
                        `Could not score the ${enginePlayType}.`
                    );
                  }

                  // Check whether this play completed regulation.
const regulationInnings =
game.gameRules?.innings ?? 6

const reachedEndOfRegulation =
game.inning === regulationInnings &&
game.half === "bottom" &&
result.metadata?.halfInningEnded === true

console.log(
"REGULATION CHECK:",
{
  regulationInnings,
  inningBeforePlay: game.inning,
  halfBeforePlay: game.half,
  halfInningEnded:
    result.metadata?.halfInningEnded,
  reachedEndOfRegulation,
}
)

if (reachedEndOfRegulation) {
setRegulationComplete({
  result,
  batterId: batter.id,

  pitcherId:
    defensiveAlignment?.P ??
    null,

  eventType:
    enginePlayType,

  label,

  extraEventData: {
    player_id:
      batter.id,

    outs_recorded:
      result.metadata
        ?.outsRecorded ?? 0,

    runs:
      result.metadata
        ?.runsScored ?? 0,

    rbi:
      result.metadata
        ?.rbiCount ?? 0,

    details: {
      ...details,

      playId:
        playEvent.id,

      runnerAdvances:
        result.metadata
          ?.runnerAdvances,

      fielding,
    },
  },
})

setShowOutResultDialog(false)

return
}

                  await handleGameAction({
                    game,
                    dispatch,

                    action: {
                      type: "APPLY_PLAY_RESULT",
                      result,
                      batterId: batter.id,

                      pitcherId:
                        game.currentPitcher?.id ?? game.pitcher?.id ?? null,

                      label, // add this
                    },

                    eventType: enginePlayType,
                    label,

                    extraEventData: {
                      player_id: batter.id,
                      outs_recorded: result.metadata?.outsRecorded ?? 0,
                      runs: result.metadata?.runsScored ?? 0,
                      rbi: result.metadata?.rbiCount ?? 0,

                      details: {
                        ...details,
                        playId: playEvent.id,
                        runnerAdvances: result.metadata?.runnerAdvances,
                        fielding,
                      },
                    },
                  });

                  setShowOutResultDialog(false);
                  return;
                }

                /*
                 * Temporary legacy path for flyouts, lineouts,
                 * popouts, errors, and fielder's choices.
                 */
                await handleGameAction({
                  game,
                  dispatch,

                  action: {
                    ...action,
                    details,
                  },

                  eventType,
                  label,

                  extraEventData: {
                    outs_recorded: outsRecorded,
                    details,
                  },
                });

                setShowOutResultDialog(false);
              } catch (error) {
                console.error("Could not save result:", error);

                alert(error.message || "Could not save result");
              }
            }}
          />
        )}

<GameFeed
  events={game.events ?? []}
  title="Game Feed"
  compact
/>

        <BoxScore
  title={game.awayTeam}
  lineup={
    game.lineups?.[game.awayTeam] ?? []
  }
  gameStats={game.stats}
/>

<BoxScore
  title={game.homeTeam}
  lineup={
    game.lineups?.[game.homeTeam] ?? []
  }
  gameStats={game.stats}
/>

<Button
  onClick={() => {
    dispatch({
      type: "SET_DEFENSIVE_POSITION",
      team: "home",
      position: "SS",
      playerId: "player-123",
    })
  }}
>

<pre>
  {JSON.stringify(game.defense, null, 2)}
</pre>
  Test Defense
</Button>

<Button
  className="w-full rounded-2xl"
  variant="secondary"
  onClick={async () => {
    console.log("FINISH GAME CLICKED")

    try {
      const finalState = {
        ...game,
        status: "final",
      }

      console.log(
        "ABOUT TO FINISH GAME:",
        game.id
      )

      await finishGame(
        game.id,
        finalState
      )

      console.log(
        "FINISH GAME SAVED"
      )

      dispatch({
        type: "LOAD_GAME",
        game: finalState,
      })

      setScreen("summary")

      console.log(
        "FINISH GAME COMPLETE"
      )
    } catch (error) {
      console.error(
        "COULD NOT FINISH GAME:",
        error
      )

      alert(
        error.message ||
          "Could not finish game"
      )
    }
  }}
>
  Finish Game
</Button>

{regulationComplete && (
  <div className="
    fixed inset-0 z-[100]
    flex items-center justify-center
    bg-black/80 p-4
  ">
    <div className="
      w-full max-w-md
      rounded-3xl
      bg-green-900
      p-5
      text-scoreboard-cream
      shadow-2xl
    ">
      <div className="text-center">
        <div className="scoreboard-label">
          Regulation Complete
        </div>

        <div className="mt-2 text-3xl font-black">
          6 Innings Complete
        </div>

        <div className="mt-2 text-sm opacity-70">
          End the game or continue
          to extra innings.
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          className="
            min-h-16
            w-full
            text-lg
            font-bold
          "
          onClick={
            handleEndAtRegulation
          }
        >
          End Game
        </Button>

        <Button
          variant="secondary"
          className="
            min-h-14
            w-full
            text-base
            font-bold
          "
          onClick={
            handleContinueExtraInnings
          }
        >
          Continue to Extra Innings
        </Button>
      </div>
    </div>
  </div>
)}
      </div>
    </main>
  );
}
