import { getBattingTeam } from "@/state/gameLogic";
import { getCurrentBatter } from "@/state/gameLogic";
import { Card, CardContent } from "./ui/card";
import { formatPlayer } from "@/state/gameLogic";
function TeamScore({ name, score, active }) {
  return (
    <div
      className={[
        "grid grid-cols-[1fr_auto] items-center gap-4 border px-3 py-2",
        active
          ? "border-scoreboard-amber bg-scoreboard-dark"
          : "border-scoreboard-cream/30",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "size-2 rounded-full",
            active
              ? "bg-scoreboard-amber shadow-[0_0_8px_rgb(218_170_61/80%)]"
              : "bg-scoreboard-muted/30",
          ].join(" ")}
        />

        <span className="font-heading text-lg font-bold uppercase tracking-[0.1em]">
          {name}
        </span>
      </div>

      <span className="scoreboard-number text-3xl">
        {score ?? 0}
      </span>
    </div>
  )
}

export function Scoreboard({ game }) {
  const battingTeam = getBattingTeam(game);
  const batter = getCurrentBatter(game);

  return (
<Card className="scoreboard-panel rounded-none text-scoreboard-cream">
  <CardContent className="relative z-10 space-y-4 p-5">
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      <div className="space-y-2">
        <TeamScore
          name={game.awayTeam}
          score={game.score[game.awayTeam]}
          active={battingTeam === game.awayTeam}
        />

        <TeamScore
          name={game.homeTeam}
          score={game.score[game.homeTeam]}
          active={battingTeam === game.homeTeam}
        />
      </div>

      <div className="border-l border-scoreboard-cream/40 pl-5 text-center">
        <div className="scoreboard-label">
          {game.half === "top" ? "Top" : "Bottom"}
        </div>

        <div className="scoreboard-number mt-1 text-4xl">
          {game.inning}
        </div>

        <div className="scoreboard-label mt-1">
          Inning
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 border-t-2 border-scoreboard-red pt-4">
      <div>
        <div className="scoreboard-label">
          Outs
        </div>

        <div className="scoreboard-number text-2xl">
          {game.outs}
        </div>
      </div>

      <div className="border-l border-scoreboard-cream/30 pl-4 text-right">
        <div className="scoreboard-label">
          At Bat
        </div>

        <div className="font-heading text-lg font-bold uppercase tracking-wide text-scoreboard-cream">
          {formatPlayer(batter)}
        </div>
      </div>
    </div>
  </CardContent>
</Card>
  );
}