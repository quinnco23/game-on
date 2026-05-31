import { Card, CardContent } from "./ui/card";
import { useMemo } from "react";
import { Video } from "lucide-react";


export function EventFeed({ events }) {
  const latest = useMemo(() => [...events].slice(-5).reverse(), [events]);

  return (
    <Card className="rounded-3xl bg-white/10 border-white/10 text-white">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Game Feed</h2>
          <Video className="h-4 w-4 text-white/60" />
        </div>

        {latest.length === 0 ? (
          <p className="text-sm text-white/60">No plays logged yet.</p>
        ) : (
          latest.map((event) => (
            <div key={event.id} className="rounded-2xl bg-white/5 p-3 text-sm">
              <div className="font-medium">{event.label}</div>
              <div className="text-white/50">{event.inning} · {event.timestamp}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}