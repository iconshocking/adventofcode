import * as fs from 'fs';

const data = fs.readFileSync('9-input.txt', { encoding: 'utf-8' });
const moves = data.split('\n').map((move) => move.split(' '));

const tailVisits = new Set();
function trackVisit(tail: [number, number]) {
  tailVisits.add(`${tail[0]},${tail[1]}`);
}

function pt1() {
  let tail: [number, number] = [0, 0];
  let head: [number, number] = [0, 0];

  trackVisit(tail);
  for (let mv of moves) {
    for (let i = 0; i < parseInt(mv[1]); ++i) {
      switch (mv[0]) {
        case 'R':
          head[0] = head[0] + 1;
          break;
        case 'L':
          head[0] = head[0] - 1;
          break;
        case 'U':
          head[1] = head[1] + 1;
          break;
        case 'D':
          head[1] = head[1] - 1;
          break;
      }

      if (Math.abs(head[0] - tail[0]) == 2 || Math.abs(head[1] - tail[1]) == 2) {
        // diagonal and not touching
        if (head[0] != tail[0] && head[1] != tail[1]) {
          // two away in x, one in y
          if (Math.abs(head[0] - tail[0]) == 2) {
            tail = [(head[0] + tail[0]) / 2, head[1]];
          }
          // two away in y, one in x
          else {
            tail = [head[0], (head[1] + tail[1]) / 2];
          }
        }
        // two away on one axis
        else {
          tail = [(head[0] + tail[0]) / 2, (head[1] + tail[1]) / 2];
        }
      }

      trackVisit(tail);
    }
  }

  console.log(tailVisits.size);
}

// pt1();

function pt2() {
  const knots: [number, number][] = Array<[number, number]>(10);
  for (let i = 0; i < knots.length; ++i) {
    knots[i] = [0, 0];
  }
  const getTail = () => knots[knots.length - 1];
  const getHead = () => knots[0];

  trackVisit(getTail());
  for (let mv of moves) {
    const head = getHead();
    for (let i = 0; i < parseInt(mv[1]); ++i) {
      switch (mv[0]) {
        case 'R':
          head[0] = head[0] + 1;
          break;
        case 'L':
          head[0] = head[0] - 1;
          break;
        case 'U':
          head[1] = head[1] + 1;
          break;
        case 'D':
          head[1] = head[1] - 1;
          break;
      }

      for (let knotIdx = 1; knotIdx < knots.length; ++knotIdx) {
        const currHead = knots[knotIdx - 1];
        const currTail = knots[knotIdx];

        if (Math.abs(currHead[0] - currTail[0]) == 2 || Math.abs(currHead[1] - currTail[1]) == 2) {
          // diagonal and not touching
          if (currHead[0] != currTail[0] && currHead[1] != currTail[1]) {
            // adjust x
            if (currHead[0] > currTail[0]) {
              currTail[0] = currTail[0] + 1;
            } else {
              currTail[0] = currTail[0] - 1;
            }
            // adjust y
            if (currHead[1] > currTail[1]) {
              currTail[1] = currTail[1] + 1;
            } else {
              currTail[1] = currTail[1] - 1;
            }
          }
          // two away on one axis
          else {
            currTail[0] = (currHead[0] + currTail[0]) / 2;
            currTail[1] = (currHead[1] + currTail[1]) / 2;
          }
        }
      }

      trackVisit(getTail());
    }
  }

  console.log(tailVisits.size);
}

pt2();
