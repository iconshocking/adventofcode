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
const data = fs.readFileSync('15-input.txt', { encoding: 'utf-8' });
let linesRaw = data
    .replaceAll(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/g, '$1,$2,$3,$4')
    .split('\n')
    .map((line) => line.split(',').map((num) => parseInt(num)));
let xAdjust = Math.abs(linesRaw.reduce((prev, next) => Math.min(prev, Math.min(next[0], next[2])), 0));
const xMax = xAdjust +
    Math.abs(linesRaw.reduce((prev, next) => Math.max(prev, Math.max(next[0], next[2])), 0));
const yAdjust = Math.abs(linesRaw.reduce((prev, next) => Math.min(prev, Math.min(next[1], next[3])), 0));
const yMax = yAdjust +
    Math.abs(linesRaw.reduce((prev, next) => Math.max(prev, Math.max(next[1], next[3])), 0));
const lines = linesRaw.map(([sensorX, sensorY, beaconX, beaconY]) => {
    const sensor = [sensorX + xAdjust, sensorY + yAdjust];
    const beacon = [beaconX + xAdjust, beaconY + yAdjust];
    const dist = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);
    return {
        sensor,
        beacon,
        dist,
    };
});
// type Spot = '.' | 'S' | 'B' | '#';
// const grid: Spot[][] = Array(xMax);
// for (let i = 0; i < xMax; ++i) {
//   grid[i] = Array(yMax).fill('.');
// }
// for (const line of lines) {
//   const [sensorX, sensorY, beaconX, beaconY] = line;
//   grid[sensorY][sensorX] = 'S';
//   grid[beaconY][beaconX] = 'B';
// }
// function printGrid() {
//   let counter = 0 - yAdjust;
//   console.log(
// JSON.stringify(grid)
//   .replace(/[\",\[]/g, '')
//   .replace(/\]/g, '\n')
//       .split('\n')
//       .map((line) => `${counter++}${line}`)
//       .join('\n')
//       .replace(/^(.*)\n/g, '$1\n')
//   );
// }
const AXIS_CAP_RAW = 20; //4_000_000
const AXIS_MIN_X = xAdjust;
const AXIS_CAP_X = AXIS_CAP_RAW + xAdjust;
const AXIS_MIN_Y = yAdjust;
const AXIS_CAP_Y = AXIS_CAP_RAW + yAdjust;
function pt2() {
    let start = Date.now();
    for (let desiredY = AXIS_MIN_Y; desiredY <= AXIS_CAP_Y; ++desiredY) {
        if (desiredY % 100000 === 0) {
            console.log(Date.now() - start);
            start = Date.now();
        }
        const slacks = [];
        for (const line of lines) {
            const xSlack = line.dist - Math.abs(line.sensor[1] - desiredY);
            if (xSlack < 0)
                continue;
            slacks.push([line.sensor[0] - xSlack, line.sensor[0] + xSlack]);
        }
        slacks.sort((l, r) => l[0] - r[0]);
        const logLocation = (x) => console.log(`found at (${x - xAdjust},${desiredY - yAdjust})`);
        if (slacks[0][0] > AXIS_MIN_X) {
            return logLocation(AXIS_MIN_X);
        }
        let topSlackMax = slacks[0][1];
        for (let i = 1; i < slacks.length; ++i) {
            if (slacks[i][0] > slacks[i - 1][1] + 1 && topSlackMax + 1 < slacks[i][0]) {
                return logLocation(slacks[i - 1][1] + 1);
            }
            topSlackMax = Math.max(topSlackMax, slacks[i][1]);
        }
        if (topSlackMax < AXIS_CAP_X) {
            return logLocation(AXIS_CAP_X);
        }
    }
}
pt2();
