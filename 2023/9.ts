import { log } from "console";
import { processLines } from "./utilities.js";

const lines = (await processLines("9-input.txt")).map((line) => line.split(" ").map(Number));

function pt1() {
  const dataSets = lines.map((value) => [value]);
  for (const set of dataSets) {
    for (let i = 0; ; ++i) {
      set.push([]);
      for (let j = 0; j < set[i].length - 1; ++j) {
        set[i + 1][j] = set[i][j + 1] - set[i][j];
      }
      if (set[i + 1].every((value) => value === 0)) {
        break;
      }
    }
    let evaluatingSet = set[set.length - 1];
    evaluatingSet.push(0);
    for (let i = 2; i <= set.length; ++i) {
      evaluatingSet = set[set.length - i];
      evaluatingSet.push(
        // set "below" last value
        set[set.length - i + 1][evaluatingSet.length - 1] +
          // evaluatingSet last value
          evaluatingSet[evaluatingSet.length - 1]
      );
    }
  }

  const sum = dataSets.reduce((acc, set) => acc + set[0][set[0].length - 1], 0);
  log(sum);
}
// pt1();

function pt2() {
  const dataSets = lines.map((value) => [value.reverse()]);
  for (const set of dataSets) {
    for (let i = 0; ; ++i) {
      set.push([]);
      for (let j = 0; j < set[i].length - 1; ++j) {
        set[i + 1][j] = set[i][j] - set[i][j + 1];
      }
      if (set[i + 1].every((value) => value === 0)) {
        break;
      }
    }
    let evaluatingSet = set[set.length - 1];
    evaluatingSet.push(0);
    for (let i = 2; i <= set.length; ++i) {
      evaluatingSet = set[set.length - i];
      evaluatingSet.push(
        // set "below" last value
        -1 * set[set.length - i + 1][evaluatingSet.length - 1] +
          // evaluatingSet last value
          evaluatingSet[evaluatingSet.length - 1]
      );
    }
  }

  const sum = dataSets.reduce((acc, set) => acc + set[0][set[0].length - 1], 0);
  log(sum);
}
pt2()