 import { Card, CardContent} from "./ui/card";
 import { Button } from "./ui/button";
 
 export function GameSummary({ game, onRestart }) {
  const winner = game.score[game.homeTeam] === game.score[game.awayTeam]
    ? "Tie game"
    : game.score[game.homeTeam] > game.score[game.awayTeam]
      ? game.homeTeam
      : game.awayTeam;

  return (
    <main className="min-h-screen bg-green-950 text-white p-4 flex items-center">
      <Card className="mx-auto w-full max-w-md rounded-3xl bg-white/10 border-white/10 text-white">
        <CardContent className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Final Score</h1>
            <p className="text-white/60">Auto-generated recap draft</p>
          </div>

          <div className="space-y-2 text-3xl font-bold">
            <div className="flex justify-between"><span>{game.awayTeam}</span><span>{game.score[game.awayTeam]}</span></div>
            <div className="flex justify-between"><span>{game.homeTeam}</span><span>{game.score[game.homeTeam]}</span></div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
            {winner === "Tie game"
              ? "The game ended tied after a steady back-and-forth matchup."
              : `${winner} came out ahead in a game with ${game.events.length} tracked scoring events and plays.`}
          </div>

          <Button className="w-full rounded-2xl" onClick={onRestart}>Start Another Game</Button>
        </CardContent>
      </Card>
    </main>
  );
}