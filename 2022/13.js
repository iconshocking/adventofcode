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
const data = fs.readFileSync('13-input.txt', { encoding: 'utf-8' });
const pairs = data.split('\n\n').map((pair) => {
    let pairArrays = [[], []];
    let idx = 0;
    for (const line of pair.split('\n')) {
        let returnArray;
        const unclosedArrays = [];
        let accumulatedChars = '';
        for (const char of line) {
            if (!Number.isNaN(parseInt(char))) {
                accumulatedChars += char;
            }
            else if (accumulatedChars.length > 0) {
                unclosedArrays[unclosedArrays.length - 1].push(parseInt(accumulatedChars));
                accumulatedChars = '';
            }
            if (char === ',')
                continue;
            if (char === '[') {
                const array = [];
                if (!returnArray) {
                    returnArray = array;
                }
                if (unclosedArrays.length > 0) {
                    unclosedArrays[unclosedArrays.length - 1].push(array);
                }
                unclosedArrays.push(array);
            }
            else if (char === ']') {
                unclosedArrays.pop();
            }
        }
        pairArrays[idx].push(...returnArray);
        ++idx;
    }
    return pairArrays;
});
function compare(l, r) {
    const lIsArray = Array.isArray(l);
    const rIsArray = Array.isArray(r);
    if (!lIsArray && !rIsArray) {
        return l - r;
    }
    else if (lIsArray && rIsArray) {
        for (let idx = 0; idx < l.length && idx < r.length; ++idx) {
            const result = compare(l[idx], r[idx]);
            if (result !== 0) {
                return result;
            }
        }
        if (l.length > r.length) {
            return 1;
        }
        else if (l.length < r.length) {
            return -1;
        }
        else {
            return 0;
        }
    }
    else if (!lIsArray) {
        const arrayL = [l];
        return compare(arrayL, r);
    }
    else if (!rIsArray) {
        const arrayR = [r];
        return compare(l, arrayR);
    }
}
function pt1() {
    const idxSum = pairs.reduce((accumulate, next, baseIdx) => {
        const [first, second] = next;
        const inOrder = compare(first, second) < 0;
        if (inOrder) {
            accumulate += baseIdx + 1;
            console.log(`correct at ${baseIdx * 3 + 1}`);
        }
        return accumulate;
    }, 0);
    console.log(idxSum);
}
// pt1();
function pt2() {
    const packets = pairs.flat(1);
    packets.sort(compare);
    console.log((packets.findIndex((pkt) => JSON.stringify(pkt) === '[[2]]') + 1) *
        (packets.findIndex((pkt) => JSON.stringify(pkt) === '[[6]]') + 1));
}
pt2();
