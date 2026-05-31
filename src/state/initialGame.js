const emptyLineup = [
  { number: "7", name: "Jake", position: "P" },
  { number: "12", name: "Max", position: "C" },
  { number: "3", name: "Leo", position: "1B" },
  { number: "21", name: "Owen", position: "2B" },
  { number: "9", name: "Noah", position: "3B" },
  { number: "4", name: "Eli", position: "SS" },
  { number: "18", name: "Sam", position: "LF" },
  { number: "2", name: "Ben", position: "CF" },
  { number: "11", name: "Cole", position: "RF" },
]

export const initialGame = {
  status: "setup",

  homeTeam: "Tigers",
  awayTeam: "Lions",

  inning: 1,
  half: "top",

  outs: 0,
  balls: 0,
  strikes: 0,

  score: {
    Tigers: 0,
    Lions: 0,
  },

  lineups: {
    Tigers: emptyLineup,

    Lions: emptyLineup.map((player, index) => ({
      ...player,
      name:
        [
          "Mason",
          "Lucas",
          "Henry",
          "Jack",
          "Logan",
          "Wyatt",
          "Luke",
          "Miles",
          "Theo",
        ][index] || player.name,
    })),
  },

  battingIndex: {
    Tigers: 0,
    Lions: 0,
  },

  bases: {
    first: null,
    second: null,
    third: null,
  },

  events: [],
}