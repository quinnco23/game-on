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
        grid-cols-[32px_46px_1fr_64px_36px]
        items-center
        gap-2
      "
    >
      <button
        type="button"
        className="cursor-grab text-white/50 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        ☰
      </button>

      <div className="text-center text-sm font-bold">
        {index + 1}
      </div>

      <input
        className="rounded-xl p-2 text-sm text-white"
        value={player.name}
        onChange={(e) =>
          updatePlayer(
            index,
            "name",
            e.target.value
          )
        }
      />

      <input
        className="rounded-xl p-2 text-sm text-white"
        value={player.position}
        onChange={(e) =>
          updatePlayer(
            index,
            "position",
            e.target.value
          )
        }
      />

      <button
        type="button"
        className="text-white/50 hover:text-white"
        onClick={() =>
          removePlayer(index)
        }
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
      <div className="flex items-center justify-between">
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
