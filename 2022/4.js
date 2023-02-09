import * as fs from 'fs';

const data = fs.readFileSync('4-input.txt', { encoding: 'utf-8' });
const pairs = data.split('\n');

function pt1() {
  let fullyContainedCounter = 0;
  for (const pair of pairs) {
    const [a, b] = pair.split(',');
    const [aLow, aHigh] = a.split('-').map((value) => parseInt(value));
    const [bLow, bHigh] = b.split('-').map((value) => parseInt(value));
    if ((aLow >= bLow && aHigh <= bHigh) || (bLow >= aLow && bHigh <= aHigh)) {
      ++fullyContainedCounter;
    }
  }
  console.log(fullyContainedCounter);
}

// pt1();

function pt2() {
  let fullyContainedCounter = 0;
  for (const pair of pairs) {
    const [a, b] = pair.split(',');
    const [aLow, aHigh] = a.split('-').map((value) => parseInt(value));
    const [bLow, bHigh] = b.split('-').map((value) => parseInt(value));
    if ((aLow >= bLow && aLow <= bHigh) || (bLow >= aLow && bLow <= aHigh)) {
      ++fullyContainedCounter;
    }
  }
  console.log(fullyContainedCounter);
}

pt2()