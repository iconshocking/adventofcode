import { log } from "console";
import { processLines } from "./utilities.js";

const WALL = "#";
const OBJECT = "O";
const EMPTY = ".";
const ROBOT = "@";

const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";
const DIRS = [UP, RIGHT, DOWN, LEFT] as const;

let map: string[][] = [];
const dirs: (typeof DIRS)[number][] = [];

const lines = await processLines("15-input.txt");
const mapDirsSplit = lines.indexOf("");
for (const line of lines.slice(0, mapDirsSplit)) {
  map.push(line.split(""));
}
for (const line of lines.slice(mapDirsSplit + 1)) {
  dirs.push(...(line.split("") as (typeof DIRS)[number][]));
}

function printMap(mapToPrint: string[][] = map) {
  mapToPrint.forEach((line) => log(line.join("")));
}

// this is all kinda messy and verbose, but it works 👍
function pt1() {
  let robotCoords: [number, number] = [-1, -1];
  map.find((line, i) => {
    const j = line.indexOf(ROBOT);
    if (j !== -1) {
      robotCoords = [i, j];
      return true;
    }
    return false;
  });

  let dir: (typeof DIRS)[number] | undefined;
  while ((dir = dirs.shift())) {
    const newCoords: [number, number] = [...robotCoords];
    switch (dir) {
      case UP:
        newCoords[0] = newCoords[0] - 1;
        break;
      case DOWN:
        newCoords[0] = newCoords[0] + 1;
        break;
      case LEFT:
        newCoords[1] = newCoords[1] - 1;
        break;
      case RIGHT:
        newCoords[1] = newCoords[1] + 1;
        break;
    }
    const newSpot = map[newCoords[0]]?.[newCoords[1]];
    if (newSpot === EMPTY) {
      map[newCoords[0]][newCoords[1]] = ROBOT;
      map[robotCoords[0]][robotCoords[1]] = EMPTY;
      robotCoords = newCoords;
    } else if (newSpot === WALL) {
      // do not update coords
      continue;
    } else if (newSpot === OBJECT) {
      function lineCheckMoveOne(idx: number) {
        switch (dir) {
          case UP:
          case LEFT:
            return idx - 1;
          case DOWN:
          case RIGHT:
            return idx + 1;
          default:
            throw new Error("Invalid direction");
        }
      }

      let emptyCoordInLineBeforeWall: [number, number] | undefined;
      switch (dir) {
        case UP:
        case DOWN:
          for (
            let i = lineCheckMoveOne(newCoords[0]);
            i >= 0 && i < map.length;
            i = lineCheckMoveOne(i)
          ) {
            if (map[i][newCoords[1]] === WALL) {
              break;
            }
            if (map[i][newCoords[1]] === EMPTY) {
              emptyCoordInLineBeforeWall = [i, newCoords[1]];
              break;
            }
          }
          break;
        case LEFT:
        case RIGHT:
          for (
            let j = lineCheckMoveOne(newCoords[1]);
            j >= 0 && j < map[newCoords[0]].length;
            j = lineCheckMoveOne(j)
          ) {
            if (map[newCoords[0]][j] === WALL) {
              break;
            }
            if (map[newCoords[0]][j] === EMPTY) {
              emptyCoordInLineBeforeWall = [newCoords[0], j];
              break;
            }
          }
          break;
      }

      if (emptyCoordInLineBeforeWall) {
        map[emptyCoordInLineBeforeWall[0]][emptyCoordInLineBeforeWall[1]] = OBJECT;
        map[newCoords[0]][newCoords[1]] = ROBOT;
        map[robotCoords[0]][robotCoords[1]] = EMPTY;
        robotCoords = newCoords;
      }
    }
  }

  printMap();

  let gpsSum = 0;
  map.forEach((line, i) => {
    line.forEach((spot, j) => {
      if (spot === OBJECT) {
        gpsSum += 100 * i + j;
      }
    });
  });
  log({ gpsSum });
}
// pt1();

const WIDE_OBJECT = "[]";

// this is really ugly and I'm not super happy with it (there is also likely a much more concise
// way to handle this recursively, but I'm not spending more time on it)
function pt2() {
  // convert map to wide version
  map = map.map((line) =>
    line
      .map((spot) => {
        switch (spot) {
          case WALL:
            return [WALL, WALL];
          case OBJECT:
            return WIDE_OBJECT.split("");
          case EMPTY:
            return [EMPTY, EMPTY];
          case ROBOT:
            return [ROBOT, EMPTY];
          default:
            throw new Error("Invalid map characters");
        }
      })
      .flat()
  );

  let robotCoords: [number, number] = [-1, -1];
  map.find((line, i) => {
    const j = line.indexOf(ROBOT);
    if (j !== -1) {
      robotCoords = [i, j];
      return true;
    }
    return false;
  });

  let dir: (typeof DIRS)[number] | undefined;
  while ((dir = dirs.shift())) {
    const newCoords: [number, number] = [...robotCoords];
    function moveRobotToNewCoords() {
      map[newCoords[0]][newCoords[1]] = ROBOT;
      map[robotCoords[0]][robotCoords[1]] = EMPTY;
      robotCoords = newCoords;
    }

    switch (dir) {
      case UP:
        newCoords[0] = newCoords[0] - 1;
        break;
      case DOWN:
        newCoords[0] = newCoords[0] + 1;
        break;
      case LEFT:
        newCoords[1] = newCoords[1] - 1;
        break;
      case RIGHT:
        newCoords[1] = newCoords[1] + 1;
        break;
    }
    const newSpot = map[newCoords[0]]?.[newCoords[1]];
    if (newSpot === EMPTY) {
      moveRobotToNewCoords();
    } else if (newSpot === WALL) {
      // do not update coords
      continue;
    } else if (WIDE_OBJECT.includes(newSpot)) {
      if (dir === UP || dir === DOWN) {
        if (
          dfsPushObjects([newCoords[0], newCoords[1] + (newSpot === WIDE_OBJECT[0] ? 0 : -1)], dir)
        ) {
          // we successfully pushed the object(s)
          moveRobotToNewCoords();
        } else {
          // we hit a wall, so don't update the robot's coords
        }
      } else {
        // this is just the pt1 process, but simpler since it's guaranteed to be within a single array
        if (dir === LEFT) {
          const leftSlice = map[newCoords[0]].slice(0, robotCoords[1] + 1);
          const firstEmpty = leftSlice.lastIndexOf(EMPTY);
          const firstWall = leftSlice.lastIndexOf(WALL);
          // if first empty spot is closer than the first wall, push
          if (firstEmpty !== -1 && firstEmpty > firstWall) {
            for (let j = firstEmpty; j < robotCoords[1]; j++) {
              map[newCoords[0]][j] = map[newCoords[0]][j + 1];
            }
            moveRobotToNewCoords();
          }
        } else {
          const rightSlice = map[newCoords[0]].slice(robotCoords[1]);
          const firstEmpty = rightSlice.indexOf(EMPTY);
          const firstWall = rightSlice.indexOf(WALL);
          // if first empty spot is closer than the first wall, push
          if (firstEmpty !== -1 && firstEmpty < firstWall) {
            for (let j = firstEmpty + robotCoords[1]; j > robotCoords[1]; j--) {
              map[newCoords[0]][j] = map[newCoords[0]][j - 1];
            }
            moveRobotToNewCoords();
          }
        }
      }
    }
  }
  printMap();

  let gpsSum = 0;
  map.forEach((line, i) => {
    line.forEach((spot, j) => {
      if (spot === WIDE_OBJECT[0]) {
        gpsSum += 100 * i + j;
      }
    });
  });
  log({ gpsSum });
}
pt2();

// perform rudimentary DFS (more of just walking down a tree) to find all objects that would be
// pushed and, starting with the furthest reachable objects, push them if they have two empty spots
// to move into (pushing the furthest makes room for earlier objects to be pushed)
// - note: we don't need to track which objects we've visited because we push them out of the way
//   before a later object would be trying to push into their spot
function dfsPushObjects(sourceObj: [number, number], dir: (typeof DIRS)[number]): boolean {
  const mapCopy = map.map((line: string[]) => [...line]);
  const stack: [number, number][] = [sourceObj];

  // coordinates are for the left side of the object
  function pushIfCan([objectI, objectJ]: [number, number], dir: (typeof DIRS)[number]): boolean {
    const directionIShift = dir === UP ? -1 : 1;
    const newObjLeft = [objectI + directionIShift, objectJ];
    const newObjRight = [objectI + directionIShift, objectJ + 1];
    const newLeftVal = mapCopy[newObjLeft![0]][newObjLeft![1]];
    const newRightVal = mapCopy[newObjRight![0]][newObjRight![1]];

    if (newLeftVal === WALL || newRightVal === WALL) {
      // if we found a wall, the object we are checking for can't be moved here
      throw new Error("Invalid map state");
    } else if (newLeftVal === EMPTY && newRightVal === EMPTY) {
      // we can move the object here
      mapCopy[newObjLeft![0]][newObjLeft![1]] = WIDE_OBJECT[0];
      mapCopy[newObjRight![0]][newObjRight![1]] = WIDE_OBJECT[1];
      mapCopy[objectI][objectJ] = EMPTY;
      mapCopy[objectI][objectJ + 1] = EMPTY;
      return true;
    } else {
      if (WIDE_OBJECT.includes(newLeftVal ?? "")) {
        stack.push(
          WIDE_OBJECT[0] === newLeftVal
            ? [objectI + directionIShift, objectJ]
            : [objectI + directionIShift, objectJ - 1]
        );
      }
      // check to make sure we don't push the same object twice (when the next object is directly
      // vertical to the current object)
      if (WIDE_OBJECT !== newLeftVal + newRightVal && WIDE_OBJECT.includes(newRightVal ?? "")) {
        stack.push(
          WIDE_OBJECT[1] === newRightVal
            ? [objectI + directionIShift, objectJ]
            : [objectI + directionIShift, objectJ + 1]
        );
      }
      return false;
    }
  }

  try {
    while (stack.length > 0) {
      const [objectCoordsI, objectCoordsJ] = stack.at(-1)!;
      if (pushIfCan([objectCoordsI, objectCoordsJ], dir)) {
        // we were able to push the object
        stack.pop();
      } else {
        // we need to continue checking the further objects in the push chain
        continue;
      }
    }
    // we pushed all objects successfully, so store the new map state
    map = mapCopy;
    return true;
  } catch (e) {
    // we hit a wall
    return false;
  }
}
