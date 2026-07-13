import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { createEventDetails } from "../utils/eventFactory"

const positions = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"]

const outResults = [
  {
    label: "Groundout",
    eventType: "groundout",
    battedBallType: "ground_ball",
    defaultPutout: "1B",
    notationPrefix: "",
  },
  {
    label: "Flyout",
    eventType: "flyout",
    battedBallType: "fly_ball",
    defaultPutout: null,
    notationPrefix: "F",
  },
  {
    label: "Lineout",
    eventType: "lineout",
    battedBallType: "line_drive",
    defaultPutout: null,
    notationPrefix: "L",
  },
  {
    label: "Popout",
    eventType: "popout",
    battedBallType: "popup",
    defaultPutout: null,
    notationPrefix: "P",
  },
  {
    label: "Reached on Error",
    eventType: "error",
    battedBallType: null,
    defaultPutout: null,
    notationPrefix: "E",
  },
  {
    label: "Fielder's Choice",
    eventType: "fielders_choice",
    battedBallType: "ground_ball",
    defaultPutout: null,
    notationPrefix: "FC",
  },
]

const scorebookNumbers = {
  P: "1",
  C: "2",
  "1B": "3",
  "2B": "4",
  "3B": "5",
  SS: "6",
  LF: "7",
  CF: "8",
  RF: "9",
}

function getNotation(result, fieldedBy, putoutPosition) {
  if (result.eventType === "groundout") {
    return `${scorebookNumbers[fieldedBy]}-${scorebookNumbers[putoutPosition || "1B"]}`
  }

  if (result.eventType === "error") {
    return `E${scorebookNumbers[fieldedBy]}`
  }

  if (result.eventType === "fielders_choice") {
    return `FC${scorebookNumbers[fieldedBy]}`
  }

  return `${result.notationPrefix}${scorebookNumbers[fieldedBy]}`
}

export function OutResultDialog({ onCancel, onConfirm }) {
  const [selectedResult, setSelectedResult] = useState(outResults[0])
  const [fieldedByPosition, setFieldedByPosition] = useState("SS")
  const [putoutPosition, setPutoutPosition] = useState("1B")
  const [sacrifice, setSacrifice] = useState(false)

  const notation = getNotation(
    selectedResult,
    fieldedByPosition,
    putoutPosition
  )

  function submit() {
    const isError = selectedResult.eventType === "error"

    const details = createEventDetails({
      playType: selectedResult.eventType,
      result: selectedResult.eventType,
      battedBallType: selectedResult.battedBallType,
      fieldedByPosition,
      putoutPosition:
        selectedResult.eventType === "groundout" ? putoutPosition : fieldedByPosition,
      notation,
      reachedOnError: isError,
      errorPosition: isError ? fieldedByPosition : null,
      sacrifice,
    })

    onConfirm({
      eventType: selectedResult.eventType,
      label: `${selectedResult.label} ${notation}`,
      action: {
        type: selectedResult.eventType === "error" ? "REACHED_ON_ERROR" : "OUT",
        label: `${selectedResult.label} ${notation}`,
      },
      details,
      outsRecorded: isError ? 0 : 1,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl bg-white text-slate-950">
        <CardContent className="p-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold">Record Result</h2>
            <p className="text-sm text-slate-500">
              Choose out type, error, or fielder's choice.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {outResults.map((result) => (
              <Button
                key={result.eventType}
                variant={
                  selectedResult.eventType === result.eventType
                    ? "default"
                    : "secondary"
                }
                className="rounded-xl"
                onClick={() => setSelectedResult(result)}
              >
                {result.label}
              </Button>
            ))}
          </div>

          <div>
            <div className="font-bold mb-2">
              {selectedResult.eventType === "error"
                ? "Error by"
                : "Fielded by"}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {positions.map((position) => (
                <Button
                  key={position}
                  variant={
                    fieldedByPosition === position ? "default" : "secondary"
                  }
                  className="rounded-xl"
                  onClick={() => setFieldedByPosition(position)}
                >
                  {position}
                </Button>
              ))}
            </div>
          </div>

          {selectedResult.eventType === "groundout" && (
            <div>
              <div className="font-bold mb-2">Throw / putout to</div>

              <div className="grid grid-cols-3 gap-2">
                {positions.map((position) => (
                  <Button
                    key={position}
                    variant={
                      putoutPosition === position ? "default" : "secondary"
                    }
                    className="rounded-xl"
                    onClick={() => setPutoutPosition(position)}
                  >
                    {position}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3">
            <input
              type="checkbox"
              checked={sacrifice}
              onChange={(e) => setSacrifice(e.target.checked)}
            />
            <span className="font-medium">Sacrifice</span>
          </label>

          <div className="rounded-2xl bg-slate-100 p-3">
            <div className="text-sm text-slate-500">Scorebook notation</div>
            <div className="text-2xl font-black">{notation}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="rounded-2xl" onClick={onCancel}>
              Cancel
            </Button>

            <Button className="rounded-2xl" onClick={submit}>
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}