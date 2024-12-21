import { log } from "console";
import { Heap } from "heap-js";
import { processLines } from "./utilities.js";

const SOURCE_CHAR = "S";
const END_CHAR = "E";
const WALL_CHAR = "#";
const EMPTY_CHAR = ".";

const DIRS = ["NORTH", "WEST", "SOUTH", "EAST"] as const;
type Dir = (typeof DIRS)[number];
const STARTING_DIR = "EAST";

const ROTATE_COST = 1_000;
const MOVE_COST = 1;

/* Dijkstra's

NOTE: These solutions have a lot of edge case hacks that are unnecessary if I had treated each
position on the grid as four separate nodes (one for each direction you can be facing when in that
grid position). This reduces the problem to standard Dijkstra's with weighted edges, but I was too
stubborn to change it after not realizing that initially. The part 2 solution doesn't even correctly
handle find all routes in certain situations that are luckily not present in the input, such as the
following, which has multiple shortest paths:

#####
#..E#
#S.##
#####

*/
async function pt1() {
  type Spot = {
    char: string;
    dist: number;
    coords: [number, number];
    visited?: { prev: Spot; directionFromPrev: Dir };
  };

  const grid: Spot[][] = (await processLines("16-input.txt")).map((line, i) =>
    line.split("").map((char, j) => ({ char, dist: Number.MAX_SAFE_INTEGER, coords: [i, j] }))
  );

  let source: Spot | undefined;
  let end: Spot | undefined;
  for (const line of grid) {
    for (const spot of line) {
      if (spot.char === SOURCE_CHAR) {
        source = spot;
        source.dist = 0;
        source.visited = { prev: source, directionFromPrev: STARTING_DIR };
      }
      if (spot.char === END_CHAR) {
        end = spot;
      }
    }
  }
  if (!source) throw new Error("No source found");
  if (!end) throw new Error("No end found");

  function printGrid() {
    let prevSpot = end?.visited?.prev;
    log(end?.dist);
    while (prevSpot && prevSpot !== source) {
      log(prevSpot?.dist);
      const [i, j] = prevSpot.coords;
      grid[i][j].char = "O";
      prevSpot = prevSpot.visited?.prev;
    }
    grid.forEach((row) => {
      log(
        row.reduce(
          (acc, spot) =>
            acc +
            (spot.visited && !["O", SOURCE_CHAR, END_CHAR].includes(spot.char) ? " " : spot.char),
          ""
        )
      );
    });
  }

  const minHeap = new Heap<Spot>((a, b) => a.dist - b.dist);
  minHeap.push(source);

  let currDir: Dir;
  let cheapestSpot: Spot | undefined = undefined;
  while ((cheapestSpot = minHeap.pop())) {
    if (cheapestSpot.char === END_CHAR) {
      break;
    }
    currDir = cheapestSpot.visited!.directionFromPrev;

    const updateHeapWithSpot = (
      spot: Spot | undefined,
      dir: Dir,
      nextSpotInDir: Spot | undefined
    ) => {
      // opposite direction is never optimal (except possibly at the source but by input
      // construction, the source can never turn around)
      // - note: this modulo math works because I placed opposite directions 2 away from each other
      //   in the DIRS array
      if (
        !spot ||
        spot.char === WALL_CHAR ||
        (dir !== currDir && (DIRS.indexOf(currDir) + DIRS.indexOf(dir)) % 2 === 0)
      )
        return;

      // we have already returned if we were turning around, we only need to check if we're turning
      const numberOfRotations = dir === currDir ? 0 : 1;

      const distToSpot = cheapestSpot!.dist + numberOfRotations * ROTATE_COST + MOVE_COST;

      // if we've found a shorter path to this spot, check to see if it would actually be shorter to
      // go to the next spot in the same direction than was found via the "shorter path" due to
      // having to rotate immediately afterward on the "shorter" path (compared to this new path,
      // which is able to continue straight and avoids the rotation cost)
      if (
        distToSpot <= spot.dist ||
        (nextSpotInDir && distToSpot + MOVE_COST <= nextSpotInDir.dist)
      ) {
        spot.dist = distToSpot;
        // remove then re-add spot if it's already in the heap
        if (spot.visited) {
          // this is the same object reference, so we don't need a custom comparator
          minHeap.remove(spot);
        }
        minHeap.push(spot);
        spot.visited = { prev: cheapestSpot!, directionFromPrev: dir };
      }
    };
    const [i, j] = cheapestSpot.coords;
    // tecnically don't need to check the turnaround case, but it's less complex to filter it out in
    // the subfunction
    updateHeapWithSpot(grid[i - 1][j], "NORTH", grid[i - 2]?.[j]);
    updateHeapWithSpot(grid[i][j - 1], "WEST", grid[i]?.[j - 2]);
    updateHeapWithSpot(grid[i + 1][j], "SOUTH", grid[i + 2]?.[j]);
    updateHeapWithSpot(grid[i][j + 1], "EAST", grid[i]?.[j + 2]);
  }

  printGrid();
  if (end?.visited) {
    log("shortest dist:", end!.dist);
  } else {
    log("no path found");
  }
}
// await pt1();

log("\n\n\n");

async function pt2() {
  type Spot = {
    char: string;
    dist: number;
    coords: [number, number];
    // need a visited array since we can have multiple shortest paths now
    visited: { prev: Spot; directionFromPrev: Dir }[];
  };

  type Visited = Spot["visited"][number];

  const grid: Spot[][] = (await processLines("16-input.txt")).map((line, i) =>
    line
      .split("")
      .map((char, j) => ({ char, dist: Number.MAX_SAFE_INTEGER, coords: [i, j], visited: [] }))
  );

  let source: Spot | undefined;
  let end: Spot | undefined;
  for (const line of grid) {
    for (const spot of line) {
      if (spot.char === SOURCE_CHAR) {
        source = spot;
        source.dist = 0;
        source.visited.push({ prev: source, directionFromPrev: STARTING_DIR });
      }
      if (spot.char === END_CHAR) {
        end = spot;
      }
    }
  }
  if (!source) throw new Error("No source found");
  if (!end) throw new Error("No end found");

  function printGrid() {
    const prevSpots = [...end!.visited];
    let nextPrevSpot: Visited | undefined;
    while ((nextPrevSpot = prevSpots.pop())) {
      const { prev: spot, directionFromPrev: directionDepartedSpot } = nextPrevSpot;
      if (spot === source) continue;
      const [i, j] = spot.coords;
      grid[i][j].char = "O";

      // some visited prev spots may have been added to a spot before we knew the shortest path to
      // that spot, so we need to filter to only prev spots that are actually on a shortest path
      function dist(prevSpot: Visited) {
        return (
          prevSpot.prev.dist +
          ROTATE_COST * (prevSpot.directionFromPrev !== directionDepartedSpot ? 1 : 0)
        );
      }
      const minPrevSpotDist = Math.min(...spot.visited.map(dist));
      const viablePrevSpots = spot.visited!.filter(
        (prevSpot) => dist(prevSpot) === minPrevSpotDist
      );
      prevSpots.push(...viablePrevSpots);
    }

    grid.forEach((row) => {
      log(
        row.reduce(
          (acc, spot) =>
            acc +
            (spot.visited.length > 0 && !["O", SOURCE_CHAR, END_CHAR].includes(spot.char)
              ? " "
              : spot.char),
          ""
        )
      );
    });
  }

  const minHeap = new Heap<Spot>((a, b) => a.dist - b.dist);
  minHeap.push(source);

  let currDir: Dir;
  let cheapestSpot: Spot | undefined = undefined;
  while ((cheapestSpot = minHeap.pop())) {
    if (cheapestSpot.char === END_CHAR || cheapestSpot.dist > end!.dist) {
      break;
    }
    currDir = cheapestSpot.visited!.at(-1)!.directionFromPrev;

    // complete copy-pasta here, but don't care to extract this
    const updateHeapWithSpot = (
      spot: Spot | undefined,
      dir: Dir,
      nextSpotInDir: Spot | undefined
    ) => {
      if (
        !spot ||
        spot.char === WALL_CHAR ||
        (dir !== currDir && (DIRS.indexOf(currDir) + DIRS.indexOf(dir)) % 2 === 0)
      )
        return;

      const numberOfRotations = dir === currDir ? 0 : 1;
      const distToSpot = cheapestSpot!.dist + numberOfRotations * ROTATE_COST + MOVE_COST;

      if (
        distToSpot <= spot.dist ||
        (nextSpotInDir && distToSpot + MOVE_COST <= nextSpotInDir.dist)
      ) {
        spot.dist = distToSpot;
        if (spot.visited) {
          minHeap.remove(spot);
        }
        minHeap.push(spot);
        spot.visited.push({ prev: cheapestSpot!, directionFromPrev: dir });
      }
    };
    const [i, j] = cheapestSpot.coords;
    updateHeapWithSpot(grid[i - 1][j], "NORTH", grid[i - 2]?.[j]);
    updateHeapWithSpot(grid[i][j - 1], "WEST", grid[i]?.[j - 2]);
    updateHeapWithSpot(grid[i + 1][j], "SOUTH", grid[i + 2]?.[j]);
    updateHeapWithSpot(grid[i][j + 1], "EAST", grid[i]?.[j + 2]);
  }

  printGrid();
  const nonStartEndSpotsOnShortestPaths = grid.reduce((acc, row) => {
    return acc + row.filter((spot) => spot.char === "O").length;
  }, 0);
  log("spots on shortest paths:", nonStartEndSpotsOnShortestPaths + 2 /* source and end */);
}
await pt2();
