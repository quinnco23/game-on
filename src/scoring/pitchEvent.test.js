import { describe, expect, it, vi } from "vitest"
import {
  createPitchEvent,
  PITCH_RESULTS,
} from "./pitchEvent"

describe("createPitchEvent", () => {
  it("creates a ball pitch event", () => {
    const event = createPitchEvent({
      pitcherId: "pitcher-1",
      batterId: "batter-1",
      result: PITCH_RESULTS.BALL,
      inning: 1,
      half: "top",
    })

    expect(event).toMatchObject({
      type: "pitch",
      pitcherId: "pitcher-1",
      batterId: "batter-1",
      result: "ball",
      inning: 1,
      half: "top",
    })

    expect(event.id).toBeTruthy()
    expect(event.timestamp).toEqual(
      expect.any(Number)
    )
  })

  it("creates a called strike pitch event", () => {
    const event = createPitchEvent({
      pitcherId: "pitcher-2",
      batterId: "batter-2",
      result: PITCH_RESULTS.CALLED_STRIKE,
      inning: 3,
      half: "bottom",
    })

    expect(event).toMatchObject({
      type: "pitch",
      pitcherId: "pitcher-2",
      batterId: "batter-2",
      result: "calledStrike",
      inning: 3,
      half: "bottom",
    })
  })
})