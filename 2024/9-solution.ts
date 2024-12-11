import { log } from "console";
import { processLines } from "./utilities.js";

const FREE = -1;

// input is nowhere near long enough for de-compaction to have any size problem, so we de-compact
const input = (await processLines("9-input.txt"))[0]
  .split("")
  .map((char) => parseInt(char, 10))
  .map((num, idx) => {
    const isFile = idx % 2 === 0;
    if (isFile) {
      // don't need to floor because idx is always even
      return Array.from({ length: num }, () => idx / 2);
    } else {
      return Array.from({ length: num }, () => FREE);
    }
  })
  .flat();

log(input.map((num) => (num < 0 ? "." : num)).join(""));

function pt1() {
  let swapIdx = input.length - 1;
  // back up to a file if input ends with free disk space
  function backupSwapIdx() {
    while (input[swapIdx] === FREE) swapIdx--;
  }
  backupSwapIdx();

  for (let i = 0; i < swapIdx; i++) {
    // find free block
    if (input[i] !== FREE) continue;

    input[i] = input[swapIdx];
    input[swapIdx] = FREE;
    swapIdx--;
    backupSwapIdx();
  }

  log(input.map((num) => (num < 0 ? "." : num)).join(""));
  // can upper bound hashsum with 'max file length' * 'max de-compacted position' * 'max file ID' * 'number of files' =
  // 9 * (20_000 * 9) * (20_000 / 2) * 10_000 < 10 * 100_0000 * 10_000 * 10_000 < 100_000_000_000_000 < Number.MAX_SAFE_INTEGER,
  // so no overflow risk
  const hashsum = input.reduce((acc, num, idx) => acc + Math.max(0, num) * idx, 0);
  log(input.length);
  log(hashsum);
}
// pt1();

// brute force, but it's fast enough
function pt2() {
  let swapIdx = input.length - 1;
  let swapLength = 0;
  let swapFileId = FREE - 1;

  // back up to a new file ID
  function backupSwapIdx() {
    swapLength = 0;
    const initialFiledId = input[swapIdx];
    while (input[swapIdx] === FREE || input[swapIdx] === swapFileId) {
      swapIdx--;
    }
    if (input[swapIdx] === undefined) return;

    swapFileId = input[swapIdx];
    while (input[swapIdx - swapLength] === swapFileId) swapLength++;
  }

  while (input[swapIdx] !== undefined) {
    backupSwapIdx();
    for (let i = 0; i < swapIdx; i++) {
      // find free blocks
      if (input[i] !== FREE) continue;
      let lengthOfFreeBlocks = 1;
      while (input[i + lengthOfFreeBlocks] === FREE) lengthOfFreeBlocks++;
      // not enough free blocks to swap
      if (lengthOfFreeBlocks < swapLength) {
        continue;
      }

      for (let j = 0; j < swapLength; j++) {
        input[i + j] = input[swapIdx - j];
        input[swapIdx - j] = FREE;
      }
    }
  }

  log(input.map((num) => (num < 0 ? "." : num)).join(""));
  const hashsum = input.reduce((acc, num, idx) => acc + Math.max(0, num) * idx, 0);
  log(hashsum);
}
pt2();
