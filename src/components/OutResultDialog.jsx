import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { createEventDetails } from "../utils/eventFactory";

const positions = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"];

const outResults = [
  {
    label: "Groundout",
    eventType: "groundout",
    battedBallType: "ground_ball",
    defaultPutout: "1B",
    notationPrefix: "",
  },
  {
    label: "Sac Bunt",
    eventType: "sacrificeBunt",
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
];

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
};

function getNotation(
  result,
  fieldedBy,
  putoutPosition,
  middlePosition,
  doublePlay
) {
  if (result.eventType === "groundout") {
    if (doublePlay) {
      return [
        scorebookNumbers[fieldedBy],
        scorebookNumbers[middlePosition],
        scorebookNumbers[putoutPosition || "1B"],
      ].join("-");
    }

    return `${scorebookNumbers[fieldedBy]}-${
      scorebookNumbers[putoutPosition || "1B"]
    }`;
  }

  if (result.eventType === "error") {
    return `E${scorebookNumbers[fieldedBy]}`;
  }

  if (result.eventType === "fielders_choice") {
    return `FC ${scorebookNumbers[fieldedBy]}-${scorebookNumbers[putoutPosition]}`;
  }

  return `${result.notationPrefix}${scorebookNumbers[fieldedBy]}`;
}
function baseLabel(base) {
  return (
    {
      first: "1st",
      second: "2nd",
      third: "3rd",
      home: "Home",
    }[base] ?? base
  );
}

export function OutResultDialog({
  onCancel,
  onConfirm,
  bases = {},
  defense = {},
}) {
  console.log("OUT RESULT DIALOG RENDERED");
  const [selectedResult, setSelectedResult] = useState(outResults[0]);
  const [fieldedByPosition, setFieldedByPosition] = useState("SS");
  const [putoutPosition, setPutoutPosition] = useState("1B");
  const [sacrifice, setSacrifice] = useState(false);
  const [doublePlay, setDoublePlay] = useState(false);
  const [middlePosition, setMiddlePosition] = useState("2B");
  const [retiredRunnerBase, setRetiredRunnerBase] = useState("first");
  const [secondaryPutoutPosition, setSecondaryPutoutPosition] = useState("1B");
  const [errorBatterDestination, setErrorBatterDestination] = useState("first");

  const [runnerDecisions, setRunnerDecisions] = useState({});

  const notation = getNotation(
    selectedResult,
    fieldedByPosition,
    putoutPosition,
    middlePosition,
    doublePlay
  );

  function setRunnerDecision(base, destination) {
    setRunnerDecisions((current) => {
      const next = { ...current };

      if (destination === "hold") {
        delete next[base];
      } else {
        next[base] = destination;
      }

      return next;
    });
  }
  function getFielderId(position) {
    return defense?.[position] ?? null;
  }

  function submit() {
    console.log("OUT RESULT SUBMIT FIRED");

    const isError = selectedResult.eventType === "error";

    const isDoublePlay =
      (selectedResult.eventType === "groundout" ||
        selectedResult.eventType === "sacrificeBunt" ||
        selectedResult.eventType === "flyout" ||
        selectedResult.eventType === "lineout") &&
      doublePlay;

    const isAirDoublePlay =
      isDoublePlay &&
      (selectedResult.eventType === "flyout" ||
        selectedResult.eventType === "lineout");

    const fieldedById = getFielderId(fieldedByPosition);

    const putoutId = getFielderId(
      selectedResult.eventType === "groundout" ||
        selectedResult.eventType === "sacrificeBunt" ||
        selectedResult.eventType === "fielders_choice"
        ? putoutPosition
        : fieldedByPosition
    );

    const middleFielderId = isDoublePlay ? getFielderId(middlePosition) : null;

    const secondaryPutoutId = isAirDoublePlay
      ? getFielderId(secondaryPutoutPosition)
      : null;

    const details = createEventDetails({
      playType: selectedResult.eventType,
      result: selectedResult.eventType,
      battedBallType: selectedResult.battedBallType,

      fieldedByPosition,

      putoutPosition:
        selectedResult.eventType === "groundout" ||
        selectedResult.eventType === "sacrificeBunt" ||
        selectedResult.eventType === "fielders_choice"
          ? putoutPosition
          : fieldedByPosition,

      notation,
      reachedOnError: isError,

      errorPosition: isError ? fieldedByPosition : null,

      sacrifice: selectedResult.eventType === "sacrificeBunt" || sacrifice,

      doublePlay: isDoublePlay,

      middlePosition: isDoublePlay ? middlePosition : null,

      retiredRunnerBase:
        selectedResult.eventType === "fielders_choice" ||
        (selectedResult.eventType === "groundout" && isDoublePlay) ||
        (selectedResult.eventType === "flyout" && isDoublePlay) ||
        (selectedResult.eventType === "lineout" && isDoublePlay)
          ? retiredRunnerBase
          : null,

      secondaryPutoutPosition:
        isDoublePlay &&
        (selectedResult.eventType === "flyout" ||
          selectedResult.eventType === "lineout")
          ? secondaryPutoutPosition
          : null,

      batterDestination:
        selectedResult.eventType === "error" ? errorBatterDestination : null,

        runnerDecisions:
        selectedResult.eventType === "groundout" ||
        selectedResult.eventType === "sacrificeBunt" ||
        selectedResult.eventType === "flyout" ||
        selectedResult.eventType === "lineout"
          ? runnerDecisions
          : null,

      fielding: {
        putouts: isError
          ? []
          : isAirDoublePlay
          ? [fieldedById, secondaryPutoutId].filter(Boolean)
          : isDoublePlay
          ? [middleFielderId, putoutId].filter(Boolean)
          : [putoutId].filter(Boolean),

        assists: isError
          ? []
          : isAirDoublePlay
          ? fieldedById !== secondaryPutoutId
            ? [fieldedById].filter(Boolean)
            : []
          : isDoublePlay
          ? [fieldedById, middleFielderId].filter(Boolean)
          : fieldedById !== putoutId
          ? [fieldedById].filter(Boolean)
          : [],

        errors: isError ? [fieldedById].filter(Boolean) : [],
      },
    });
    console.log("DEFENSE PASSED TO DIALOG:", defense);

    console.log("FIELDING CREATED:", details.fielding);

    console.log("OUT DETAILS FINAL:", {
      selectedEventType: selectedResult.eventType,

      checkboxDoublePlay: doublePlay,

      detailsDoublePlay: details.doublePlay,

      retiredRunnerBase: details.retiredRunnerBase,

      secondaryPutoutPosition: details.secondaryPutoutPosition,

      outsExpected: isDoublePlay ? 2 : 1,

      details,
    });
    onConfirm({
      eventType: selectedResult.eventType,

      label: isDoublePlay
        ? `Double play ${notation}`
        : `${selectedResult.label} ${notation}`,

      action: {
        type:
          selectedResult.eventType === "error"
            ? "REACHED_ON_ERROR"
            : selectedResult.eventType === "fielders_choice"
            ? "FIELDERS_CHOICE"
            : "OUT",

        label: isDoublePlay
          ? `Double play ${notation}`
          : `${selectedResult.label} ${notation}`,
      },

      details,

      outsRecorded: isError ? 0 : isDoublePlay ? 2 : 1,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center border-b-2 ">
      <Card className="w-full max-w-md  bg-green-900 text-slate-950 border-2 border-scoreboard-red ">
        <CardContent className="p-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold scoreboard-label  ">
              Record Result
            </h2>
            <p className="text-xs scoreboard-label">
              Choose out type, error, or fielder's choice.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 ">
            {outResults.map((result) => (
              <Button
                key={result.eventType}
                variant={
                  selectedResult.eventType === result.eventType
                    ? "default"
                    : "secondary"
                }
                className="rounded-xl"
                onClick={() => {
                  setSelectedResult(result);

                  setSacrifice(false);
                  setDoublePlay(false);
                  setRunnerDecisions({});

                  if (result.eventType === "fielders_choice") {
                    setPutoutPosition("2B");
                    setRetiredRunnerBase("first");
                  }
                }}
              >
                {result.label}
              </Button>
            ))}
          </div>

          <div>
            <div className="font-bold mb-2 scoreboard-label ">
              {selectedResult.eventType === "error" ? "Error by" : "Fielded by"}
            </div>

            <div className="grid grid-cols-3 gap-2 ">
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

          {(selectedResult.eventType === "groundout" ||
            selectedResult.eventType === "sacrificeBunt") && (
            <div className="space-y-4 scoreboard-label">
              <div>
                <div className="mb-2 font-bold">Throw / putout to</div>

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

              {(selectedResult.eventType === "groundout" ||
  selectedResult.eventType === "sacrificeBunt") && (
                <div className="space-y-3">
                  {bases.first && (
                    <div>
                      <div className="mb-2 font-bold">
                        {bases.first.name} on 1st
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={
                            !runnerDecisions.first ? "default" : "secondary"
                          }
                          onClick={() => setRunnerDecision("first", "hold")}
                        >
                          Hold
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.first === "second"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("first", "second")}
                        >
                          2nd
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.first === "out"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("first", "out")}
                        >
                          Out
                        </Button>
                      </div>
                    </div>
                  )}

                  {bases.second && (
                    <div>
                      <div className="mb-2 font-bold">
                        {bases.second.name} on 2nd
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={
                            !runnerDecisions.second ? "default" : "secondary"
                          }
                          onClick={() => setRunnerDecision("second", "hold")}
                        >
                          Hold
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.second === "third"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("second", "third")}
                        >
                          3rd
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.second === "out"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("second", "out")}
                        >
                          Out
                        </Button>
                      </div>
                    </div>
                  )}

                  {bases.third && (
                    <div>
                      <div className="mb-2 font-bold">
                        {bases.third.name} on 3rd
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={
                            !runnerDecisions.third ? "default" : "secondary"
                          }
                          onClick={() => setRunnerDecision("third", "hold")}
                        >
                          Hold
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.third === "home"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("third", "home")}
                        >
                          Home
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.third === "out"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("third", "out")}
                        >
                          Out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <label className="flex items-center gap-3 rounded-2xl bg-white/10  p-3 text-white">
                <input
                  type="checkbox"
                  checked={doublePlay}
                  onChange={(event) => setDoublePlay(event.target.checked)}
                />

                <span className="font-medium scorebo  ">Double Play</span>
              </label>

              {doublePlay && (
                <div>
                  <div className="mb-2 font-bold">
                    Relay / second-out connection
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {positions.map((position) => (
                      <Button
                        key={position}
                        variant={
                          middlePosition === position ? "default" : "secondary"
                        }
                        className="rounded-xl"
                        onClick={() => setMiddlePosition(position)}
                      >
                        {position}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedResult.eventType === "error" && (
            <div>
              <div className="mb-2 font-bold">Batter reaches</div>

              <div className="grid grid-cols-3 gap-2">
                {["first", "second", "third"].map((base) => (
                  <Button
                    key={base}
                    variant={
                      errorBatterDestination === base ? "default" : "secondary"
                    }
                    className="rounded-xl"
                    onClick={() => setErrorBatterDestination(base)}
                  >
                    {baseLabel(base)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedResult.eventType === "fielders_choice" && (
            <div className="space-y-4">
              <div>
                <div className="mb-2 font-bold">Runner retired</div>

                <div className="grid grid-cols-3 gap-2">
                  {["first", "second", "third"].map((base) => (
                    <Button
                      key={base}
                      variant={
                        retiredRunnerBase === base ? "default" : "secondary"
                      }
                      className="rounded-xl"
                      onClick={() => setRetiredRunnerBase(base)}
                    >
                      {baseLabel(base)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 font-bold">Putout recorded by</div>

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
            </div>
          )}

          {(selectedResult.eventType === "flyout" ||
            selectedResult.eventType === "lineout") && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3">
                <input
                  type="checkbox"
                  checked={sacrifice}
                  onChange={(event) => setSacrifice(event.target.checked)}
                />

                <span className="font-medium">Sacrifice Fly</span>
              </label>

              {!doublePlay && (
                <>
                  {bases.third && (
                    <div>
                      <div className="mb-2 font-bold">
                        {bases.third.name} on 3rd
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={
                            !runnerDecisions.third ? "default" : "secondary"
                          }
                          onClick={() => setRunnerDecision("third", "hold")}
                        >
                          Hold
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.third === "home"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("third", "home")}
                        >
                          Score
                        </Button>
                      </div>
                    </div>
                  )}

                  {bases.second && (
                    <div>
                      <div className="mb-2 font-bold">
                        {bases.second.name} on 2nd
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={
                            !runnerDecisions.second ? "default" : "secondary"
                          }
                          onClick={() => setRunnerDecision("second", "hold")}
                        >
                          Hold
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.second === "third"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("second", "third")}
                        >
                          3rd
                        </Button>
                      </div>
                    </div>
                  )}

                  {bases.first && (
                    <div>
                      <div className="mb-2 font-bold">
                        {bases.first.name} on 1st
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={
                            !runnerDecisions.first ? "default" : "secondary"
                          }
                          onClick={() => setRunnerDecision("first", "hold")}
                        >
                          Hold
                        </Button>

                        <Button
                          variant={
                            runnerDecisions.first === "second"
                              ? "default"
                              : "secondary"
                          }
                          onClick={() => setRunnerDecision("first", "second")}
                        >
                          2nd
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {(selectedResult.eventType === "flyout" ||
            selectedResult.eventType === "lineout") && (
            <div className="space-y-4 border-t border-white/20 pt-4">
              <label className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-white">
                <input
                  type="checkbox"
                  checked={doublePlay}
                  onChange={(event) => setDoublePlay(event.target.checked)}
                />

                <span className="font-medium">Double Play</span>
              </label>

              {doublePlay && (
                <>
                  {/* RUNNER RETIRED */}

                  <div>
                    <div className="mb-2 font-bold">Runner doubled off</div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ["first", bases.first],
                        ["second", bases.second],
                        ["third", bases.third],
                      ]
                        .filter(([, runner]) => runner)
                        .map(([base]) => (
                          <Button
                            key={base}
                            variant={
                              retiredRunnerBase === base
                                ? "default"
                                : "secondary"
                            }
                            className="rounded-xl"
                            onClick={() => setRetiredRunnerBase(base)}
                          >
                            {baseLabel(base)}
                          </Button>
                        ))}
                    </div>
                  </div>

                  {/* SECOND PUTOUT */}

                  <div>
                    <div className="mb-2 font-bold">
                      Second putout recorded by
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {positions.map((position) => (
                        <Button
                          key={position}
                          variant={
                            secondaryPutoutPosition === position
                              ? "default"
                              : "secondary"
                          }
                          className="rounded-xl"
                          onClick={() => setSecondaryPutoutPosition(position)}
                        >
                          {position}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="rounded-2xl p-3  bg-white/10  p-3 text-white">
            <div className="text-sm ">Scorebook notation</div>
            <div className="text-2xl font-black">{notation}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="rounded-2xl"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              className="rounded-2xl"
              onClick={() => {
                console.log("CONFIRM BUTTON CLICKED");
                submit();
              }}
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
