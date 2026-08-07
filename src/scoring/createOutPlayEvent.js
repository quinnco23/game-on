import { getForcedAdvanceDecisions } from "./getForcedAdvanceDecisions"

export function createOutPlayEvent({
  eventType,
  details,
  batter,
  bases,
}) {
  const isGroundout =
    eventType === "groundout"

  const isFlyout =
    eventType === "flyout"

  const isFieldersChoice =
    eventType === "fielders_choice"

  const isError =
    eventType === "error"

  const isDoublePlay =
    isGroundout &&
    details.doublePlay === true

  const enginePlayType =
    isGroundout
      ? "groundOut"
      : isFlyout
        ? "flyOut"
        : isFieldersChoice
          ? "fielderChoice"
          : isError
            ? "reachedOnError"
            : null

  if (!enginePlayType) {
    throw new Error(
      `Unsupported engine event type: ${eventType}`,
    )
  }

  if (
    isDoublePlay &&
    !bases?.first
  ) {
    throw new Error(
      "A standard ground-ball double play requires a runner on first.",
    )
  }

  if (
    isFieldersChoice &&
    !bases?.[details.retiredRunnerBase]
  ) {
    throw new Error(
      `There is no runner on ${details.retiredRunnerBase}.`,
    )
  }

  const fieldedBy =
    details.fieldedByPosition

  const putoutPosition =
    details.putoutPosition

  let fielding = {
    putouts: [],
    assists: [],
    errors: [],
  }

  if (isGroundout) {
    if (isDoublePlay) {
      fielding = {
        putouts: [
          details.middlePosition,
          putoutPosition,
        ].filter(Boolean),

        assists: [
          fieldedBy,
          details.middlePosition,
        ].filter(Boolean),

        errors: [],
      }
    } else {
      fielding = {
        putouts:
          putoutPosition
            ? [putoutPosition]
            : [],

        assists:
          fieldedBy &&
          putoutPosition &&
          fieldedBy !== putoutPosition
            ? [fieldedBy]
            : [],

        errors: [],
      }
    }
  }

  if (isFlyout) {
    fielding = {
      putouts:
        fieldedBy
          ? [fieldedBy]
          : [],

      assists: [],
      errors: [],
    }
  }

  if (isFieldersChoice) {
    fielding = {
      putouts:
        putoutPosition
          ? [putoutPosition]
          : [],

      assists:
        fieldedBy &&
        putoutPosition &&
        fieldedBy !== putoutPosition
          ? [fieldedBy]
          : [],

      errors: [],
    }
  }

  if (isError) {
    fielding = {
      putouts: [],
      assists: [],
      errors:
        details.errorPosition
          ? [details.errorPosition]
          : [],
    }
  }

  const runnerDecisions =
    isFieldersChoice
      ? {
          [details.retiredRunnerBase]:
            "out",
        }
      : isDoublePlay
        ? {
            first: "out",
            batter: "out",
          }
        : isError
          ? getForcedAdvanceDecisions(
              bases,
            )
          : {}

  const batterDestination =
    isFieldersChoice
      ? "first"
      : isError
        ? details.batterDestination ??
          "first"
        : undefined

  const playEvent = {
    id: crypto.randomUUID(),
    playType: enginePlayType,
    batter,
    batterDestination,
    runnerDecisions,

    metadata: {
      ...details,

      notation:
        details.notation,

      fielding,

      reachedOnError:
        isError,

      doublePlay:
        isDoublePlay,

      triplePlay:
        false,
    },
  }

  return {
    playEvent,
    enginePlayType,
    fielding,
    isDoublePlay,
    isFieldersChoice,
    isError,
  }
}