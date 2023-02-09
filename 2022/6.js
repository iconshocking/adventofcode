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
const data = fs.readFileSync('6-input.txt', { encoding: 'utf-8' });
function pt1() {
    for (let i = 0; i + 4 <= data.length; ++i) {
        const set = new Set();
        for (const char of data.slice(i, i + 4)) {
            if (set.has(char))
                break;
            set.add(char);
            if (set.size === 4)
                return i + 4;
        }
    }
}
// console.log(pt1());
function pt2() {
    for (let i = 0; i + 14 <= data.length; ++i) {
        const set = new Set();
        for (const char of data.slice(i, i + 14)) {
            if (set.has(char))
                break;
            set.add(char);
            if (set.size === 14)
                return i + 14;
        }
    }
}
console.log(pt2());
