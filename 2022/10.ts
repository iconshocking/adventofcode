import * as fs from 'fs';

const data = fs.readFileSync('10-input.txt', { encoding: 'utf-8' });
const ops: (NoOp | AddOp)[] = data
  .split('\n')
  .reverse()
  .map((opStr) =>
    opStr === 'noop' ? { type: 'noop' } : { type: 'addx', add: parseInt(opStr.split(' ')[1]!) }
  );

interface NoOp {
  type: 'noop';
}
interface AddOp {
  type: 'addx';
  add: number;
  cyclesRemaining?: number;
}

function pt1() {
  let signalStrengthSum = 0;
  let cycle = 1;
  let x = 1;
  let cyclesRemainingForOp = 0;
  let op: NoOp | AddOp | undefined;

  const updateOp = () => {
    op = ops.pop();
    if (!op) return;
    cyclesRemainingForOp = op.type === 'noop' ? 1 : 2;
  };

  updateOp();
  while (!!op) {
    if ((cycle - 20) % 40 === 0) {
      signalStrengthSum += cycle * x;
    }
    --cyclesRemainingForOp;
    if (cyclesRemainingForOp == 0) {
      if (op.type === 'addx') {
        x += op.add;
      }
      updateOp();
    }
    ++cycle;
  }

  signalStrengthSum;
}

// pt1();

function pt2() {
  let cycle = 1;
  let x = 1;
  let cyclesRemainingForOp = 0;
  let op: NoOp | AddOp | undefined;
  let pixel: '#' | '.' = '.';
  const pixelGrid: string[][] = [];

  const updateOp = () => {
    op = ops.pop();
    if (!op) return;
    cyclesRemainingForOp = op.type === 'noop' ? 1 : 2;
  };
  updateOp();
  while (!!op) {
    const pixelPos = (cycle - 1) % 40;
    if (pixelPos == 0) {
      pixelGrid.push([]);
    }
    if (pixelPos >= x - 1 && pixelPos <= x + 1) {
      pixel = '#';
    } else {
      pixel = '.';
    }
    pixelGrid[pixelGrid.length - 1].push(pixel);

    --cyclesRemainingForOp;
    if (cyclesRemainingForOp == 0) {
      if (op.type === 'addx') {
        x += op.add;
      }
      updateOp();
    }
    ++cycle;
  }

  const crt = pixelGrid.reduce(
    (accumulated, line) => accumulated + '\n' + line.reduce((pixel, next) => (pixel += next)),
    ''
  );
  crt;
}

pt2();
