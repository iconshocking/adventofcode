import * as fs from 'fs';
import * as readLine from 'readline';

async function everything() {
  let rl = readLine.createInterface({
    input: fs.createReadStream('5-input.txt', 'utf-8'),
    crlfDelay: Infinity,
  });

  const stacksRaw: string[] = [];
  let stacks: string[][];
  const stackIndices = [-1]; // don't use index 0
  const moveAmtFromTo: number[][] = [];

  for await (const line of rl) {
    if (line !== '') {
      stacksRaw.push(line);
    } else {
      break;
    }
  }

  const stacksNums = stacksRaw.pop()!;
  for (const char of stacksNums) {
    if (!isNaN(parseInt(char))) {
      stackIndices.push(stacksNums.indexOf(char));
    }
  }
  stacks = Array(stackIndices.length);
  for (let i = 0; i < stacks.length; ++i) {
    stacks[i] = [];
  }

  while (stacksRaw.length > 0) {
    const stackLayer = stacksRaw.pop()!;
    stackIndices.forEach((stackIndex, idx) => {
      if (stackIndex === -1) return;
      const crate = stackLayer.charAt(stackIndex);
      if (crate !== ' ') stacks[idx].push(crate);
    });
  }

  rl = readLine.createInterface({
    input: fs.createReadStream('5-input.txt', 'utf-8'),
    crlfDelay: Infinity,
  });

  for await (let line of rl) {
    if (!line.startsWith('move')) continue;

    line = line.replace('move ', '');
    line = line.replace(' from ', ',');
    line = line.replace(' to ', ',');

    moveAmtFromTo.push(line.split(',').map((num) => parseInt(num)));
  }

  ////////////////////////////////////////////////

  function pt1() {
    for (const move of moveAmtFromTo) {
      let [amt, fromIdx, toIdx] = move;
      for (; amt > 0; --amt) {
        stacks[toIdx].push(stacks[fromIdx].pop()!);
      }
    }

    let stackTops = '';
    stacks.forEach((stk) => {
      if (stk.length === 0) return;
      stackTops += stk[stk.length - 1];
    });

    console.log(stackTops);
  }

  // pt1();

  function pt2() {
    for (const move of moveAmtFromTo) {
      let [amt, fromIdx, toIdx] = move;
      const removed = stacks[fromIdx].splice(stacks[fromIdx].length - amt, amt);
      stacks[toIdx] = stacks[toIdx].concat(removed);
    }

    let stackTops = '';
    stacks.forEach((stk) => {
      if (stk.length === 0) return;
      stackTops += stk[stk.length - 1];
    });

    console.log(stackTops);
  }

  pt2();
}

everything();
