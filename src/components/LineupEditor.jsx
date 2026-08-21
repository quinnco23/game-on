import { Button } from "./ui/button";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"

function SortablePlayerRow({
  player,
  index,
  updatePlayer,
  removePlayer,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: player.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
  ref={setNodeRef}
  style={style}
  className="
    grid
    grid-cols-[40px_42px_1fr_72px_42px]
    items-center
    gap-2
  "
>
  {/* DRAG HANDLE */}
  <button
    type="button"
    className="
      flex
      h-10
      w-10
      items-center
      justify-center
      cursor-grab
      text-2xl
      font-bold
      text-scoreboard-cream/70
      transition
      hover:text-scoreboard-cream
      active:cursor-grabbing
    "
    {...attributes}
    {...listeners}
    aria-label="Reorder player"
  >
    ☰
  </button>

  {/* ORDER */}
  <div
    className="
      text-center
      font-heading
      text-base
      font-bold
      text-scoreboard-cream/70
    "
  >
    {index + 1}
  </div>

  {/* PLAYER NAME */}
  <input
    className="
      w-full
      rounded-none
      border
      border-scoreboard-cream/20
      bg-scoreboard-light/20
      px-3
      py-2.5
      font-heading
      text-base
      font-semibold
      text-scoreboard-cream
      outline-none
      focus:border-scoreboard-amber
    "
    value={player.name}
    onChange={(e) =>
      updatePlayer(
        index,
        "name",
        e.target.value
      )
    }
  />

  {/* POSITION */}
  <input
    className="
      w-full
      rounded-none
      border
      border-scoreboard-cream/20
      bg-scoreboard-light/20
      px-2
      py-2.5
      text-center
      text-base
      font-bold
      uppercase
      text-scoreboard-cream
      outline-none
      focus:border-scoreboard-amber
    "
    value={player.position}
    onChange={(e) =>
      updatePlayer(
        index,
        "position",
        e.target.value
      )
    }
  />

  {/* REMOVE */}
  <button
    type="button"
    className="
      flex
      h-10
      w-10
      items-center
      justify-center
      bg-scoreboard-light/40
      text-2xl
      font-black
      leading-none
      text-scoreboard-red
      transition
      hover:bg-scoreboard-red
      hover:text-scoreboard-cream
    "
    onClick={() =>
      removePlayer(index)
    }
    aria-label={`Remove ${player.name}`}
  >
    ×
  </button>
</div>
  )
}

export function LineupEditor({
  title,
  roster = [],
  lineup = [],
  setLineup,
}) {
  function updatePlayer(index, field, value) {
    setLineup((current) =>
      (current ?? []).map((player, playerIndex) =>
        playerIndex === index
          ? {
              ...player,
              [field]:
                field === "position"
                  ? value.toUpperCase()
                  : value,
            }
          : player
      )
    )
  }

  function handleDragEnd(event) {
    const { active, over } = event
  
    if (!over || active.id === over.id) {
      return
    }
  
    setLineup((current) => {
      const currentLineup = current ?? []
  
      const oldIndex =
        currentLineup.findIndex(
          (player) =>
            player.id === active.id
        )
  
      const newIndex =
        currentLineup.findIndex(
          (player) =>
            player.id === over.id
        )
  
      const reordered =
        arrayMove(
          currentLineup,
          oldIndex,
          newIndex
        )
  
      return reordered.map(
        (player, index) => ({
          ...player,
          battingOrder: index + 1,
        })
      )
    })
  }

  function addPlayer() {
    setLineup((current) => [
      ...(current ?? []),
  
      {
        id: crypto.randomUUID(),
        number: "",
        name: "",
        position: "",
        isManual: true,
      },
    ])
  }

  function removePlayer(index) {
    setLineup((current) =>
      (current ?? []).filter(
        (_, playerIndex) =>
          playerIndex !== index
      )
    )
  }
  const activePlayerIds = new Set(
    (lineup ?? []).map((player) => player.id)
  )
  
  const availablePlayers =
  (roster ?? []).filter(
    (player) =>
      !activePlayerIds.has(player.id)
  )

  console.log("LINEUP EDITOR DEBUG:", {
    title,
    roster,
    lineup,
    availablePlayers,
  })
  return (
    <div className="rounded-3xl bg-white/5 p-4 space-y-3">
      <div className="flex items-center justify-between mx-2.5">
        <h2 className="font-bold">{title}</h2>
        <Button onClick={addPlayer}>
  + Manual Player
</Button>
<Button
  onClick={() => {
    setLineup(
      roster.map((player, index) => ({
        id: player.id,
        name: player.name,
        number: player.number,
        position:
          player.default_position ?? "",
        battingOrder: index + 1,
      }))
    )
  }}
>
  Add Entire Roster
</Button>
      </div>

      <div className="space-y-2">
  <div className="text-sm font-bold text-white/70">
    Available Players
  </div>

  {availablePlayers.map((player) => (
    <button
      key={player.id}
      type="button"
      className="scoreboard-button w-full text-left"
      onClick={() => {
        setLineup((current) => {
          const currentLineup = current ?? []

          const nextLineup = [
            ...currentLineup,
            {
              id: player.id,
              name: player.name,
              number: player.number,
              position:
                player.default_position ?? "",
              battingOrder:
                currentLineup.length + 1,
            },
          ]

          console.log(
            "ADDING PLAYER TO LINEUP:",
            player.name,
            nextLineup
          )

          return nextLineup
        })
      }}
    >
      + #{player.number} {player.name}
    </button>
  ))}
</div>

      <div className="space-y-2">
      <DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={lineup.map(
      (player) => player.id
    )}
    strategy={verticalListSortingStrategy}
  >
    <div className="space-y-2">
      {lineup.map(
        (player, index) => (
          <SortablePlayerRow
            key={player.id}
            player={player}
            index={index}
            updatePlayer={updatePlayer}
            removePlayer={removePlayer}
          />
        )
      )}
    </div>
  </SortableContext>
</DndContext>
      </div>
    </div>
  );
}
