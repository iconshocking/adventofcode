import { log } from "console";
import { processLines } from "./utilities.js";

const XMAS = "XMAS";
const lines = (await processLines("4-input.txt")).map((line) => line.split(""));
const printout = lines.map((line) => line.map((x) => "."));

// could clean this up, but who cares? lol
function pt1() {
  let count = 0;

  function increment(i: number, j: number) {
    count++;
    printout[i][j] = "X";
  }

  lines.forEach((line, i) => {
    line.forEach((char, j) => {
      if (char !== "X") return;

      if (lines[i]?.[j] + lines[i]?.[j + 1] + lines[i]?.[j + 2] + lines[i]?.[j + 3] === XMAS) {
        increment(i, j);
      }
      if (lines[i]?.[j] + lines[i]?.[j - 1] + lines[i]?.[j - 2] + lines[i]?.[j - 3] === XMAS) {
        increment(i, j);
      }
      if (lines[i]?.[j] + lines[i + 1]?.[j] + lines[i + 2]?.[j] + lines[i + 3]?.[j] === XMAS) {
        increment(i, j);
      }
      if (lines[i]?.[j] + lines[i - 1]?.[j] + lines[i - 2]?.[j] + lines[i - 3]?.[j] === XMAS) {
        increment(i, j);
      }
      if (
        lines[i]?.[j] + lines[i + 1]?.[j + 1] + lines[i + 2]?.[j + 2] + lines[i + 3]?.[j + 3] ===
        XMAS
      ) {
        increment(i, j);
      }
      if (
        lines[i]?.[j] + lines[i - 1]?.[j + 1] + lines[i - 2]?.[j + 2] + lines[i - 3]?.[j + 3] ===
        XMAS
      ) {
        increment(i, j);
      }
      if (
        lines[i]?.[j] + lines[i + 1]?.[j - 1] + lines[i + 2]?.[j - 2] + lines[i + 3]?.[j - 3] ===
        XMAS
      ) {
        increment(i, j);
      }
      if (
        lines[i]?.[j] + lines[i - 1]?.[j - 1] + lines[i - 2]?.[j - 2] + lines[i - 3]?.[j - 3] ===
        XMAS
      ) {
        increment(i, j);
      }
    });
  });

  log(count);
  log(printout.map((line) => line.join("")).join("\n"));
}
// pt1();

function pt2() {
  let count = 0;

  function increment(i: number, j: number) {
    count++;
    printout[i][j] = "A";
  }

  lines.forEach((line, i) => {
    line.forEach((char, j) => {
      if (char !== "A") return;

      const topLtoBottomR = lines[i - 1]?.[j - 1] + lines[i + 1]?.[j + 1];
      const bottomLtoTopR = lines[i + 1]?.[j - 1] + lines[i - 1]?.[j + 1];
      if (
        (topLtoBottomR === "SM" || topLtoBottomR === "MS") &&
        (bottomLtoTopR === "SM" || bottomLtoTopR === "MS")
      ) {
        increment(i, j);
      }
    });
  });

  log(count);
  log(printout.map((line) => line.join("")).join("\n"));
}
pt2();
