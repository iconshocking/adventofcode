import * as fs from 'fs';

const data = fs.readFileSync('3-input.txt', { encoding: 'utf-8' });
const packs = data.split('\n');

function ptsForItem(item) {
  const lowercase = item.toLowerCase();
  let pts = lowercase.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  if (lowercase !== item) {
    pts += 26;
  }
  return pts;
}

function pt1() {
  const total = packs.reduce((sum, pack) => {
    const mid = pack.length / 2;
    let doubledItem;
    for (const item of pack.slice(0, mid)) {
      if (pack.includes(item, mid)) {
        doubledItem = item;
        break;
      }
    }
    return sum + ptsForItem(doubledItem);
  }, 0);

  console.log(total);
}

pt1();

function pt2() {
  let total = 0;
  for (let i = 0; i < packs.length; i += 3) {
    for (const item of packs[i]) {
      if (packs[i + 1].includes(item) && packs[i + 2].includes(item)) {
        total += ptsForItem(item);
        break;
      }
    }
  }
  console.log(total);
}

pt2();
