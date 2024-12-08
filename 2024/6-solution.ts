import { log } from "console";
import { processLines } from "./utilities.js";

const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";
const DIRS = [UP, RIGHT, DOWN, LEFT];

const BLOCKED = "#";
const UNVISITED = ".";
const OBJECT = "O";
const VERTICAL = "|";
const HORIZONTAL = "-";

const lines = await processLines("6-input.txt");
const time = Date.now();
const grid = lines.map((line) => line.split("").map((c) => new Set(c)));
let initialGuardCoords: [number, number] = [-1, -1];
let guardState = { dir: UP, coords: [-1, -1] as [number, number] };
outer: for (let i = 0; i < grid.length; ++i) {
  for (let j = 0; j < grid[0].length; ++j) {
    if (grid[i][j].has(UP)) {
      initialGuardCoords = [i, j];
      guardState.coords = [i, j];
      grid[i][j].clear();
      grid[i][j].add(UNVISITED);
      break outer;
    }
  }
}

while (grid[guardState.coords[0]]?.[guardState.coords[1]] !== undefined) {
  const newCoords: [number, number] = [...guardState.coords];
  switch (guardState.dir) {
    case UP:
      newCoords[0]--;
      break;
    case DOWN:
      newCoords[0]++;
      break;
    case LEFT:
      newCoords[1]--;
      break;
    case RIGHT:
      newCoords[1]++;
      break;
  }
  const newSpotSet = grid[newCoords[0]]?.[newCoords[1]];
  if (newSpotSet?.has(BLOCKED)) {
    guardState.dir = DIRS[(DIRS.indexOf(guardState.dir) + 1) % DIRS.length];
  } else {
    const line = grid[guardState.coords[0]];
    if (line) line[guardState.coords[1]].add(guardState.dir);
    guardState.coords = newCoords;
    if (newSpotSet === undefined) {
      break;
    }
  }
}

const visited: { values: Set<string>; coords: [number, number] }[] = [];
for (let i = 0; i < grid.length; ++i) {
  for (let j = 0; j < grid[0].length; ++j) {
    const set = grid[i][j];
    if (set.has(UP) || set.has(DOWN) || set.has(LEFT) || set.has(RIGHT)) {
      visited.push({ values: new Set(set), coords: [i, j] });
    }
  }
}
log("pt 1 =", visited.length);

const initialCoordsIndex = visited.findIndex(
  ({ coords }) => coords[0] === initialGuardCoords[0] && coords[1] === initialGuardCoords[1]
);
visited.splice(initialCoordsIndex, 1);

// some copy-pasta but whatever
function guardMove(guard: { dir: string; coords: [number, number] }) {
  const newCoords: [number, number] = [...guard.coords];
  switch (guard.dir) {
    case UP:
      newCoords[0]--;
      break;
    case DOWN:
      newCoords[0]++;
      break;
    case LEFT:
      newCoords[1]--;
      break;
    case RIGHT:
      newCoords[1]++;
      break;
  }
  const newSpotSet = grid[newCoords[0]]?.[newCoords[1]];
  if (newSpotSet?.has(BLOCKED) || newSpotSet?.has(OBJECT)) {
    guard.dir = DIRS[(DIRS.indexOf(guard.dir) + 1) % DIRS.length];
  } else {
    guard.coords = newCoords;
  }
}

// use 2 pointer strategy to find loops
const loopCreatingObjectCoords: [number, number][] = [];
for (const { coords: objectInsertionCoords } of visited) {
  guardState = { dir: UP, coords: initialGuardCoords };
  const guardStateFast = { dir: UP, coords: initialGuardCoords };
  grid[objectInsertionCoords[0]][objectInsertionCoords[1]] = new Set([OBJECT]);

  while (grid[guardStateFast.coords[0]]?.[guardStateFast.coords[1]] !== undefined) {
    guardMove(guardState);
    guardMove(guardStateFast);
    guardMove(guardStateFast);
    if (
      guardState.coords[0] === guardStateFast.coords[0] &&
      guardState.coords[1] === guardStateFast.coords[1] &&
      guardState.dir === guardStateFast.dir
    ) {
      loopCreatingObjectCoords.push(objectInsertionCoords);
      break;
    }
  }

  grid[objectInsertionCoords[0]][objectInsertionCoords[1]] = new Set([UNVISITED]);
}

log("pt 2 = ", loopCreatingObjectCoords.length);
