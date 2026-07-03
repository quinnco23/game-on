import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { saveEvent } from "../services/eventsService"


export function CountControls({ game, dispatch }) {
  const walkLikely = game.balls === 3;
  const strikeoutLikely = game.strikes === 2;

  async function handlePlay(eventType, label, action) {
  dispatch(action)

  try {
    const saved = await saveEvent({
      game_id: game.id,
      inning: game.inning,
      half: game.half,
      event_type: eventType,
      label,
    })

    console.log("Saved event:", saved)
  } catch (error) {
    console.error("Could not save event:", error)
    alert(error.message)
  }
}

  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-4">
        <div className="text-center">
          <div className="text-sm text-white/60">Count</div>
          <div className="text-4xl font-bold">{game.balls} - {game.strikes}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => handlePlay("ball", "Ball", { type: "BALL" })}>
  Ball
</Button>

<Button onClick={() => handlePlay("strike", "Strike", { type: "STRIKE" })}>
  Strike
</Button>

<Button onClick={() => handlePlay("foul", "Foul Ball", { type: "FOUL" })}>
  Foul
</Button>
        </div>
      </CardContent>
    </Card>
  );
}