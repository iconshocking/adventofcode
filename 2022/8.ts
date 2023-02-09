import * as fs from 'fs';
import { range } from 'lodash';

interface Tree {
  height: number;
  visibleFromEdge?: boolean;
  upScore?: number;
  downScore?: number;
  leftScore?: number;
  rightScore?: number;
  scenicScore?: number;
}

const data = fs.readFileSync('8-input.txt', { encoding: 'utf-8' });
const lines = data.split('\n');
const treeGrid: Tree[][] = lines.map((line) =>
  line.split('').map((height) => ({
    height: parseInt(height),
    visibleFromEdge: false,
  }))
);
const height = treeGrid.length;
const width = treeGrid[0].length;

function pt1() {
  let blockingHeight = -1;
  const checkIfVisible = (i: number, j: number) => {
    const tree = treeGrid[i][j];
    if (blockingHeight < tree.height) {
      tree.visibleFromEdge = true;
      blockingHeight = tree.height;
    }
  };

  for (let i = 0; i < height; ++i) {
    // l -> r
    for (let j = 0; j < width; ++j) {
      checkIfVisible(i, j);
    }
    blockingHeight = -1;
    // r -> l
    for (let j = width - 1; j >= 0; --j) {
      checkIfVisible(i, j);
    }
    blockingHeight = -1;
  }

  blockingHeight = -1;
  for (let j = 0; j < width; ++j) {
    // u -> d
    for (let i = 0; i < height; ++i) {
      checkIfVisible(i, j);
    }
    blockingHeight = -1;
    // d -> u
    for (let i = height - 1; i >= 0; --i) {
      checkIfVisible(i, j);
    }
    blockingHeight = -1;
  }

  let visibleCount = 0;
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      if (treeGrid[i][j].visibleFromEdge) {
        ++visibleCount;
      }
    }
  }

  visibleCount;
}

// pt1();

function pt2() {
  const scenicScore = (i: number, j: number, dir: 'up' | 'down' | 'left' | 'right'): number => {
    const tree = treeGrid[i][j];
    let score = 0;
    switch (dir) {
      case 'up':
        for (const idx of range(i - 1, -1, -1)) {
          ++score;
          if (tree.height <= treeGrid[idx][j].height) {
            break;
          }
        }
        break;
      case 'down':
        for (const idx of range(i + 1, height, 1)) {
          ++score;
          if (tree.height <= treeGrid[idx][j].height) {
            break;
          }
        }
        break;
      case 'left':
        for (const idx of range(j - 1, -1, -1)) {
          ++score;
          if (tree.height <= treeGrid[i][idx].height) {
            break;
          }
        }
        break;
      case 'right':
        for (const idx of range(j + 1, width, 1)) {
          ++score;
          if (tree.height <= treeGrid[i][idx].height) {
            break;
          }
        }
        break;
    }
    return score;
  };

  // const i = 3
  // const j = 2
  for (let i = 0; i < height; ++i) {
    for (let j = 0; j < width; ++j) {
      const tree = treeGrid[i][j];
      tree.upScore = scenicScore(i, j, 'up');
      tree.downScore = scenicScore(i, j, 'down');
      tree.leftScore = scenicScore(i, j, 'left');
      tree.rightScore = scenicScore(i, j, 'right');
      treeGrid[i][j].scenicScore = tree.upScore * tree.downScore * tree.leftScore * tree.rightScore;
    }
  }

  let bestScore = -1;
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      bestScore = Math.max(bestScore, treeGrid[i][j].scenicScore!);
    }
  }

  bestScore;
}

pt2();
