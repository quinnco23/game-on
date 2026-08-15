import { useState } from "react"

const spots = {
  P:  { left: "50%", top: "65%" },
  C:  { left: "50%", top: "90%" },

  "1B": { left: "68%", top: "56%" },
  "2B": { left: "62%", top: "48%" },
  "3B": { left: "33%", top: "55%" },
  SS:   { left: "38%", top: "48%" },

  LF: { left: "15%", top: "40%" },
  CF: { left: "50%", top: "21%" },
  RF: { left: "85%", top: "40%" },
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
      <div className="absolute inset-20 pointer-events-none z-10 h-75 ">
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
    px-2 py-1
    text-center text-white
    shadow-lg
  "
>
  <div className="max-w-10 truncate text-[8px]">
    {player?.name ?? "Assign"}
  </div>

  <div className="text-[7px] font-bold opacity-70">
    {position}
  </div>

  {position === "P" && (
    <div className=" text-[7px] font-semibold">
      Pitches: {pitchCount}
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
        <div className="
          fixed inset-0 z-50
          flex items-end
          bg-black/60
          sm:items-center
          sm:justify-center
        ">
          <div className="
            w-full rounded-t-3xl
            bg-green-900 p-4
            sm:max-w-sm
            sm:rounded-3xl
          ">


            <div className="mb-3 text-lg font-bold">
              Assign {selectedPosition}
            </div>
            



            <div className="space-y-2">
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className="
                    w-full rounded-xl
                    bg-slate-100 p-3 text-black
                    text-left font-medium
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

            <button
              className="
                mt-4 w-full
                rounded-xl
                bg-slate-200 p-3 text-red-500
              "
              onClick={() =>
                setSelectedPosition(null)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}