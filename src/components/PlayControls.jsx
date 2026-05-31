import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Mic, Zap, Undo2 } from "lucide-react";

export function PlayControls({ dispatch, onVoice, onFakeAudioAssist }) {
  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button className="rounded-2xl py-6" onClick={() => dispatch({ type: "SINGLE" })}>Single</Button>
          <Button className="rounded-2xl py-6" onClick={() => dispatch({ type: "DOUBLE" })}>Double</Button>
          <Button className="rounded-2xl py-6" onClick={() => dispatch({ type: "TRIPLE" })}>Triple</Button>
          <Button className="rounded-2xl py-6" onClick={() => dispatch({ type: "HOME_RUN" })}>HR</Button>
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