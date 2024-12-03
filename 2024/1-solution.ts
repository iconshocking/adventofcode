import { log } from "console";
import { processLines } from "./utilities.js";

const lines = await processLines("1-input.txt");
const list1: number[] = [];
const list2: number[] = [];
for (const line of lines) {
  const split = line
    .split(" ")
    .filter((x) => x !== "")
    .map((x) => parseInt(x));
  list1.push(split[0]);
  list2.push(split[1]);
}

function pt1() {
  list1.sort((a, b) => a - b);
  list2.sort((a, b) => a - b);
  const diffs: number[] = [];
  list1.forEach((val, idx) => diffs.push(Math.abs(val - list2[idx])));
  const sum = diffs.reduce((acc, val) => acc + val, 0);
  log(sum);
}
// pt1();

function pt2() {
  const similarities: number[] = [];
  list1.forEach((val) => {
    similarities.push(list2.reduce((acc, compare) => (compare === val ? acc + val : acc), 0));
  });
  const sum = similarities.reduce((acc, val) => acc + val, 0);
  log(sum);
}
pt2();
