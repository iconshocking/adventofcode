import { log } from "console";
import { processLines } from "./utilities.js";

let stones = (await processLines("11-input.txt"))[0].split(" ");

function pt1() {
  let allStones: string[] = stones;

  for (let i = 1; i <= 12; ++i) {
    const newStones = [];

    for (const stoneStr of allStones) {
      const stoneNum = Number(stoneStr);
      if (stoneNum === 0) {
        newStones.push("1");
      } else if (stoneStr.length % 2 === 0) {
        newStones.push(
          String(Number(stoneStr.substring(0, stoneStr.length / 2))),
          String(Number(stoneStr.substring(stoneStr.length / 2, stoneStr.length)))
        );
      } else {
        // I don't think that we have to worry about this ever creating a large enough integer to
        // overflow without it having an even-number of digits first and being split in half, but
        // it's just vibes (will change as needed)
        newStones.push(String(stoneNum * 2024));
      }
    }

    allStones = newStones;
    log(allStones.join(" "));
    log(allStones.length);
  }
  log(allStones.length);
}
// pt1();

// can't brute force 75 iterations, so use memoization and can use recursion since stack will only go 75 deep
function pt2() {
  // index is of format "stone-iteration"
  let stonesIterationResultingRockCount: { [index: string]: number } = {};

  function evaluateStone(stone: number, iteration: number): number {
    const memoizedResult = stonesIterationResultingRockCount[`${stone}-${iteration}`];
    if (memoizedResult) {
      return memoizedResult;
    }

    if (iteration === 0) {
      stonesIterationResultingRockCount[`${stone}-${iteration}`] = 1;
      return 1;
    }

    let result: number;
    const stoneStr = String(stone);
    if (stone === 0) {
      result = evaluateStone(1, iteration - 1);
      stonesIterationResultingRockCount[`${stone}-${iteration}`] = result;
    } else if (stoneStr.length % 2 === 0) {
      result =
        evaluateStone(Number(stoneStr.substring(0, stoneStr.length / 2)), iteration - 1) +
        evaluateStone(
          Number(stoneStr.substring(stoneStr.length / 2, stoneStr.length)),
          iteration - 1
        );
    } else {
      result = evaluateStone(stone * 2024, iteration - 1);
    }

    stonesIterationResultingRockCount[`${stone}-${iteration}`] = result;
    log("new result", `${stone}-${iteration}`, ":", result);
    return result;
  }

  // not sure if this will overflow max safe integer, so we'll change to BigInt if needed (or
  // possibly just floor or ceil the result if we're right on the cusp of safe integer precision -
  // not sure if that would work lol)
  const ITERATIONS = 75;
  let finalStoneCount = stones
    .map(Number)
    .map((stone) => evaluateStone(stone, ITERATIONS))
    .reduce((acc, val) => acc + val, 0);

  log(finalStoneCount);
}
pt2();
