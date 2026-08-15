import { Routes, Route } from "react-router-dom";

import "./App.css";

import TapScorePrototype from "./components/GameOn";
import { TeamScreen } from "./components/TeamScreen";
import { TeamsScreen } from "./components/TeamsScreen";
import { NewTeamScreen } from "./components/NewTeamScreen";
import { FanHomeScreen } from "./components/FanHomePage";
import { GameDetailScreen } from "./components/GameDetailScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TapScorePrototype />} />
      <Route path="/teams" element={<TeamsScreen />} />
      <Route path="/teams/new" element={<NewTeamScreen />} />
      <Route path="/teams/:teamId" element={<TeamScreen />} />
      <Route path="/stats" element={<statScreen />} />
      <Route path="/fan" element={<FanHomeScreen />} />
      <Route
  path="/games/:gameId"
  element={<GameDetailScreen />}
/>
    </Routes>
  );
}

export default App;
