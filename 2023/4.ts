import { log } from "console";
import { processLines } from "./utilities.js";

const lines = await processLines("4-input.txt");
const games: Array<{ winning: Array<number>; yours: Array<number>; matchesCount: number }> = [];

function pt1() {
  for (const line of lines) {
    const split = line.split(/(?::|\|) */);
    games.push({
      winning: split[1].trim().replace(/ +/g, ",").split(",").map(Number),
      yours: split[2].trim().replace(/ +/g, ",").split(",").map(Number),
      matchesCount: 0,
    });
  }

  let sum = 0;
  for (const game of games) {
    const matchCount = game.yours.filter((num) => game.winning.includes(num)).length;
    game.matchesCount = matchCount;
    const pts = 2 ** (matchCount - 1);
    if (matchCount) {
      sum += pts;
    }
  }

  log(sum);
}
pt1();

function pt2() {
  const count = new Array(games.length).fill(1);
  games.forEach((game, idx) => {
    for (let cardNumber = 1; cardNumber <= count[idx]; ++cardNumber) {
      for (let i = idx + 1; i < count.length && i < idx + 1 + game.matchesCount; ++i) {
        count[i] = count[i] + 1;
      }
    }
  });

  const cardsTotal = count.reduce((acc, cardCt) => acc + cardCt, 0);
  log(cardsTotal);
}
pt2();
