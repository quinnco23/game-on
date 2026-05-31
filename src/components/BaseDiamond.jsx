
import { Card, CardContent } from "./ui/card";
import { formatPlayer } from "@/state/gameLogic";
import { Users} from "lucide-react";

function Base({ occupied, label, className, muted }) {
  return (
    <div
      className={`h-14 w-14 rounded-xl border border-white/30 flex items-center justify-center -rotate-45 ${
        occupied && !muted ? "bg-white text-slate-950" : "bg-white/5 text-white/70"
      } ${className}`}
      title={occupied && !muted ? formatPlayer(occupied) : label}
    >
      <div className="text-center">
        <div className="text-xs font-bold">{label}</div>
        {occupied && !muted && <Users className="mx-auto h-4 w-4" />}
      </div>
    </div>
  );
}export function BaseDiamond({ bases }) {
  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5">
        <div className="relative mx-auto h-48 w-48 rotate-360">
          <Base occupied={bases.second} className="absolute left-1/2 top-0 -translate-x-1/2" label="2B" />
          <Base occupied={bases.third} className="absolute left-0 top-1/2 -translate-y-1/2" label="3B" />
          <Base occupied={bases.first} className="absolute right-0 top-1/2 -translate-y-1/2" label="1B" />
          <Base occupied className="absolute bottom-0 left-1/2 -translate-x-1/2" label="H" muted />
        </div>
      </CardContent>
    </Card>
  );
}