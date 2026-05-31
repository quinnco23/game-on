export function VoiceInputModal({ heardText, parsedPlay, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm rounded-3xl bg-white text-slate-950">
        <CardContent className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold">We heard:</h2>
            <p className="mt-2 rounded-2xl bg-slate-100 p-3 text-sm">“{heardText}”</p>
          </div>
          <div>
            <div className="text-sm text-slate-500">Parsed play</div>
            <div className="text-2xl font-bold">{parsedPlay}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="rounded-2xl" onClick={onCancel}>Edit</Button>
            <Button className="rounded-2xl" onClick={onConfirm}>Confirm</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}