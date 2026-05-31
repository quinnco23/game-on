import { Button } from "./ui/button";

export function LineupEditor({ title, lineup, setLineup }) {
  function updatePlayer(index, field, value) {
    setLineup((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? { ...player, [field]: value } : player
      )
    );
  }

  function addPlayer() {
    setLineup((current) => [...current, { number: "", name: "", position: "" }]);
  }

  function removePlayer(index) {
    setLineup((current) => current.filter((_, playerIndex) => playerIndex !== index));
  }

  return (
    <div className="rounded-3xl bg-white/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <Button className="rounded-2xl" variant="secondary" onClick={addPlayer}>Add</Button>
      </div>

      <div className="space-y-2">
        {lineup.map((player, index) => (
          <div key={index} className="grid grid-cols-[64px_1fr_72px_36px] gap-2 items-center">
            <input
              className="rounded-xl p-2 text-sm text-slate-900"
              placeholder="#"
              value={player.number}
              onChange={(e) => updatePlayer(index, "number", e.target.value)}
            />
            <input
              className="rounded-xl p-2 text-sm text-white"
              placeholder="Name"
              value={player.name}
              onChange={(e) => updatePlayer(index, "name", e.target.value)}
            />
            <input
              className="rounded-xl p-2 text-sm text-white"
              placeholder="Pos"
              value={player.position}
              onChange={(e) => updatePlayer(index, "position", e.target.value)}
            />
            <button className="text-white/50 hover:text-white" onClick={() => removePlayer(index)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
