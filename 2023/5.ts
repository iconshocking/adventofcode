import { log } from "console";
import { processLines } from "./utilities.js";

const lines = (await processLines("5-input.txt")).filter((line) => !!line);

const mapNames = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];
type Range = { start: number; end: number; mappedStart: number };

const rangeLists: Array<Array<Range>> = Array.from({ length: 7 }, () => []);

let rangesIdx = -1;
for (const line of lines.slice(1)) {
  if (Number.isNaN(Number(line[0]))) {
    rangesIdx++;
    continue;
  }
  const [mappedStart, start, range] = line.split(" ");
  rangeLists[rangesIdx].push({
    start: Number(start),
    end: Math.max(Number(start) + Number(range) - 1, Number(start)),
    mappedStart: Number(mappedStart),
  });
}

function pt1() {
  let seeds = lines[0].split(" ").slice(1).map(Number);

  let lowestLocation = Infinity;
  for (const seed of seeds) {
    let value = seed;
    rangeLists: for (const rangeList of rangeLists) {
      for (const range of rangeList) {
        if (value >= range.start && value <= range.end) {
          value = range.mappedStart + value - range.start;
          // move on to next type of range list
          continue rangeLists;
        }
      }
    }
    lowestLocation = Math.min(lowestLocation, value);
  }
  log(lowestLocation);
}
pt1();

function pt2() {
  const start = Date.now();

  let seeds = lines[0].split(" ").slice(1).map(Number);
  let seedWidths: Array<[number, number]> = [];
  for (let i = 0; i < seeds.length; i = i + 2) {
    seedWidths.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
  }

  let count = 0;
  let lowestLocation = Infinity;
  for (const width of seedWidths) {
    for (let seed = width[0]; seed <= width[1]; ) {
      let maxJump = Infinity;
      let value = seed;
      rangeLists: for (const rangeList of rangeLists) {
        for (const range of rangeList) {
          if (value >= range.start && value <= range.end) {
            maxJump = Math.min(maxJump, range.end - value);
            value = range.mappedStart + value - range.start;
            // move on to next type of range list
            continue rangeLists;
          }
        }
      }
      lowestLocation = Math.min(lowestLocation, value);
      seed += Number.isFinite(maxJump) ? Math.max(maxJump, 1) : 1;
      count++;
    }
  }
  log(lowestLocation);

  const end = Date.now();
  log(end - start);
}
pt2();
