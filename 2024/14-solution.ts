import { processLines } from "./utilities.js";

type Guard = {
  posX: number;
  posY: number;
  vx: number;
  vy: number;
};

const parserRegex = /p=(-?[0-9]+),(-?[0-9]+) v=(-?[0-9]+),(-?[0-9]+)/g;
const guards: Guard[] = (await processLines("14-input.txt")).map((line) => {
  const match = parserRegex.exec(line);
  parserRegex.lastIndex = 0;
  const [_, px, py, vx, vy] = match!;
  return {
    posX: parseInt(px),
    posY: parseInt(py),
    vx: parseInt(vx),
    vy: parseInt(vy),
  };
});

const GRID_HEIGHT = 103;
const GRID_WIDTH = 101;
const MIDDLE_X = Math.floor(GRID_WIDTH / 2);
const MIDDLE_Y = Math.floor(GRID_HEIGHT / 2);
const SEC_TO_ELAPSE = 100;

function printGuards(separateQuadrants: boolean = false) {
  const grid = Array.from({ length: GRID_HEIGHT }, () =>
    Array.from({ length: GRID_WIDTH }, () => 0)
  );
  guards.forEach(({ posX, posY }) => {
    grid[posY][posX] = grid[posY][posX] + 1;
  });

  for (let y = 0; y < GRID_HEIGHT; y++) {
    if (y === MIDDLE_Y && separateQuadrants) {
      process.stdout.write("\n");
      continue;
    }
    for (let x = 0; x < GRID_WIDTH; x++) {
      // avoiding new lines
      process.stdout.write(grid[y][x] === 0 ? " " : grid[y][x].toString());
      if (x === MIDDLE_X && separateQuadrants) process.stdout.write(".");
    }
    process.stdout.write("\n");
  }
}

function elapseTime(postSecTerminateCheck: (currSec: number) => boolean) {
  let currSec = 0;
  do {
    // originally multipled instead of performing each second individually, but had to make the
    // function applicable to both parts
    guards.forEach(({ posX, posY, vx, vy }, idx) => {
      posX += vx;
      posY += vy;
      posX = posX % GRID_WIDTH;
      posY = posY % GRID_HEIGHT;
      if (posX < 0) posX += GRID_WIDTH;
      if (posY < 0) posY += GRID_HEIGHT;
      guards[idx] = { posX, posY, vx, vy };
    });
    currSec++;
    if (currSec % 100 === 0) {
      console.log(currSec);
    }
  } while (!postSecTerminateCheck(currSec));
  console.log("time taken:", currSec);
}

function pt1() {
  elapseTime((currSec) => currSec === SEC_TO_ELAPSE);
  printGuards(true);
  // bounds are [inclusive, exclusive]
  const quadrants = [
    {
      xBounds: [0, MIDDLE_X],
      yBounds: [0, MIDDLE_Y],
      guardCount: 0,
    },
    {
      xBounds: [MIDDLE_X + 1, GRID_WIDTH],
      yBounds: [0, MIDDLE_Y],
      guardCount: 0,
    },
    {
      xBounds: [0, MIDDLE_X],
      yBounds: [MIDDLE_Y + 1, GRID_HEIGHT],
      guardCount: 0,
    },
    {
      xBounds: [MIDDLE_X + 1, GRID_WIDTH],
      yBounds: [MIDDLE_Y + 1, GRID_HEIGHT],
      guardCount: 0,
    },
  ];
  guards.forEach(({ posX, posY }) => {
    quadrants.forEach((quadrant) => {
      if (
        posX >= quadrant.xBounds[0] &&
        posX < quadrant.xBounds[1] &&
        posY >= quadrant.yBounds[0] &&
        posY < quadrant.yBounds[1]
      ) {
        quadrant.guardCount++;
      }
    });
  });
  console.log(quadrants.map(({ guardCount }, idx) => `quadrant ${idx} has ${guardCount} guards`));
  const product = quadrants.reduce((acc, { guardCount }) => acc * guardCount, 1);
  console.log(product);
}
// pt1();

/* Initially tried to search for when 'total count of guards adjacent to any other guard' > 250
(half of the total guards) since the problem says "most" will form the image, but I had an
off-by-one error that counted every guard as also adjacent to itself. Unfortunately, I didn't notice
the error (I figured it out later) and switched to something I considered a more surefire solution by
checking for the first image that had a minimum count of guards that are ALL mututally part of an
adjacency chain. This worked even with an off-by-one error still being present, but requires a lower
minimum adjacency count to find the image. */
const ADJACENT_MIN_GUESS = 100;
function pt2() {
  type GridEl = { guardsHere: 0; posX: number; posY: number; visited?: true };
  let grid: GridEl[][] = [];

  function dfs({ posX: sourceX, posY: sourceY }: Guard) {
    const stack: GridEl[] = [grid[sourceY][sourceX]];
    let coAdjacentGuardEls = 0;

    function checkIfGuardAdjacent(gridEl: GridEl | undefined) {
      if (!gridEl || gridEl.guardsHere === 0) return;
      stack.push(gridEl);
    }

    let gridEl: GridEl | undefined;
    let first = true;
    while ((gridEl = stack.pop())) {
      if (gridEl.visited) continue;
      gridEl.visited = true;

      if (first) {
        first = false;
      } else {
        coAdjacentGuardEls++;
      }

      const { posX, posY } = gridEl;
      checkIfGuardAdjacent(grid[posY - 1]?.[posX]);
      checkIfGuardAdjacent(grid[posY + 1]?.[posX]);
      checkIfGuardAdjacent(grid[posY]?.[posX - 1]);
      checkIfGuardAdjacent(grid[posY]?.[posX + 1]);
    }

    return coAdjacentGuardEls;
  }

  function checkGuardAdjacencies() {
    grid = Array.from({ length: GRID_HEIGHT }, (_, posY) =>
      Array.from({ length: GRID_WIDTH }, (_, posX) => ({ posX, posY, guardsHere: 0 }))
    );

    guards.forEach(({ posX, posY }) => {
      grid[posY][posX].guardsHere++;
    });

    for (const guard of guards) {
      if (grid[guard.posY][guard.posX].visited) continue;

      const coAdjacentCount = dfs(guard);
      if (coAdjacentCount >= ADJACENT_MIN_GUESS) {
        return true;
      }
    }
    return false;
  }

  elapseTime(checkGuardAdjacencies);
  printGuards();
}
pt2();
