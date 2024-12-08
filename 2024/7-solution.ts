import { log } from "console";
import { processLines } from "./utilities.js";

// eq results are small enough to always fit in a 64 bit signed integer, so we don't need to use
// BigInt (calculations may overflow, but those, unless by crazy chance, will never match the
// desired result, so we probably don't need to worry about false positives)
const eqs = (await processLines("7-input.txt")).map((line) => {
  const split1 = line.split(":");
  const split2 = split1[1]
    .split(" ")
    .filter((s) => s)
    .map(Number);
  return { result: Number(split1[0]), values: split2 };
});

let possibleEqs: number[] = [];
let solutionFound = false;
function nextOp(
  resultSoFar: number,
  index: number,
  eq: {
    result: number;
    values: number[];
  },
  includeConcatOp = false
) {
  if (solutionFound) return;

  if (eq.values.length === index) {
    if (resultSoFar === eq.result) {
      possibleEqs.push(resultSoFar);
      solutionFound = true;
      return;
    }
  } else {
    nextOp(resultSoFar + eq.values[index], index + 1, eq, includeConcatOp);
    nextOp(Math.max(resultSoFar, 1) * eq.values[index], index + 1, eq, includeConcatOp);
    if (includeConcatOp) {
      nextOp(
        Number((resultSoFar ? resultSoFar.toString() : "") + eq.values[index].toString()),
        index + 1,
        eq,
        includeConcatOp
      );
    }
  }
}

function pt1() {
  for (const eq of eqs) {
    solutionFound = false;
    nextOp(0, 0, eq);
  }
  log(possibleEqs.reduce((a, b) => a + b, 0));
}
// pt1();

possibleEqs = [];
function pt2() {
  for (const eq of eqs) {
    solutionFound = false;
    nextOp(0, 0, eq, true);
  }
  log(possibleEqs.reduce((a, b) => a + b, 0));
}
pt2();
