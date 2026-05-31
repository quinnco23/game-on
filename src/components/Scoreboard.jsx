import { getBattingTeam } from "@/state/gameLogic";
import { getCurrentBatter } from "@/state/gameLogic";
import { Card, CardContent } from "./ui/card";
import { formatPlayer } from "@/state/gameLogic";
function TeamScore({ name, score, active }) {
  return (
    <div className={`flex justify-between rounded-2xl px-3 py-2 ${active ? "bg-white/15" : ""}`}>
      <span className="font-medium">{name}</span>
      <span className="text-xl font-bold">{score}</span>
    </div>
  );
}export function Scoreboard({ game }) {
  const battingTeam = getBattingTeam(game);
  const batter = getCurrentBatter(game);

  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
          <div>
            <TeamScore name={game.awayTeam} score={game.score[game.awayTeam]} active={battingTeam === game.awayTeam} />
            <TeamScore name={game.homeTeam} score={game.score[game.homeTeam]} active={battingTeam === game.homeTeam} />
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">{game.half === "top" ? "Top" : "Bottom"}</div>
            <div className="text-3xl font-bold">{game.inning}</div>
          </div>
        </div>

        <div className="flex justify-between text-sm text-white/75">
          <span>{game.outs} Outs</span>
          <span>At bat: {formatPlayer(batter)}</span>
        </div>
      </CardContent>
    </Card>
  );
}