import { log } from "console";
import { processLines } from "./utilities.js";

type Hand = [Card, Card, Card, Card, Card];
const ranks = [
  "high card",
  "one pair",
  "two pair",
  "three of a kind",
  "full house",
  "four of a kind",
  "five of a kind",
] as const;
type Rank = (typeof ranks)[number];

const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"] as const;
type Card = (typeof cards)[number];

const lines = await processLines("7-input.txt");
const games = lines.map((game) => {
  const split = game.split(" ");
  return {
    game: split[0].split("") as Hand,
    bet: Number(split[1])!,
  };
});

function pt1() {
  function handRankCompare(hand1: Hand, hand2: Hand) {
    let hand1Rank = handRank(hand1);
    let hand2Rank = handRank(hand2);
    if (ranks.indexOf(hand1Rank) > ranks.indexOf(hand2Rank)) {
      return 1;
    } else if (ranks.indexOf(hand1Rank) < ranks.indexOf(hand2Rank)) {
      return -1;
    } else {
      for (const [idx, card] of hand1.entries()) {
        if (cards.indexOf(card) > cards.indexOf(hand2[idx])) {
          return 1;
        } else if (cards.indexOf(card) < cards.indexOf(hand2[idx])) {
          return -1;
        }
      }
      return 0;
    }
  }

  function handRank(hand: Hand): Rank {
    const counts = new Map<Card, number>();
    for (const card of hand) {
      counts.set(card, (counts.get(card) ?? 0) + 1);
    }

    let rank: Rank;
    let countsValues = [...counts.values()];
    if (countsValues.includes(5)) {
      rank = "five of a kind";
    } else if (countsValues.includes(4)) {
      rank = "four of a kind";
    } else if (countsValues.includes(3) && countsValues.includes(2)) {
      rank = "full house";
    } else if (countsValues.includes(3)) {
      rank = "three of a kind";
    } else if (countsValues.filter((count) => count === 2).length === 2) {
      rank = "two pair";
    } else if (countsValues.filter((count) => count === 2).length === 1) {
      rank = "one pair";
    } else {
      rank = "high card";
    }
    return rank;
  }

  const sortedGames = games.toSorted((game1, game2) => handRankCompare(game1.game, game2.game));
  const sum = sortedGames.reduce((acc, game, idx) => acc + game.bet * (idx + 1), 0);
  log(sum);
}
pt1();

function pt2() {
  const altCards = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"] as const;

  function handRankCompare(hand1: Hand, hand2: Hand) {
    let hand1Rank = handRank(hand1);
    let hand2Rank = handRank(hand2);
    if (ranks.indexOf(hand1Rank) > ranks.indexOf(hand2Rank)) {
      return 1;
    } else if (ranks.indexOf(hand1Rank) < ranks.indexOf(hand2Rank)) {
      return -1;
    } else {
      for (const [idx, card] of hand1.entries()) {
        if (altCards.indexOf(card) > altCards.indexOf(hand2[idx])) {
          return 1;
        } else if (altCards.indexOf(card) < altCards.indexOf(hand2[idx])) {
          return -1;
        }
      }
      return 0;
    }
  }

  function handRank(hand: Hand): Rank {
    const counts = new Map<Card, number>();
    for (const card of hand) {
      counts.set(card, (counts.get(card) ?? 0) + 1);
    }

    let rank: Rank;
    const jokerCount = counts.get("J") ?? 0;
    if (jokerCount) {
      counts.delete("J");
    }
    let maxCountEntry: [Card, number] = ["J", 0];
    [...counts.entries()].forEach((entry) => {
      maxCountEntry = entry[1] >= maxCountEntry[1] ? entry : maxCountEntry;
    });
    counts.set(maxCountEntry[0], (counts.get(maxCountEntry[0]) ?? maxCountEntry[1]) + jokerCount);

    let countsValues = [...counts.values()];
    if (countsValues.includes(5)) {
      rank = "five of a kind";
    } else if (countsValues.includes(4)) {
      rank = "four of a kind";
    } else if (countsValues.includes(3) && countsValues.includes(2)) {
      rank = "full house";
    } else if (countsValues.includes(3)) {
      rank = "three of a kind";
    } else if (countsValues.filter((count) => count === 2).length === 2) {
      rank = "two pair";
    } else if (countsValues.filter((count) => count === 2).length === 1) {
      rank = "one pair";
    } else {
      rank = "high card";
    }
    return rank;
  }

  const sortedGames = games.toSorted((game1, game2) => handRankCompare(game1.game, game2.game));
  const sum = sortedGames.reduce((acc, game, idx) => acc + game.bet * (idx + 1), 0);
  log(sum);
}
pt2();
