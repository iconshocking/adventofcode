import { log } from "console";
import { processLines } from "./utilities.js";

const pipeTypes = ["|", "-", "L", "J", "7", "F", "S"] as const;
type PipeType = (typeof pipeTypes)[number];

type Point = [number, number];
type Pipe = {
  point: Point;
  type: PipeType;
  next?: Pipe;
  prev?: Pipe;
};
let startPipe: Pipe;
const pipePointMap = new Map<string, Pipe>();

const lines = (await processLines("10-input.txt")).map((line) => line.split(""));

function pipesConnected(p1: Pipe, p2: Pipe): boolean {
  if (
    p1.point[0] - p2.point[0] + p1.point[1] - p2.point[1] === 0 ||
    p1.point[0] - p2.point[0] + p1.point[1] - p2.point[1] === 2
  ) {
    return false;
  }

  if (p1.point[1] === p2.point[1]) {
    const topP = p1.point[0] < p2.point[0] ? p1 : p2;
    const bottomP = topP === p1 ? p2 : p1;
    return ["|", "F", "7"].includes(topP.type) && ["|", "L", "J"].includes(bottomP.type);
  } else {
    const leftP = p1.point[1] < p2.point[1] ? p1 : p2;
    const rightP = leftP === p1 ? p2 : p1;
    return ["-", "L", "F"].includes(leftP.type) && ["-", "7", "J"].includes(rightP.type);
  }
}

function pt1() {
  // find start pipe
  outer: for (const [lineIdx, line] of lines.entries()) {
    for (const [pipeIdx, pipe] of line.entries()) {
      if (pipe === "S") {
        startPipe = {
          point: [lineIdx, pipeIdx],
          type: pipe,
        };
        pipePointMap.set(startPipe.point.toString(), startPipe);
        break outer;
      }
    }
  }

  // find pipes connected to start pipe
  const connectedPipes = Array<Pipe>();
  {
    let neighborPoint: [number, number];
    function addToConnected() {
      connectedPipes.push({
        point: neighborPoint,
        type: lines[neighborPoint[0]][neighborPoint[1]] as PipeType,
      });
    }
    // left neighbor
    neighborPoint = [startPipe.point[0], startPipe.point[1] - 1];
    if (["-", "L", "F"].includes(lines[neighborPoint[0]][neighborPoint[1]])) {
      addToConnected();
    }
    // right neighbor
    neighborPoint = [startPipe.point[0], startPipe.point[1] + 1];
    if (["-", "7", "J"].includes(lines[neighborPoint[0]][neighborPoint[1]])) {
      addToConnected();
    }
    // top neighbor
    neighborPoint = [startPipe.point[0] - 1, startPipe.point[1]];
    if (["|", "7", "F"].includes(lines[neighborPoint[0]][neighborPoint[1]])) {
      addToConnected();
    }
    // bottom neighbor
    neighborPoint = [startPipe.point[0] + 1, startPipe.point[1]];
    if (["|", "J", "L"].includes(lines[neighborPoint[0]][neighborPoint[1]])) {
      addToConnected();
    }
    const nextPipe = connectedPipes.pop();
    nextPipe!.prev = startPipe;
    startPipe.next = nextPipe;
    pipePointMap.set(nextPipe!.point.toString(), nextPipe!);

    const endPipe = connectedPipes.pop();
    endPipe!.next = startPipe;
    startPipe.prev = endPipe;
    pipePointMap.set(endPipe!.point.toString(), endPipe!);
  }

  // find all connected pipes
  {
    let curPipe = startPipe.next!;
    while (curPipe.point.toString() !== startPipe.prev!.point.toString()) {
      for (const neighborPoint of [
        [curPipe.point[0], curPipe.point[1] - 1],
        [curPipe.point[0], curPipe.point[1] + 1],
        [curPipe.point[0] - 1, curPipe.point[1]],
        [curPipe.point[0] + 1, curPipe.point[1]],
      ]) {
        if (
          curPipe.prev?.point.toString() === neighborPoint.toString() ||
          neighborPoint[0] < 0 ||
          neighborPoint[0] >= lines.length ||
          neighborPoint[1] < 0 ||
          neighborPoint[1] >= lines[0].length
        ) {
          continue;
        }
        const pipe: Pipe = pipePointMap.get(neighborPoint.toString()) ?? {
          point: [neighborPoint[0], neighborPoint[1]],
          type: lines[neighborPoint[0]][neighborPoint[1]] as PipeType,
        };
        if (!pipe.type) {
          continue;
        }
        if (pipesConnected(curPipe, pipe)) {
          pipePointMap.set(pipe.point.toString(), pipe);
          curPipe.next = pipe;
          pipe.prev = curPipe;
          curPipe = pipe;
          break;
        }
      }
    }
  }

  let curPipe = startPipe;
  do {
    curPipe = curPipe.next!;
  } while (curPipe !== startPipe);

  const loopLength = pipePointMap.size;
  const furthestDist = Math.floor(loopLength / 2);
  log(furthestDist);
}
pt1();
