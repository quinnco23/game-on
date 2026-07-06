import {
  applyWalk,
  applyHit,
  applyHomeRun,
  applyOut,
  advanceRunner,
  logEvent,
} from "./gameLogic"


export function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      const homeTeam = action.homeTeam || state.homeTeam;
      const awayTeam = action.awayTeam || state.awayTeam;
      return {
        ...state,
  id: action.gameId,
  status: "scoring",
  homeTeam,
  awayTeam,
        score: {
          [homeTeam]: 0,
          [awayTeam]: 0,
        },
        lineups: {
          [homeTeam]: action.homeLineup,
          [awayTeam]: action.awayLineup,
        },
        battingIndex: {
          [homeTeam]: 0,
          [awayTeam]: 0,
        },
      };
    }

    case "LOAD_GAME":
      return action.game;
    case "BALL": {
      const nextBalls = state.balls + 1;
      if (nextBalls >= 4) {
        return applyWalk(state);
      }
      return logEvent({ ...state, balls: nextBalls }, "Ball");
    }

    case "STRIKE": {
      const nextStrikes = state.strikes + 1;
      if (nextStrikes >= 3) {
        return applyOut(state, "Strikeout");
      }
      return logEvent({ ...state, strikes: nextStrikes }, "Strike");
    }

    case "FOUL": {
      const nextStrikes = Math.min(2, state.strikes + 1);
      return logEvent({ ...state, strikes: nextStrikes }, "Foul ball");
    }

    case "OUT":
      return applyOut(state, action.label || "Out");

    case "SINGLE":
      return applyHit(state, "Single", 1);

    case "DOUBLE":
      return applyHit(state, "Double", 2);

    case "TRIPLE":
      return applyHit(state, "Triple", 3);

    case "HOME_RUN":
      return applyHomeRun(state);

    case "ADVANCE_RUNNER":
      return advanceRunner(state, action.from, action.to);

    case "UNDO":
      // V1 placeholder: real undo should keep a history stack.
      return logEvent(state, "Undo requested");

    case "END_GAME":
      return { ...state, status: "summary" };

    

    default:
      return state;
  }
}

