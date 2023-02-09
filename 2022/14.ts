import * as fs from 'fs';
import _ from 'lodash';

const graphWMin = 325;
const graphHMin = 0;

const data = fs.readFileSync('14-input.txt', { encoding: 'utf-8' });
const rocks = data.split('\n').map((rock) =>
  rock.split(' -> ').map((line) =>
    line.split(',').map((num, idx) => {
      if (idx === 0) {
        return parseInt(num) - graphWMin;
      } else {
        return parseInt(num) - graphHMin;
      }
    })
  )
);

enum Material {
  ROCK = '#',
  SAND = 'o',
  SOURCE = '+',
  EMPTY = '.',
}

const graphWMax = 675 + 1;
const graphHMax =
  2 +
  1 +
  rocks.reduce((prev, rock) => {
    const reduce = rock.reduce((prev, point) => {
      return Math.max(prev, point[1]);
    }, 0);
    return Math.max(prev, reduce);
  }, 0);
const sourceW = 500 - graphWMin;

let graphHxW: Material[][] = Array(graphHMax - graphHMin);
for (let idx = 0; idx < graphHxW.length; ++idx) {
  graphHxW[idx] = Array(graphWMax - graphWMin).fill(
    idx === graphHMax - 1 ? Material.ROCK : Material.EMPTY
  );
}

for (const rock of rocks) {
  let [currPointW, currPointH] = rock[0];
  graphHxW[currPointH][currPointW] = Material.ROCK;
  for (let idx = 1; idx < rock.length; ++idx) {
    const [nextPointW, nextPointH] = rock[idx];
    if (currPointH == nextPointH) {
      for (const iter of _.range(
        Math.min(nextPointW, currPointW),
        Math.max(nextPointW, currPointW) + 1
      )) {
        graphHxW[currPointH][iter] = Material.ROCK;
      }
    } else {
      for (const iter of _.range(
        Math.min(nextPointH, currPointH),
        Math.max(nextPointH, currPointH) + 1
      )) {
        graphHxW[iter][currPointW] = Material.ROCK;
      }
    }
    [currPointH, currPointW] = [nextPointH, nextPointW];
  }
}

let sandCounter = 0;654
function pt1() {
  while (true) {
    let [sandH, sandW] = [1, sourceW];
    while (true) {
      const nextSandH = sandH + 1;

      let nextSandW: number;
      if (graphHxW[nextSandH][sandW] === Material.EMPTY) {
        nextSandW = sandW;
      } else if (graphHxW[nextSandH][sandW - 1] === Material.EMPTY) {
        nextSandW = sandW - 1;
      } else if (graphHxW[nextSandH][sandW + 1] === Material.EMPTY) {
        nextSandW = sandW + 1;
      }

      if (nextSandW) {
        [sandH, sandW] = [nextSandH, nextSandW];
      } else {
        graphHxW[sandH][sandW] = Material.SAND;
        ++sandCounter;
        break;
      }
    }
  }
}
// pt1();
// console.log(sandCounter);
// console.log(graphHxW);

function pt2() {
  while (true) {
    let [sandH, sandW] = [0, sourceW];

    while (true) {
      const nextSandH = sandH + 1;

      let nextSandW: number;
      if (graphHxW[nextSandH][sandW] === Material.EMPTY) {
        nextSandW = sandW;
      } else if (graphHxW[nextSandH][sandW - 1] === Material.EMPTY) {
        nextSandW = sandW - 1;
      } else if (graphHxW[nextSandH][sandW + 1] === Material.EMPTY) {
        nextSandW = sandW + 1;
      }

      if (nextSandW !== undefined) {
        [sandH, sandW] = [nextSandH, nextSandW];
      } else {
        graphHxW[sandH][sandW] = Material.SAND;
        ++sandCounter;
        // console.log(
        //   JSON.stringify(graphHxW)
        //     .replace(/[,\"\]]/g, '')
        //     .split('[')
        // );
        if (sandH === 0 && sandW === sourceW) {
          return;
        }
        break;
      }
    }
  }
}
pt2();
console.log(sandCounter);
console.log(
  JSON.stringify(graphHxW)
    .replace(/[,\"\]]/g, '')
    .split('[')
    .join("\n")
);
