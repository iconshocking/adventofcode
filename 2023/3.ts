import { log } from "console";
import { processLines } from "./utilities.js";

const lines = await processLines("3-input.txt");
const gears = new Map<string, Array<number>>();

function pt1() {
  let sum = 0;

  lines.forEach((line, lineIdx) => {
    let curNumStr = {
      startIdx: -1,
      str: "",
    };

    line.split("").forEach((char, charIdx) => {
      let checkForAdj = false;
      if (Number(char) || char === "0") {
        if (curNumStr.startIdx === -1) {
          curNumStr.startIdx = charIdx;
        }
        curNumStr.str += char;
        // end of line
        if (charIdx === line.length - 1) {
          checkForAdj = true;
        }
      }
      // end of number
      else if (curNumStr.str) {
        checkForAdj = true;
      }

      if (checkForAdj) {
        outer: for (
          let row = Math.max(0, lineIdx - 1);
          row <= Math.min(lines.length - 1, lineIdx + 1);
          ++row
        ) {
          let sumPerformed = false;
          for (
            // one past the leftmost char
            let col = Math.max(0, curNumStr.startIdx - 1);
            // one past the rightmost char
            col <= Math.min(line.length - 1, curNumStr.startIdx + curNumStr.str.length);
            ++col
          ) {
            if (lines[row][col] !== "." && !Number(lines[row][col]) && lines[row][col] !== "0") {
              if (!sumPerformed) {
                const num = Number(curNumStr.str);
                sum += num;
                sumPerformed = true;
              }
              // track all possible gears for pt2
              if (lines[row][col] === "*") {
                const key = `${row},${col}`;
                if (!gears.has(key)) {
                  gears.set(key, [Number(curNumStr.str)]);
                } else {
                  gears.get(key)!.push(Number(curNumStr.str));
                }
              }
            }
          }
        }
        curNumStr = {
          startIdx: -1,
          str: "",
        };
      }
    });
  });

  log(sum);
}

pt1();

function pt2() {
  let sum = 0
  gears.forEach((adjNums, gearLoc) => {
    if (adjNums.length === 2) {
      sum += adjNums[0] * adjNums[1];
    }
  })

  log(sum);
}

pt2();
