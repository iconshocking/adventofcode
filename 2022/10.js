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
const data = fs.readFileSync('10-input.txt', { encoding: 'utf-8' });
const ops = data
    .split('\n')
    .reverse()
    .map((opStr) => opStr === 'noop' ? { type: 'noop' } : { type: 'addx', add: parseInt(opStr.split(' ')[1]) });
function pt1() {
    let signalStrengthSum = 0;
    let cycle = 1;
    let x = 1;
    let cyclesRemainingForOp = 0;
    let op;
    const updateOp = () => {
        op = ops.pop();
        if (!op)
            return;
        cyclesRemainingForOp = op.type === 'noop' ? 1 : 2;
    };
    updateOp();
    while (!!op) {
        if ((cycle - 20) % 40 === 0) {
            signalStrengthSum += cycle * x;
        }
        --cyclesRemainingForOp;
        if (cyclesRemainingForOp == 0) {
            if (op.type === 'addx') {
                x += op.add;
            }
            updateOp();
        }
        ++cycle;
    }
    signalStrengthSum;
}
// pt1();
function pt2() {
    let cycle = 1;
    let x = 1;
    let cyclesRemainingForOp = 0;
    let op;
    let pixel = '.';
    const pixelGrid = [];
    const updateOp = () => {
        op = ops.pop();
        if (!op)
            return;
        cyclesRemainingForOp = op.type === 'noop' ? 1 : 2;
    };
    updateOp();
    while (!!op) {
        const pixelPos = (cycle - 1) % 40;
        if (pixelPos == 0) {
            pixelGrid.push([]);
        }
        if (pixelPos >= x - 1 && pixelPos <= x + 1) {
            pixel = '#';
        }
        else {
            pixel = '.';
        }
        pixelGrid[pixelGrid.length - 1].push(pixel);
        --cyclesRemainingForOp;
        if (cyclesRemainingForOp == 0) {
            if (op.type === 'addx') {
                x += op.add;
            }
            updateOp();
        }
        ++cycle;
    }
    const crt = pixelGrid.reduce((accumulated, line) => accumulated + '\n' + line.reduce((pixel, next) => (pixel += next)), '');
    crt;
}
pt2();
