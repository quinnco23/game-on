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