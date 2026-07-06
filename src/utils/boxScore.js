export function buildBoxScore(events = [], lineup = []) {
  return lineup.map((player) => {
    const playerEvents = events.filter(
      (event) => event.player_id === player.id || event.playerId === player.id
    )

    const hits = playerEvents.filter((event) =>
      ["single", "double", "triple", "home_run"].includes(event.event_type || event.type)
    ).length

    const atBats = playerEvents.filter((event) =>
      ["single", "double", "triple", "home_run", "out", "strikeout"].includes(
        event.event_type || event.type
      )
    ).length

    const walks = playerEvents.filter(
      (event) => (event.event_type || event.type) === "walk"
    ).length

    return {
      id: player.id,
      number: player.number,
      name: player.name,
      position: player.position,
      AB: atBats,
      H: hits,
      BB: walks,
      RBI: playerEvents.reduce((sum, event) => sum + (event.rbi || 0), 0),
      R: playerEvents.filter((event) => event.scored === true).length,
      AVG: atBats > 0 ? (hits / atBats).toFixed(3) : ".000",
    }
  })
}