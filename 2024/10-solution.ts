import { log } from "console";
import { processLines } from "./utilities.js";

type Node = {
  altitude: number;
  coords: [number, number];
  visited: boolean;
};

const grid: Node[][] = (await processLines("10-input.txt")).map((line, i) =>
  line
    .split("")
    .map((altitude, j) => ({ altitude: Number(altitude), coords: [i, j], visited: false }))
);

function printGrid() {
  log(grid.map((row) => row.join("")).join("\n"));
}

const trailheads: Node[] = [];
grid.forEach((row, i) =>
  row.forEach((node, j) => {
    if (node.altitude === 0) trailheads.push(node);
  })
);

function dfs(source: Node): number {
  const stack: Node[] = [source];
  let peaksReachable = 0;

  let node: Node | undefined;
  function checkIfPartOfTrail(possibleTrailNode: Node | undefined) {
    if (!possibleTrailNode) return;
    if (possibleTrailNode.altitude === node!.altitude + 1) {
      stack.push(possibleTrailNode);
    }
  }

  while ((node = stack.pop())) {
    if (node.visited) continue;
    node.visited = true;

    if (node.altitude === 9) {
      peaksReachable++;
      continue;
    }

    const [i, j] = node.coords;
    checkIfPartOfTrail(grid[i - 1]?.[j]);
    checkIfPartOfTrail(grid[i + 1]?.[j]);
    checkIfPartOfTrail(grid[i]?.[j + 1]);
    checkIfPartOfTrail(grid[i]?.[j - 1]);
  }

  return peaksReachable;
}

function pt1() {
  let scores = 0;
  let source;
  while ((source = trailheads.pop())) {
    scores += dfs(source);
    // reset visited states for next trailhead dfs
    grid.forEach((row) =>
      row.forEach((node) => {
        node.visited = false;
      })
    );
  }
  log(scores);
}
// pt1();

function bfsAllRoutes(source: Node): number {
  const queue: Node[] = [source];
  let routes = 0;

  let node: Node | undefined;
  function checkIfPartOfTrail(possibleTrailNode: Node | undefined) {
    if (!possibleTrailNode) return;
    if (possibleTrailNode.altitude === node!.altitude + 1) {
      queue.push(possibleTrailNode);
    }
  }

  while ((node = queue.shift())) {
    // we don't care about visited state here because we want to count all possible routes, and we
    // don't have to worry about cycles since all trail altitudes must be monotonically increasing
    // and are bounded

    if (node.altitude === 9) {
      routes++;
      continue;
    }

    const [i, j] = node.coords;
    checkIfPartOfTrail(grid[i - 1]?.[j]);
    checkIfPartOfTrail(grid[i + 1]?.[j]);
    checkIfPartOfTrail(grid[i]?.[j + 1]);
    checkIfPartOfTrail(grid[i]?.[j - 1]);
  }

  return routes;
}

function pt2() {
  let scores = 0;
  let source;
  while ((source = trailheads.pop())) {
    scores += bfsAllRoutes(source);
  }
  log(scores);
}
pt2();
