import { processLines } from "./utilities.js";

type Node = {
  parent?: Node;
  value: number;
  next?: Node;
};

const lines = await processLines("5-input.txt");

const manuals: number[][] = [];
function buildManuals() {
  let reachedManuals = false;
  for (const line of lines) {
    if (line === "") {
      reachedManuals = true;
      continue;
    }
    if (!reachedManuals) {
      continue;
    }
    manuals.push(line.split(",").map(Number));
  }
}
buildManuals();

const comparators: { smaller: number[]; greater: number[] }[] = [];
function buildLessThanAndGreaterThan() {
  for (const line of lines) {
    if (line === "") {
      break;
    }
    const [less, greater] = line.split("|").map(Number);

    if (!comparators[less]) {
      comparators[less] = { smaller: [], greater: [] };
    }
    comparators[less].greater.push(greater);

    if (!comparators[greater]) {
      comparators[greater] = { smaller: [], greater: [] };
    }
    comparators[greater].smaller.push(less);
  }
}
buildLessThanAndGreaterThan();

// non-bubble sorting may only work by the grace of the input data construction since the rules are not transitive
function pt1() {
  let middleSum = 0;
  for (const manual of manuals) {
    const manualSorted = manual.slice();
    manualSorted.sort((a, b) =>
      comparators[a].smaller.includes(b) ? 1 : comparators[a].greater.includes(b) ? -1 : 0
    );
    if (manualSorted.join(",") === manual.join(",")) {
      middleSum += manual[(manual.length - 1) / 2];
    }
  }
  console.log(middleSum);
}
// pt1()

function pt2() {
  let middleSum = 0;
  for (const manual of manuals) {
    const manualSorted = manual.slice();
    manualSorted.sort((a, b) =>
      comparators[a].smaller.includes(b) ? 1 : comparators[a].greater.includes(b) ? -1 : 0
    );
    if (manualSorted.join(",") !== manual.join(",")) {
      middleSum += manualSorted[(manualSorted.length - 1) / 2];
    }
  }
  console.log(middleSum);
}
pt2();
