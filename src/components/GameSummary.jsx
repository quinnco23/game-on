import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { BoxScore } from "./BoxScore"

export function GameSummary({ game, onBackHome }) {
  const awayScore = game.score?.[game.awayTeam] ?? 0
  const homeScore = game.score?.[game.homeTeam] ?? 0

  return (
    <main className="min-h-screen bg-green-950 text-white p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
          <CardContent className="p-5 space-y-4">
            <div className="text-xs tracking-[0.3em] text-green-300 uppercase">
              Final
            </div>

            <h1 className="text-3xl font-black">Game Summary</h1>

            <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
              <div className="grid grid-cols-[1fr_64px]">
                <div className="p-3 border-b border-white/10 font-bold">
                  {game.awayTeam}
                </div>
                <div className="p-3 border-b border-white/10 text-center text-2xl font-black">
                  {awayScore}
                </div>

                <div className="p-3 font-bold">{game.homeTeam}</div>
                <div className="p-3 text-center text-2xl font-black">
                  {homeScore}
                </div>
              </div>
            </div>

            <Button className="w-full rounded-2xl" onClick={onBackHome}>
              Back to Home
            </Button>
          </CardContent>
        </Card>

        <BoxScore
          title={game.awayTeam}
          events={game.events}
          lineup={game.lineups[game.awayTeam]}
        />

        <BoxScore
          title={game.homeTeam}
          events={game.events}
          lineup={game.lineups[game.homeTeam]}
        />
      </div>
    </main>
  )
}