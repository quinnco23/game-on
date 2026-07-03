import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, Zap, Undo2 } from "lucide-react";
import { saveEvent } from "../services/eventsService"
import { getCurrentBatter } from "../state/gameLogic"


export function PlayControls({
  game,
  dispatch,
  onVoice,
  onFakeAudioAssist,
}) {
  
  async function handlePlay(type, label, actionType) {
  dispatch({ type: actionType })

  const batter = getCurrentBatter(game)

await saveEvent({
  player_id: batter.id || null,
  game_id: game.id, 
  player_id: batter.id,
  inning: game.inning,
  half: game.half,
  event_type: eventType,
  label,
})

  try {
    const saved = await saveEvent({
      game_id: game.id,
      inning: game.inning,
      half: game.half,
      event_type: type,
      label,
    })

    console.log("Saved event:", saved)
  } catch (error) {
    console.error("Could not save event:", error)
    alert(error.message)
  }
}
  
  async function handleSingle() {
  console.log("Single clicked")
  console.log("game in PlayControls:", game)
  console.log("game.id:", game?.id)

  dispatch({ type: "SINGLE" })

  try {
    const saved = await saveEvent({
      game_id: game.id,
      inning: game.inning,
      half: game.half,
      event_type: "single",
      label: "Single",
    })

    console.log("Saved event:", saved)
  } catch (error) {
    console.error("Could not save event:", error)
    alert(error.message)
  }
}
  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
  onClick={() =>
    handlePlay("single", "Single", "SINGLE")
  }
>
  Single
</Button>

<Button
  onClick={() =>
    handlePlay("double", "Double", "DOUBLE")
  }
>
  Double
</Button>

<Button
  onClick={() =>
    handlePlay("triple", "Triple", "TRIPLE")
  }
>
  Triple
</Button>

<Button
  onClick={() =>
    handlePlay("home_run", "Home Run", "HOME_RUN")
  }
>
  HR
</Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button className="rounded-2xl" variant="secondary" onClick={onVoice}>
            <Mic className="mr-2 h-4 w-4" /> Voice
          </Button>
          <Button className="rounded-2xl" variant="secondary" onClick={onFakeAudioAssist}>
            <Zap className="mr-2 h-4 w-4" /> Assist
          </Button>
          <Button className="rounded-2xl" variant="secondary" onClick={() => dispatch({ type: "UNDO" })}>
            <Undo2 className="mr-2 h-4 w-4" /> Undo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}