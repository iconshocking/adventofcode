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
const data = fs.readFileSync('7-input.txt', { encoding: 'utf-8' });
const cmdsWithResults = data
    .split('\n$ ')
    .map((chunk) => chunk.split('\n'))
    .slice(1);
function createDir(name, parent) {
    return { type: 'dir', name, parent, contents: {} };
}
let currDir = createDir('/');
cmdsWithResults.forEach((chunk) => {
    const [cmd, ...results] = chunk;
    if (cmd.startsWith('cd')) {
        const dirName = cmd.replace('cd ', '');
        if (dirName === '..') {
            currDir = currDir.parent;
        }
        else {
            currDir = currDir.contents[cmd.replace('cd ', '')];
        }
    }
    else if (cmd.startsWith('ls')) {
        results.forEach((result) => {
            if (result.startsWith('dir')) {
                const dirName = result.replace('dir ', '');
                currDir.contents[dirName] = createDir(dirName, currDir);
            }
            else {
                const [size, name] = result.split(' ');
                currDir.contents[name] = { type: 'file', name, size: parseInt(size) };
            }
        });
    }
});
while (currDir.parent) {
    currDir = currDir.parent;
}
const sizeCompute = (dir) => {
    let size = 0;
    Object.values(dir.contents).forEach((item) => {
        if (item.type === 'dir') {
            sizeCompute(item);
        }
        size += item.size;
    });
    dir.size = size;
};
sizeCompute(currDir);
function pt1() {
    let trimmedSize = 0;
    const trimmedSizeCompute = (dir) => {
        if (dir.size <= 100000) {
            trimmedSize += dir.size;
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
    const additionalSpaceNeeded = Math.abs(TOTAL_STORAGE - NEEDED_STORAGE - currDir.size);
    let dirToDelete = undefined;
    const sizeCheck = (dir) => {
        if (dir.size >= additionalSpaceNeeded) {
            if (!dirToDelete || dirToDelete.size >= dir.size) {
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
