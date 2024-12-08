import { log } from "console";
import { uniqWith } from "lodash-es";
import { processLines } from "./utilities.js";

const ANTINODE = "#";
const antennaRegex = /[0-9]|[a-z]|[A-Z]/g;
const grid = (await processLines("8-input.txt")).map((line) => line.split(""));

const antennaLoc: { [index: string]: [number, number][] } = {};
grid.forEach((line, x) =>
  line.forEach((cell, y) => {
    if (cell.match(antennaRegex)) {
      if (!antennaLoc[cell]) {
        antennaLoc[cell] = [];
      }
      antennaLoc[cell].push([x, y]);
    }
  })
);
log(antennaLoc);

let antinodeLocs: [number, number][] = [];

function pt1() {
  for (const [_, locs] of Object.entries(antennaLoc)) {
    for (let locIdx1 = 0; locIdx1 < locs.length - 1; locIdx1++) {
      const loc1 = locs[locIdx1];
      for (let locIdx2 = locIdx1 + 1; locIdx2 < locs.length; locIdx2++) {
        const loc2 = locs[locIdx2];
        const [dx, dy]: [number, number] = [loc2[0] - loc1[0], loc2[1] - loc1[1]];
        // copy-pasta, but it's fine
        const antiNode1: [number, number] = [loc1[0] - dx, loc1[1] - dy];
        if (grid[antiNode1[0]]?.[antiNode1[1]] !== undefined) {
          log(antiNode1);
          antinodeLocs.push(antiNode1);
        }
        const antiNode2: [number, number] = [loc2[0] + dx, loc2[1] + dy];
        if (grid[antiNode2[0]]?.[antiNode2[1]] !== undefined) {
          log(antiNode2);
          antinodeLocs.push(antiNode2);
        }
      }
    }
  }
  antinodeLocs = uniqWith(antinodeLocs, (a, b) => a[0] === b[0] && a[1] === b[1]);
  log(antinodeLocs);
  log(antinodeLocs.length);
}
// pt1();

function pt2() {
  for (const [_, locs] of Object.entries(antennaLoc)) {
    for (let locIdx1 = 0; locIdx1 < locs.length - 1; locIdx1++) {
      const loc1 = locs[locIdx1];
      for (let locIdx2 = locIdx1 + 1; locIdx2 < locs.length; locIdx2++) {
        const loc2 = locs[locIdx2];
        const [dx, dy]: [number, number] = [loc2[0] - loc1[0], loc2[1] - loc1[1]];

        let multiplier: number;
        function findAntinodesAlongLine(antinode: [number, number], subtract: boolean) {
          while (grid[antinode[0]]?.[antinode[1]] !== undefined) {
            antinodeLocs.push(antinode);
            multiplier++;
            const appliedMultiplier = multiplier * (subtract ? -1 : 1);
            antinode = [loc1[0] + dx * appliedMultiplier, loc1[1] + dy * appliedMultiplier];
          }
        }

        multiplier = 0;
        findAntinodesAlongLine(loc1, false);
        // this creates a duplicate, but we just remove it later when we check for other duplicates
        multiplier = 0;
        findAntinodesAlongLine(loc1, true);
      }
    }
  }
  antinodeLocs = uniqWith(antinodeLocs, (a, b) => a[0] === b[0] && a[1] === b[1]);
  log(antinodeLocs.length);
}
pt2();
