import { log } from "console";
import { processLines } from "./utilities.js";

const A_PRESS_COST = 3;
const B_PRESS_COST = 1;

// change to 0 for pt 1 solution (note: operations never multiply this value by more than a
// two-digit number, so overflow shouldn't be an issue, but we can address it if I am mistaken)
const UNIT_CONVERSION_SHIFT = 10_000_000_000_000;

const lines = await processLines("13-input.txt");

const parsingRegex = /^.*: X[+=]([0-9]+), Y[+=]([0-9]+)$/g;
const equations: { a: [number, number]; b: [number, number]; goal: [number, number] }[] = [];
for (let i = 0; i < lines.length; i += 4) {
  const a = parsingRegex.exec(lines[i])!;
  parsingRegex.lastIndex = 0;
  const b = parsingRegex.exec(lines[i + 1])!;
  parsingRegex.lastIndex = 0;
  const goal = parsingRegex.exec(lines[i + 2])!;
  parsingRegex.lastIndex = 0;
  equations.push({
    a: [Number(a[1]), Number(a[2])],
    b: [Number(b[1]), Number(b[2])],
    goal: [Number(goal[1]) + UNIT_CONVERSION_SHIFT, Number(goal[2]) + UNIT_CONVERSION_SHIFT],
  });
}

// a/b press formula derived on paper
function solveSystemsOfEquations() {
  const solutions: { aPresses: number; bPresses: number }[] = [];
  equations.forEach((equation, idx) => {
    const {
      a,
      b,
      goal,
      a: [ax, ay],
      b: [bx, by],
      goal: [gx, gy],
    } = equation;

    const aPresses = (bx * gy - by * gx) / (ay * bx - by * ax);
    // infinite solutions because a and b are same line, so determine which one is more cost efficient
    if (Number.isNaN(aPresses)) {
      if (ax / bx < A_PRESS_COST / B_PRESS_COST) {
        // a is less cost efficient
        const bPresses = gx / bx;
        solutions[idx] = { aPresses: 0, bPresses };
      } else {
        // b is less cost efficient
        const aPresses = Math.floor(gy / ay);
        const bPresses = (gx - ax * aPresses) / bx;
        solutions[idx] = { aPresses, bPresses };
      }
    } else {
      const bPresses = (gx - ax * aPresses) / bx;
      // solutions are not positive integers
      if (
        Math.min(aPresses, bPresses) < 0 ||
        !Number.isInteger(aPresses) ||
        !Number.isInteger(bPresses)
      ) {
        return;
      }
      solutions[idx] = { aPresses, bPresses };
    }
  });

  solutions.forEach((solution, idx) =>
    log(`Equation ${idx + 1}: ${solution.aPresses} A presses, ${solution.bPresses} B presses`)
  );

  const totalCost = solutions.reduce(
    (acc, { aPresses, bPresses }) => acc + aPresses * A_PRESS_COST + bPresses * B_PRESS_COST,
    0
  );
  log(`Total cost: ${totalCost}`);
}
solveSystemsOfEquations();
