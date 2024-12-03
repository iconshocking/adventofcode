import { log } from "console";
import { processLines } from "./utilities.js";

const lines = await processLines("2-input.txt");
const reports = lines.map((line) =>
  line
    .split(" ")
    .filter((x) => x !== "")
    .map((x) => parseInt(x))
);
const safeties: boolean[] = Array.from({ length: reports.length }, () => true);

function calcSafetyForReport(report: number[], idx: number) {
  let increasing: boolean | null = null;
  report.reduce((prev, curr) => {
    // skip if we've already determined this report is unsafe
    if (!safeties[idx]) return 0;

    if (increasing === null) {
      increasing = curr > prev;
    }
    let safe = true;
    if ((increasing && curr < prev) || (!increasing && curr > prev)) {
      safe = false;
    } else if (Math.abs(curr - prev) > 3 || Math.abs(curr - prev) === 0) {
      safe = false;
    }
    if (!safe) {
      safeties[idx] = safe;
    }
    return curr;
  });
}

function pt1() {
  reports.forEach((report, idx) => {
    calcSafetyForReport(report, idx);
  });
  const safetiesCount = safeties.filter((x) => x).length;
  log(safetiesCount);
}
// pt1();

// could easily be refined, but don't want to spend too much time on this
function pt2() {
  reports.forEach((report, idx) => {
    calcSafetyForReport(report, idx);
    if (!safeties[idx]) {
      for (let i = 0; i < report.length; i++) {
        // always set to true since will be set to false if unsafe and we break if safe at the end
        safeties[idx] = true;
        const splicedLevels = report.slice(0, i);
        if (i + 1 < report.length) {
          splicedLevels.push(...report.slice(i + 1));
        }
        calcSafetyForReport(splicedLevels, idx);
        if (safeties[idx]) break;
      }
    }
  });
  const safetiesCount = safeties.filter((x) => x).length;
  log(safetiesCount);
}
pt2();
