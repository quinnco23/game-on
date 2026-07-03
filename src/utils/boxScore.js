function buildBoxScore(events, lineup) {
  return lineup.map((player) => {
    const playerEvents = events.filter(
      (event) => event.player_id === player.player_id
    )

    return {
      playerName: player.name,
      number: player.number,
      position: player.position,

      AB: playerEvents.filter((e) =>
        ["single", "double", "triple", "home_run", "out", "strikeout"].includes(e.event_type)
      ).length,

      H: playerEvents.filter((e) =>
        ["single", "double", "triple", "home_run"].includes(e.event_type)
      ).length,

      BB: playerEvents.filter((e) => e.event_type === "walk").length,

      R: events.filter(
        (e) => e.event_type === "run_scored" && e.player_id === player.player_id
      ).length,

      RBI: playerEvents.reduce((sum, e) => sum + (e.rbi || 0), 0),
    }
  })
}