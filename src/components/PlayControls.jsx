import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Mic, Zap, Undo2 } from "lucide-react"


export function PlayControls({
  game,
  dispatch,
  onVoice,
  onFakeAudioAssist,
  onOpenPlayResolution,
  onOpenOutDialog,
  onUndo,
  onStolenBase, 
  onPassedBall,
  onWildPitch,
  onHitByPitch,
  onCaughtStealing,

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
            onClick={() =>
              onOpenPlayResolution("homeRun")
            }
          >
            HR
          </Button>

          <div className="grid grid-cols-3 gap-2">
          <Button
  disabled={!game.bases?.first}
  onClick={() =>
    onStolenBase("first", "second")
  }
>
  Steal 2nd
</Button>
<Button
  disabled={!game.bases?.second}
  onClick={() =>
    onStolenBase("second", "third")
  }
>
  Steal 3rd
</Button>

<Button
  disabled={!game.bases?.third}
  onClick={() =>
    onStolenBase("third", "home")
  }
>
  Steal Home
</Button>


  <Button
    disabled={!game.bases?.first}
    onClick={() =>
      onCaughtStealing("first")
    }
  >
    CS 2B
  </Button>

  <Button 
    disabled={!game.bases?.second}
    onClick={() =>
      onCaughtStealing("second")
    }
  >
    CS 3B
  </Button>

  <Button className="grid grid-cols-3 gap-2"
    disabled={!game.bases?.third}
    onClick={() =>
      onCaughtStealing("third")
    }
  >
    CS Home
  </Button>


</div>

<div className="grid grid-cols-3 gap-2">
  <Button
    disabled={!game.bases?.first}
    onClick={() =>
      onPassedBall("first", "second")
    }
  >
    PB to 2B
  </Button>

  <Button
    disabled={!game.bases?.second}
    onClick={() =>
      onPassedBall("second", "third")
    }
  >
    PB to 3B
  </Button>

  <Button
    disabled={!game.bases?.third}
    onClick={() =>
      onPassedBall("third", "home")
    }
  >
    PB Score
  </Button>
</div>


<div className="grid grid-cols-3 gap-2">
  <Button
    disabled={!game.bases?.first}
    onClick={() =>
      onWildPitch("first", "second")
    }
  >
    WP to 2B
  </Button>

  <Button
    disabled={!game.bases?.second}
    onClick={() =>
      onWildPitch("second", "third")
    }
  >
    WP to 3B
  </Button>

  <Button
    disabled={!game.bases?.third}
    onClick={() =>
      onWildPitch("third", "home")
    }
  >
    WP Score
  </Button>

  <Button
  className="rounded-2xl py-3"
  onClick={onHitByPitch}
>
  HBP
</Button>
</div>

          <Button
  className="rounded-2xl py-6"
  onClick={onOpenOutDialog}s
>
  Out / Error
</Button>

<Button
  
  className="rounded-2xl py-6 bg-red-600"
  onClick={onUndo}
  
>
  <Undo2 className="mr-2 h-4 w-4  bg-red-600" />
  Undo
</Button>

        </div>

        {/* keep your Voice / Assist / Undo buttons below */}
      </CardContent>
    </Card>
  )
}