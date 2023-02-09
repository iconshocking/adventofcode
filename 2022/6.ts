import * as fs from 'fs';

const data = fs.readFileSync('6-input.txt', { encoding: 'utf-8' });

function pt1() {
  for (let i = 0; i + 4 <= data.length; ++i) {
    const set = new Set();
    for (const char of data.slice(i, i + 4)) {
      if (set.has(char)) break;
      set.add(char);
      if (set.size === 4) return i + 4;
    }
  }
}

// console.log(pt1());

function pt2() {
  for (let i = 0; i + 14 <= data.length; ++i) {
    const set = new Set();
    for (const char of data.slice(i, i + 14)) {
      if (set.has(char)) break;
      set.add(char);
      if (set.size === 14) return i + 14;
    }
  }
}

console.log(pt2());
