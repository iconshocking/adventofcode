import * as fs from 'fs';

const choicePts = {
  A: 1,
  B: 2,
  C: 3,
};
const loseTieWinMatchups = {
  A: ['C', 'A', 'B'],
  B: ['A', 'B', 'C'],
  C: ['B', 'C', 'A'],
};

let data = fs.readFileSync('2-input.txt', { encoding: 'utf-8' });

function pt1() {
  data = data.replace(/X/g, 'A');
  data = data.replace(/Y/g, 'B');
  data = data.replace(/Z/g, 'C');
  const rounds = data.split('\n');

  const total = rounds.reduce((accumulate, next) => {
    const [theirs, yours] = next.split(' ');
    const roundPts = choicePts[yours] + loseTieWinMatchups[theirs].indexOf(yours) * 3;
    return accumulate + roundPts;
  }, 0);

  console.log(total);
}

pt1();

data = fs.readFileSync('2/2-input.txt', { encoding: 'utf-8' });

function pt2() {
  const rounds = data.split('\n');

  const total = rounds.reduce((accumulate, next) => {
    const [theirs, strategy] = next.split(' ');
    const offFromX = strategy.charCodeAt(0) - 'X'.charCodeAt(0);
    const yours = loseTieWinMatchups[theirs][offFromX];
    const roundPts = choicePts[yours] + offFromX * 3;
    return accumulate + roundPts;
  }, 0);

  console.log(total);
}

pt2();
