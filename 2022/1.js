import * as fs from 'fs';

const data = fs.readFileSync('1-input.txt', { encoding: 'utf-8' });

function pt1() {
  let highestCalorie = 0;
  const elves = data.split('\n\n');
  elves.forEach((elf, idx) => {
    const calorieCount = elf
      .split('\n')
      .reduce((accumulate, snack) => accumulate + parseInt(snack), 0);
    if (calorieCount > highestCalorie) {
      highestCalorie = calorieCount;
    }
  });
  console.log('pt1 = ' + highestCalorie);
}

pt1();

function pt2() {
  const elves = data.split('\n\n');
  const summedElves = elves.map((elf) => {
    const calorieCount = elf
      .split('\n')
      .reduce((accumulate, snack) => accumulate + parseInt(snack), 0);
    return calorieCount;
  });
  summedElves.sort((a, b) => a - b);
  const len = summedElves.length;
  const top3Sum = summedElves[len - 1] + summedElves[len - 2] + summedElves[len - 3];
  console.log('pt2 = ' + top3Sum);
}

pt2();
