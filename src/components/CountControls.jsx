import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function CountControls({ game, dispatch }) {
  const walkLikely = game.balls === 3;
  const strikeoutLikely = game.strikes === 2;

  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-4">
        <div className="text-center">
          <div className="text-sm text-white/60">Count</div>
          <div className="text-4xl font-bold">{game.balls} - {game.strikes}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button className="rounded-2xl py-7 text-lg" onClick={() => dispatch({ type: "BALL" })}>
            ⚾ Ball{walkLikely ? "?" : ""}
          </Button>
          <Button className="rounded-2xl py-7 text-lg" onClick={() => dispatch({ type: "STRIKE" })}>
            ❌ Strike{strikeoutLikely ? "?" : ""}
          </Button>
          <Button className="rounded-2xl py-7 text-lg" variant="secondary" onClick={() => dispatch({ type: "FOUL" })}>
            Foul
          </Button>
          <Button className="rounded-2xl py-7 text-lg" variant="secondary" onClick={() => dispatch({ type: "OUT" })}>
            🧤 Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}