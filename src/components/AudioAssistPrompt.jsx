export function AudioAssistPrompt({ onPlay, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm rounded-3xl bg-white text-slate-950">
        <CardContent className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Zap className="h-5 w-5" /> Play detected
            </div>
            <p className="text-sm text-slate-500 mt-1">Audio spike matched a likely bat/contact event.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className="rounded-2xl py-6" onClick={() => onPlay("SINGLE")}>Hit</Button>
            <Button className="rounded-2xl py-6" variant="secondary" onClick={() => onPlay("FOUL")}>Foul</Button>
            <Button className="rounded-2xl py-6" variant="secondary" onClick={() => onPlay("OUT")}>Out</Button>
            <Button className="rounded-2xl py-6" variant="secondary" onClick={onClose}>Ignore</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
