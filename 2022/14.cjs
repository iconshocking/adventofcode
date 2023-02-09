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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const graphWMin = 360;
const graphHMin = 0;
const data = fs.readFileSync('14-input.txt', { encoding: 'utf-8' });
const rocks = data.split('\n').map((rock) => rock.split(' -> ').map((line) => line.split(',').map((num, idx) => {
    if (idx === 0) {
        return parseInt(num) - graphWMin;
    }
    else {
        return parseInt(num) - graphHMin;
    }
})));
var Material;
(function (Material) {
    Material["ROCK"] = "#";
    Material["SAND"] = "o";
    Material["SOURCE"] = "+";
    Material["EMPTY"] = ".";
})(Material || (Material = {}));
const graphWMax = 580 + 1;
const graphHMax = 2 +
    1 +
    rocks.reduce((prev, rock) => {
        const reduce = rock.reduce((prev, point) => {
            return Math.max(prev, point[1]);
        }, 0);
        return Math.max(prev, reduce);
    }, 0);
const sourceW = 500 - graphWMin;
let graphHxW = Array(graphHMax - graphHMin);
for (let idx = 0; idx < graphHxW.length; ++idx) {
    graphHxW[idx] = Array(graphWMax - graphWMin).fill(idx === graphHMax - 1 ? Material.ROCK : Material.EMPTY);
}
for (const rock of rocks) {
    let [currPointW, currPointH] = rock[0];
    graphHxW[currPointH][currPointW] = Material.ROCK;
    for (let idx = 1; idx < rock.length; ++idx) {
        const [nextPointW, nextPointH] = rock[idx];
        if (currPointH == nextPointH) {
            for (const iter of lodash_1.default.range(Math.min(nextPointW, currPointW), Math.max(nextPointW, currPointW) + 1)) {
                graphHxW[currPointH][iter] = Material.ROCK;
            }
        }
        else {
            for (const iter of lodash_1.default.range(Math.min(nextPointH, currPointH), Math.max(nextPointH, currPointH) + 1)) {
                graphHxW[iter][currPointW] = Material.ROCK;
            }
        }
        [currPointH, currPointW] = [nextPointH, nextPointW];
    }
}
let sandCounter = 0;
function pt1() {
    while (true) {
        let [sandH, sandW] = [1, sourceW];
        while (true) {
            const nextSandH = sandH + 1;
            let nextSandW;
            if (graphHxW[nextSandH][sandW] === Material.EMPTY) {
                nextSandW = sandW;
            }
            else if (graphHxW[nextSandH][sandW - 1] === Material.EMPTY) {
                nextSandW = sandW - 1;
            }
            else if (graphHxW[nextSandH][sandW + 1] === Material.EMPTY) {
                nextSandW = sandW + 1;
            }
            if (nextSandW) {
                [sandH, sandW] = [nextSandH, nextSandW];
            }
            else {
                graphHxW[sandH][sandW] = Material.SAND;
                ++sandCounter;
                break;
            }
        }
    }
}
// pt1();
// console.log(sandCounter);
// console.log(graphHxW);
function pt2() {
    while (true) {
        let [sandH, sandW] = [0, sourceW];
        while (true) {
            const nextSandH = sandH + 1;
            let nextSandW;
            if (graphHxW[nextSandH][sandW] === Material.EMPTY) {
                nextSandW = sandW;
            }
            else if (graphHxW[nextSandH][sandW - 1] === Material.EMPTY) {
                nextSandW = sandW - 1;
            }
            else if (graphHxW[nextSandH][sandW + 1] === Material.EMPTY) {
                nextSandW = sandW + 1;
            }
            if (nextSandW !== undefined) {
                [sandH, sandW] = [nextSandH, nextSandW];
            }
            else {
                graphHxW[sandH][sandW] = Material.SAND;
                ++sandCounter;
                // console.log(
                //   JSON.stringify(graphHxW)
                //     .replace(/[,\"\]]/g, '')
                //     .split('[')
                // );
                if (sandH === 0 && sandW === sourceW) {
                    return;
                }
                break;
            }
        }
    }
}
pt2();
console.log(sandCounter);
console.log(JSON.stringify(graphHxW)
    .replace(/[,\"\]]/g, '')
    .split('[')
    .join("\n"));
