import { Routes, Route } from "react-router-dom";

import "./App.css";

import TapScorePrototype from "./components/GameOn";


import { TeamScreen } from "./components/TeamScreen";
import { TeamsScreen } from "./components/TeamsScreen";
import { NewTeamScreen } from "./components/NewTeamScreen";


import { FanLayout } from "./components/fan/FanLayout"
import { FanHomeScreen } from "./components/FanHomePage";
import { StandingsScreen } from "./components/fan/StandingsScreen"
import { GameDetailScreen } from "./components/GameDetailScreen";
import { StatsScreen } from "./components/fan/StatsScreen"
import { PublicTeamsScreen } from "./components/fan/PublicTeamsScreen"
import { ScheduleGameScreen } from "./components/ScheduleGameScreen";

function App() {
  return (
    <Routes>
    <Route
      path="/"
      element={<TapScorePrototype />}
    />
  
    <Route
      path="/teams"
      element={<TeamsScreen />}
    />
  
    <Route
      path="/teams/new"
      element={<NewTeamScreen />}
    />
  
    <Route
      path="/teams/:teamId"
      element={<TeamScreen />}
    />
  
    <Route
      path="/games/:gameId"
      element={<GameDetailScreen />}
    />
  
    <Route
      path="/games/schedule"
      element={<ScheduleGameScreen />}
    />
  
    {/* FAN PAGES */}
    <Route
      path="/fan"
      element={<FanLayout />}
    >
      <Route
        index
        element={<FanHomeScreen />}
      />
  
       <Route
        path="standings"
        element={<StandingsScreen />}
      /> 
  
      <Route
        path="stats"
        element={<StatsScreen />}
      />
  
      <Route
        path="teams"
        element={<PublicTeamsScreen />}
      />
    </Route>
  
    <Route
      path="/fan/games/:gameId"
      element={<GameDetailScreen />}
    />
  </Routes>
  );
}

export default App;
