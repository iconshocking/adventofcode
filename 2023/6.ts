import { log } from "console";
import { processLines } from "./utilities.js";

const [times, distances] = await processLines("6-input.txt");
const timesArr = times.split(/ +/).slice(1).map(Number);
const distsArr = distances.split(/ +/).slice(1).map(Number);
const races = timesArr.map((time, idx) => ({ time, dist: distsArr[idx] }));

function pt1() {
  const value = (41 - 7 + 1) * (77 - 16 + 1) * (69 - 15 + 1) * (38 - 28 + 1);
  log(value);
}
pt1();

function pt2() {
  const a = -1;
  const b = 48_93_84_66;
  const c = -261_1192_1019_1063;
  const plusVal = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  const minusVal = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  const max = Math.max(plusVal, minusVal);
  const min = Math.min(plusVal, minusVal);
  log(max, min);
  log(Math.floor(max) - Math.ceil(min) + 1);
}
pt2();
