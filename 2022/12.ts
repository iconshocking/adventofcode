import * as fs from 'fs';

interface Node {
  height: string;
  nodes: Node[];
  minDistFromSource: number;
  isTargetNode?: boolean;
  passedThrough?: boolean;
}

const grid: Node[][] = [];
let graph: Node[] = [];

const data = fs.readFileSync('12-input.txt', { encoding: 'utf-8' });
data.split('\n').forEach((line) => {
  const gridLine: Node[] = [];
  for (const char of line) {
    let minDistFromSource = Number.MAX_SAFE_INTEGER;
    let isTargetNode = false;
    let height: string;
    if (char === 'S') {
      height = 'a';
      minDistFromSource = 0;
    } else if (char === 'E') {
      height = 'z';
      isTargetNode = true;
    } else {
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

function dijkstra(): number | undefined {
  while (graph.length > 0) {
    graph.sort((l, r) => l.minDistFromSource - r.minDistFromSource);
    let currNode = graph.shift()!;
    currNode.passedThrough = true;
    if (currNode.minDistFromSource === Number.MAX_SAFE_INTEGER) {
      return;
    } else if (currNode.isTargetNode) {
      return currNode.minDistFromSource;
    }
    for (const neighbor of currNode.nodes) {
      if (neighbor.passedThrough) continue;
      const currDist = currNode.minDistFromSource + 1;
      if (currDist < neighbor.minDistFromSource) {
        neighbor.minDistFromSource = currDist;
      }
    }
  }
}

// console.log(dijkstra())

function pt2() {
  const startNodes: Node[] = [];
  for (const line of grid) {
    for (const node of line) {
      if (node.height === 'a') {
        startNodes.push(node);
      }
    }
  }

  const resetNodesPath = (startNode: Node) => {
    graph = [];
    for (const line of grid) {
      for (const node of line) {
        node.passedThrough = false;
        node.minDistFromSource = node === startNode ? 0 : Number.MAX_SAFE_INTEGER;
        graph.push(node);
      }
    }
  };

  const pathLengths: number[] = [];

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
