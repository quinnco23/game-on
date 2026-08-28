import { useState } from "react"
import { Button } from "./ui/button"

const PRESETS = {
  tournament: {
    label: "6 Innings / 1:40",
    innings: 6,
    timeLimitMinutes: 100,
    timeLimitRule: "no_new_inning",
    allowExtraInnings: false,
  },

  sixInnings: {
    label: "6 Innings / No Time Limit",
    innings: 6,
    timeLimitMinutes: null,
    timeLimitRule: "none",
    allowExtraInnings: false,
  },

  custom: {
    label: "Custom",
  },
}

function TeamRunLimit({
  label,
  value = {},
  onChange,
}) {
  return (
    <div className="rounded-xl bg-black/20 p-3">
      <div className="mb-2 font-bold">
        {label}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={value.enabled ?? false}
          onChange={(e) =>
            onChange({
              ...value,
              enabled: e.target.checked,
            })
          }
        />

        Run cap
      </label>

      {value.enabled && (
        <div className="mt-3">
          <input
            type="number"
            min="1"
            max="99"
            value={value.runs ?? 5}
            className="
              w-full
              rounded-lg
              bg-white
              p-2
              text-black
            "
            onChange={(e) =>
              onChange({
                ...value,
                runs:
                  Number(e.target.value),
              })
            }
          />

          <div className="mt-1 text-xs opacity-60">
            runs per inning
          </div>
        </div>
      )}
    </div>
  )
}

export function GameFormatSelector({
  value,
  onChange,
}) {
  const [preset, setPreset] =
    useState("tournament")

  function applyPreset(key) {
    setPreset(key)

    if (key === "custom") {
      return
    }

    onChange(PRESETS[key])
  }

  return (
    <section className="space-y-4">
      <div>
        <div className="scoreboard-label">
          Game Format
        </div>

        <div className="mt-1 text-sm opacity-60">
          Choose the innings and time limit.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {Object.entries(PRESETS).map(
          ([key, option]) => (
            <Button
              key={key}
              type="button"
              variant={
                preset === key
                  ? "default"
                  : "secondary"
              }
              className="justify-start rounded-none py-5"
              onClick={() =>
                applyPreset(key)
              }
            >
              {option.label}
            </Button>
          )
        )}
      </div>

      {preset === "custom" && (
        <div className="space-y-4 border-t border-white/20 pt-4">

<div className="space-y-4 border-t border-white/20 pt-4">
  <div>
    <div className="font-black uppercase">
      Run Limit Per Inning
    </div>

    <div className="text-sm text-white/60">
      End a team's half-inning when its
      run limit is reached.
    </div>
  </div>

  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={
        value?.runLimit?.enabled ??
        false
      }
      onChange={(e) =>
        onChange({
          ...value,
      
          runLimit: {
            ...(value?.runLimit ?? {}),
      
            enabled:
              e.target.checked,
      
            home:
              value?.runLimit?.home ?? {
                enabled: true,
                runs: 5,
              },
      
            away:
              value?.runLimit?.away ?? {
                enabled: true,
                runs: 5,
              },
      
            lastInningUnlimited:
              value?.runLimit
                ?.lastInningUnlimited ??
              false,
          },
        })
      }
    />

    Enable run limit
  </label>

  {value?.runLimit?.enabled && (
    <div className="grid grid-cols-2 gap-3">
      <TeamRunLimit
        label="Home"
        value={
          value?.runLimit?.home ?? {
            enabled: true,
            runs: 5,
          }
        }
        onChange={(home) =>
          onChange({
            ...value,

            runLimit: {
              ...(value?.runLimit ?? {}),
              home,
            },
          })
        }
      />

      <TeamRunLimit
        label="Away"
        value={
          value?.runLimit?.away ?? {
            enabled: true,
            runs: 5,
          }
        }
        onChange={(away) =>
          onChange({
            ...value,

            runLimit: {
              ...(value?.runLimit ?? {}),
              away,
            },
          })
        }
      />
    </div>
  )}
</div>

          <label className="block space-y-2">
            <span className="scoreboard-label">
              Innings
            </span>

            <input
              type="number"
              min="1"
              className="scoreboard-input w-full"
              value={
                value?.innings ?? 6
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  innings:
                    Number(
                      event.target.value
                    ),
                })
              }
            />
          </label>

          <label className="block space-y-2">
            <span className="scoreboard-label">
              Time Limit (minutes)
            </span>

            <input
              type="number"
              min="0"
              className="scoreboard-input w-full"
              value={
                value?.timeLimitMinutes ??
                100
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  timeLimitMinutes:
                    Number(
                      event.target.value
                    ),
                })
              }
            />
          </label>

          <label className="block space-y-2">
            <span className="scoreboard-label">
              When Time Expires
            </span>

            <select
              className="scoreboard-input w-full"
              value={
                value?.timeLimitRule ??
                "no_new_inning"
              }
              onChange={(event) =>
                onChange({
                  ...value,
                  timeLimitRule:
                    event.target.value,
                })
              }
            >
              <option value="no_new_inning">
                No New Inning
              </option>

              <option value="finish_inning">
                Finish Current Inning
              </option>

              <option value="none">
                No Time Rule
              </option>
            </select>
          </label>
        </div>
      )}
    </section>
  )
}