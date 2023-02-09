"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const lodash_1 = require("lodash");
const data = fs.readFileSync('8-input.txt', { encoding: 'utf-8' });
const lines = data.split('\n');
const treeGrid = lines.map((line) => line.split('').map((height) => ({
    height: parseInt(height),
    visibleFromEdge: false,
})));
const height = treeGrid.length;
const width = treeGrid[0].length;
function pt1() {
    let blockingHeight = -1;
    const checkIfVisible = (i, j) => {
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
    const scenicScore = (i, j, dir) => {
        const tree = treeGrid[i][j];
        let score = 0;
        switch (dir) {
            case 'up':
                for (const idx of (0, lodash_1.range)(i - 1, -1, -1)) {
                    ++score;
                    if (tree.height <= treeGrid[idx][j].height) {
                        break;
                    }
                }
                break;
            case 'down':
                for (const idx of (0, lodash_1.range)(i + 1, height, 1)) {
                    ++score;
                    if (tree.height <= treeGrid[idx][j].height) {
                        break;
                    }
                }
                break;
            case 'left':
                for (const idx of (0, lodash_1.range)(j - 1, -1, -1)) {
                    ++score;
                    if (tree.height <= treeGrid[i][idx].height) {
                        break;
                    }
                }
                break;
            case 'right':
                for (const idx of (0, lodash_1.range)(j + 1, width, 1)) {
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
            bestScore = Math.max(bestScore, treeGrid[i][j].scenicScore);
        }
    }
    bestScore;
}
pt2();
