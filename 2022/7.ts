import * as fs from 'fs';

const data = fs.readFileSync('7-input.txt', { encoding: 'utf-8' });
const cmdsWithResults = data
  .split('\n$ ')
  .map((chunk) => chunk.split('\n'))
  .slice(1);

interface File {
  readonly type: 'file';
  name: string;
  size: number;
}
interface Directory {
  readonly type: 'dir';
  parent?: Directory;
  name: string;
  size?: number;
  contents: Record<string, File | Directory>;
}

function createDir(name: string, parent?: Directory): Directory {
  return { type: 'dir', name, parent, contents: {} };
}

let currDir: Directory = createDir('/');
cmdsWithResults.forEach((chunk) => {
  const [cmd, ...results] = chunk;
  if (cmd.startsWith('cd')) {
    const dirName = cmd.replace('cd ', '');
    if (dirName === '..') {
      currDir = currDir.parent!;
    } else {
      currDir = currDir.contents[cmd.replace('cd ', '')] as Directory;
    }
  } else if (cmd.startsWith('ls')) {
    results.forEach((result) => {
      if (result.startsWith('dir')) {
        const dirName = result.replace('dir ', '');
        currDir.contents[dirName] = createDir(dirName, currDir);
      } else {
        const [size, name] = result.split(' ');
        currDir.contents[name] = { type: 'file', name, size: parseInt(size) };
      }
    });
  }
});

while (currDir.parent) {
  currDir = currDir.parent;
}

const sizeCompute = (dir: Directory) => {
  let size = 0;
  Object.values(dir.contents).forEach((item) => {
    if (item.type === 'dir') {
      sizeCompute(item);
    }
    size += item.size!;
  });
  dir.size = size;
};
sizeCompute(currDir);

function pt1() {
  let trimmedSize = 0;
  const trimmedSizeCompute = (dir: Directory) => {
    if (dir.size! <= 100000) {
      trimmedSize += dir.size!;
    }
    Object.values(dir.contents).forEach((item) => {
      if (item.type === 'dir') {
        trimmedSizeCompute(item);
      }
    });
  };
  trimmedSizeCompute(currDir);
  console.log(trimmedSize);
}

// pt1();

function pt2() {
  const TOTAL_STORAGE = 70000000;
  const NEEDED_STORAGE = 30000000;

  const additionalSpaceNeeded = Math.abs(TOTAL_STORAGE - NEEDED_STORAGE - currDir.size!);
  let dirToDelete: Directory | undefined = undefined;
  const sizeCheck = (dir: Directory) => {
    if (dir.size! >= additionalSpaceNeeded) {
      if (!dirToDelete || dirToDelete.size! >= dir.size!) {
        dirToDelete = dir;
      }
    }
    Object.values(dir.contents).forEach((item) => {
      if (item.type === 'dir') {
        sizeCheck(item);
      }
    });
  };
  sizeCheck(currDir);
  console.log(dirToDelete);
}

pt2();
