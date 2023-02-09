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
const grid = [];
let graph = [];
const data = fs.readFileSync('12-input.txt', { encoding: 'utf-8' });
data.split('\n').forEach((line) => {
    const gridLine = [];
    for (const char of line) {
        let minDistFromSource = Number.MAX_SAFE_INTEGER;
        let isTargetNode = false;
        let height;
        if (char === 'S') {
            height = 'a';
            minDistFromSource = 0;
        }
        else if (char === 'E') {
            height = 'z';
            isTargetNode = true;
        }
        else {
            height = char;
        }
        gridLine.push({
            height,
            nodes: [],
            minDistFromSource,
            isTargetNode,
        });
    }
    grid.push(gridLine);
});
for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[0].length; ++j) {
        const node = grid[i][j];
        if (i - 1 >= 0) {
            if (grid[i - 1][j].height.charCodeAt(0) - node.height.charCodeAt(0) <= 1) {
                node.nodes.push(grid[i - 1][j]);
            }
        }
        if (i + 1 < grid.length) {
            if (grid[i + 1][j].height.charCodeAt(0) - node.height.charCodeAt(0) <= 1) {
                node.nodes.push(grid[i + 1][j]);
            }
        }
        if (j - 1 >= 0) {
            if (grid[i][j - 1].height.charCodeAt(0) - node.height.charCodeAt(0) <= 1) {
                node.nodes.push(grid[i][j - 1]);
            }
        }
        if (j + 1 < grid[0].length) {
            if (grid[i][j + 1].height.charCodeAt(0) - node.height.charCodeAt(0) <= 1) {
                node.nodes.push(grid[i][j + 1]);
            }
        }
        graph.push(node);
    }
}
function dijkstra() {
    while (graph.length > 0) {
        graph.sort((l, r) => l.minDistFromSource - r.minDistFromSource);
        let currNode = graph.shift();
        currNode.passedThrough = true;
        if (currNode.minDistFromSource === Number.MAX_SAFE_INTEGER) {
            return;
        }
        else if (currNode.isTargetNode) {
            return currNode.minDistFromSource;
        }
        for (const neighbor of currNode.nodes) {
            if (neighbor.passedThrough)
                continue;
            const currDist = currNode.minDistFromSource + 1;
            if (currDist < neighbor.minDistFromSource) {
                neighbor.minDistFromSource = currDist;
            }
        }
    }
}
// console.log(dijkstra())
function pt2() {
    const startNodes = [];
    for (const line of grid) {
        for (const node of line) {
            if (node.height === 'a') {
                startNodes.push(node);
            }
        }
    }
    const resetNodesPath = (startNode) => {
        graph = [];
        for (const line of grid) {
            for (const node of line) {
                node.passedThrough = false;
                node.minDistFromSource = node === startNode ? 0 : Number.MAX_SAFE_INTEGER;
                graph.push(node);
            }
        }
    };
    const pathLengths = [];
    for (const startNode of startNodes) {
        resetNodesPath(startNode);
        const path = dijkstra();
        if (path) {
            console.log(`add path: ${path}`);
            pathLengths.push(path);
        }
    }
    pathLengths.sort((l, r) => l - r);
    console.log(pathLengths);
}
pt2();
