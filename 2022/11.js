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
let commonModulo = 1;
const data = fs.readFileSync('11-input.txt', { encoding: 'utf-8' });
const monkeys = data.split('\n\n').map((monkey) => {
    const traits = monkey.split('\n');
    const items = traits[1]
        .replace(/\s/g, '')
        .replace('Startingitems:', '')
        .split(',')
        .map((str) => parseInt(str));
    const opPlusNum = traits[2].replace(/\s/g, '').replace('Operation:new=old', '');
    const num = parseInt(opPlusNum.slice(1));
    let operation;
    if (opPlusNum[0] === '*') {
        operation = (value) => value * (!Number.isNaN(num) ? num : value);
    }
    else {
        operation = (value) => value + (!Number.isNaN(num) ? num : value);
    }
    const divisor = parseInt(traits[3].replace(/\s/g, '').replace('Test:divisibleby', ''));
    commonModulo *= divisor;
    const test = (value) => value % divisor === 0
        ? parseInt(traits[4].replace(/\s/g, '').replace('Iftrue:throwtomonkey', ''))
        : parseInt(traits[5].replace(/\s/g, '').replace('Iffalse:throwtomonkey', ''));
    return {
        items,
        operation,
        test,
        inspectCount: 0,
    };
});
function pt1() {
    for (let i = 0; i < 20; ++i) {
        for (const monkey of monkeys) {
            for (let item = monkey.items.shift(); !!item; item = monkey.items.shift()) {
                monkey.inspectCount = monkey.inspectCount + 1;
                const update = Math.floor(monkey.operation(item) / 3);
                const testResult = monkey.test(update);
                monkeys[testResult].items.push(update);
            }
        }
    }
    const inspectSortedMonkeys = monkeys.sort((l, r) => l.inspectCount - r.inspectCount).reverse();
    console.log(inspectSortedMonkeys[0].inspectCount * inspectSortedMonkeys[1].inspectCount);
}
// pt1()
function pt2() {
    for (let i = 0; i < 10000; ++i) {
        for (const monkey of monkeys) {
            for (let item = monkey.items.shift(); !!item; item = monkey.items.shift()) {
                monkey.inspectCount = monkey.inspectCount + 1;
                const update = monkey.operation(item) % commonModulo;
                const testResult = monkey.test(update);
                monkeys[testResult].items.push(update);
            }
        }
    }
    const inspectSortedMonkeys = monkeys.sort((l, r) => l.inspectCount - r.inspectCount).reverse();
    console.log(inspectSortedMonkeys[0].inspectCount * inspectSortedMonkeys[1].inspectCount);
}
pt2();
