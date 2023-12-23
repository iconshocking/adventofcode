import { log } from "console";
import { processLines } from "./utilities.js";

const lines = await processLines("8-input.txt");
const moves = lines[0].split("");

const nodes = new Map<string, [string, string]>();
lines.slice(2).forEach((line) => {
  const matches = line.match(/([1-9a-zA-Z]{3}) = \(([1-9a-zA-Z]{3}), ([1-9a-zA-Z]{3})\)/)!;
  nodes.set(matches[1], [matches[2], matches[3]]);
});

function pt1() {
  let state = {
    curNode: "AAA",
    movesCount: 0,
    atEnd: false,
  };
  do {
    for (const move of moves) {
      state.curNode = nodes.get(state.curNode)![move === "L" ? 0 : 1];
      state.movesCount++;
      if (state.curNode === "ZZZ") {
        state.atEnd = true;
      }
    }
  } while (!state.atEnd);

  log(state.movesCount);
}
// pt1();

function pt2() {
  const startNodes = [...nodes.keys()].filter((node) => node.endsWith("A"));
  const states = Array.from({ length: startNodes.length }, (_, idx) => ({
    curNode: startNodes[idx],
    movesCount: 0,
    atCycleEnd: false,
  }));
  for (const state of states) {
    do {
      for (const move of moves) {
        state.curNode = nodes.get(state.curNode)![move === "L" ? 0 : 1];
        state.movesCount++;
        if (state.curNode.endsWith("Z")) {
          state.atCycleEnd = true;
        }
      }
    } while (!state.atCycleEnd);
  }

  const movesCycleCount = moves.length;
  const cyclesRequired = states.map((state) => state.movesCount / movesCycleCount);
  const totalCyclesRequired = cyclesRequired.reduce((acc, cycles) => acc * cycles, 1);
  const totalMoves = totalCyclesRequired * movesCycleCount;
  log(totalMoves);
}
pt2();
