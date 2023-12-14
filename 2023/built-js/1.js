import { log } from "node:console";
import { processLines } from "./utilities.js";
/**
 * @type {Object.<string, number>}
 */
const numsMap = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};
const numRegex = /(one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9)/g;
const numRegexReverse = /(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|1|2|3|4|5|6|7|8|9)/g;
const lines = await processLines("1-input.txt");
function pt1() {
    let sum = 0;
    for (const line of lines) {
        const split = line.split("");
        const firstDig = split.find((value) => Number(value));
        const secondDig = split.reverse().find((value) => Number(value));
        sum += Number(firstDig) * 10 + Number(secondDig);
    }
    console.log(sum);
}
pt1();
function pt2() {
    let sum = 0;
    for (const line of lines) {
        let match = line.match(numRegex);
        if (!match)
            continue;
        const firstDigStr = match[0];
        let firstDig;
        if (Number(firstDigStr)) {
            firstDig = Number(firstDigStr);
        }
        else {
            firstDig = numsMap[firstDigStr];
        }
        match = line.split("").reverse().join("").match(numRegexReverse);
        if (!match)
            continue;
        const secondDigStr = match[0].split("").reverse().join("");
        let secondDig;
        if (Number(secondDigStr)) {
            secondDig = Number(secondDigStr);
        }
        else {
            secondDig = numsMap[secondDigStr];
        }
        const lineValue = 10 * firstDig + secondDig;
        sum += lineValue;
    }
    log(sum);
}
pt2();
