import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Mic, Zap, Undo2 } from "lucide-react"
import { handleGameAction } from "../services/handleGameAction"

export function PlayControls({
  game,
  dispatch,
  onVoice,
  onFakeAudioAssist,
  onOpenPlayResolution,
  onOpenOutDialog,
}) {
  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="rounded-2xl py-6"
            onClick={() => onOpenPlayResolution("single")}
          >
            Single
          </Button>

          <Button
            className="rounded-2xl py-6"
            onClick={() => onOpenPlayResolution("double")}
          >
            Double
          </Button>

          <Button
            className="rounded-2xl py-6"
            onClick={() => onOpenPlayResolution("triple")}
          >
            Triple
          </Button>

          <Button
            className="rounded-2xl py-6"
            onClick={() => onOpenPlayResolution("home_run")}
          >
            HR
          </Button>

          <Button
  className="rounded-2xl py-6"
  onClick={onOpenOutDialog}
>
  Out / Error
</Button>

        </div>

        {/* keep your Voice / Assist / Undo buttons below */}
      </CardContent>
    </Card>
  )
}