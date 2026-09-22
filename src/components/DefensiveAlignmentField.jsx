import { useState } from "react"

const spots = {
  P:  { left: "50%", top: "63%" },
  C:  { left: "50%", top: "78%" },

  "1B": { left: "65%", top: "56%" },
  "2B": { left: "62%", top: "49%" },
  "3B": { left: "36%", top: "56%" },
  SS:   { left: "40%", top: "49%" },

  LF: { left: "25%", top: "45%" },
  CF: { left: "50%", top: "35%" },
  RF: { left: "75%", top: "44%" },
}

export function DefensiveAlignmentField({
  defense = {},
  players = [],
  pitchCount = 0,
  onAssign,
    onPitcherChange,
}) {

  
  const [selectedPosition, setSelectedPosition] =
    useState(null)

  function getPlayer(playerId) {
    return players.find(
      (player) => player.id === playerId
    )
  }

   // Players currently occupying a defensive position
   const activeDefenderIds = new Set(
    Object.values(defense).filter(Boolean)
  )

  // Everyone else is currently on the bench
  const benchPlayers = players.filter(
    (player) =>
      !activeDefenderIds.has(player.id)
  )
  

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-10">
        {Object.entries(spots).map(
          ([position, coordinates]) => {
            const player =
              getPlayer(defense[position])

            return (
              <button
                key={position}
                type="button"
                className="
                  absolute
                  -translate-x-1/2
                  -translate-y-1/2
                  pointer-events-auto
                "
                style={coordinates}
                onClick={() => {
                  if (position === "P") {
                    onPitcherChange?.()
                    return
                  }
                
                  setSelectedPosition(position)
                }}
              >
                <div
  className="
    min-w-[58px]
    max-w-[86px]
    rounded-lg
   
   
    px-2 py-1.5
    text-center
    text-white
    shadow-lg
    
  "
>
  <div className="truncate text-[10px] font-semibold leading-tight sm:text-xs">
    {player?.name ?? "Assign"}
  </div>

  {/* <div className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-white/70">
    {position}
  </div> */}

  {position === "P" && (
    <div className="mt-0.5 text-[8px] font-semibold text-white/80">
      {pitchCount} pitches
    </div>
  )}
</div>
              </button>
            )
          }
        )}
      </div>

      <div className="mt-3 border-t border-white/20 pt-2">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-wider text-white/60">
          Bench
        </div>

        <div className="flex flex-wrap gap-2">
          {benchPlayers.length === 0 ? (
            <div className="text-[9px] text-white/50">
              No bench players
            </div>
          ) : (
            benchPlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                className="
                  rounded-lg
                  bg-black/30
                  px-2 py-1
                  text-[9px]
                  text-white
                "
              >
                #{player.number} {player.name}
              </button>
            ))
          )}
        </div>
      </div>

      {selectedPosition && (
  <div
    className="
      fixed inset-0 z-50
      flex items-end
      bg-black/60
      sm:items-center
      sm:justify-center
      sm:p-4
    "
  >
    <div
      className="
        flex
        max-h-[calc(100dvh-12px)]
        w-full
        flex-col
        overflow-hidden
        rounded-t-3xl
        bg-green-900
        sm:max-h-[calc(100dvh-32px)]
        sm:max-w-sm
        sm:rounded-3xl
      "
    >
      <div className="shrink-0 p-4 pb-3">
        <div className="text-lg font-bold text-white">
          Assign {selectedPosition}
        </div>
      </div>

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          px-4
          pb-4
        "
      >
        <div className="space-y-2">
          {players.map((player) => (
            <button
              key={player.id}
              type="button"
              className="
                w-full
                rounded-xl
                bg-scoreboard-cream
                p-3
                text-left
                font-medium
                text-black
              "
              onClick={() => {
                onAssign(
                  selectedPosition,
                  player.id
                )

                setSelectedPosition(null)
              }}
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>

      <div
        className="
          shrink-0
          border-t
          border-white/20
          bg-green-900
          p-4
          pb-[calc(1rem+env(safe-area-inset-bottom))]
        "
      >
        <button
          className="
            w-full
            rounded-xl
            bg-slate-200
            p-3
            font-medium
            text-red-500
          "
          onClick={() =>
            setSelectedPosition(null)
          }
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </>
  )
}