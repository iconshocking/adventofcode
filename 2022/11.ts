import * as fs from 'fs';

interface Monkey {
  items: number[];
  operation: (number) => number;
  test: (number) => number;
  inspectCount: number;
}

let commonModulo = 1;

const data = fs.readFileSync('11-input.txt', { encoding: 'utf-8' });
const monkeys: Monkey[] = data.split('\n\n').map((monkey) => {
  const traits = monkey.split('\n');
  const items = traits[1]
    .replace(/\s/g, '')
    .replace('Startingitems:', '')
    .split(',')
    .map((str) => parseInt(str));

  const opPlusNum = traits[2].replace(/\s/g, '').replace('Operation:new=old', '');
  const num = parseInt(opPlusNum.slice(1));
  let operation: (number) => number;
  if (opPlusNum[0] === '*') {
    operation = (value: number) => value * (!Number.isNaN(num) ? num : value);
  } else {
    operation = (value: number) => value + (!Number.isNaN(num) ? num : value);
  }

  const divisor = parseInt(traits[3].replace(/\s/g, '').replace('Test:divisibleby', ''));
  commonModulo *= divisor;
  const test = (value: number) =>
    value % divisor === 0
      ? parseInt(traits[4].replace(/\s/g, '').replace('Iftrue:throwtomonkey', ''))
      : parseInt(traits[5].replace(/\s/g, '').replace('Iffalse:throwtomonkey', ''));

  return {
    items,
    operation,
    test,
    inspectCount: 0,
  };
});

function pt1() {
  for (let i = 0; i < 20; ++i) {
    for (const monkey of monkeys) {
      for (let item = monkey.items.shift(); !!item; item = monkey.items.shift()) {
        monkey.inspectCount = monkey.inspectCount + 1;
        const update = Math.floor(monkey.operation(item) / 3);
        const testResult = monkey.test(update);
        monkeys[testResult].items.push(update);
      }
    }
  }

  const inspectSortedMonkeys = monkeys.sort((l, r) => l.inspectCount - r.inspectCount).reverse();
  console.log(inspectSortedMonkeys[0].inspectCount * inspectSortedMonkeys[1].inspectCount);
}
// pt1()

function pt2() {
  for (let i = 0; i < 10000; ++i) {
    for (const monkey of monkeys) {
      for (let item = monkey.items.shift(); !!item; item = monkey.items.shift()) {
        monkey.inspectCount = monkey.inspectCount + 1;
        const update = monkey.operation(item) % commonModulo;
        const testResult = monkey.test(update);
        monkeys[testResult].items.push(update);
      }
    }
  }

  const inspectSortedMonkeys = monkeys.sort((l, r) => l.inspectCount - r.inspectCount).reverse();
  console.log(inspectSortedMonkeys[0].inspectCount * inspectSortedMonkeys[1].inspectCount);
}
pt2();
