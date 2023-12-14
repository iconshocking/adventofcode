import { log } from "console";
import { processLines } from "./utilities.js";
const lines = await processLines("2-input.txt");
function pt1() {
    const colorAllowance = {
        red: 12,
        green: 13,
        blue: 14,
    };
    let possibleGamesSum = 0;
    let counter = 0;
    lineLoop: for (const line of lines) {
        ++counter;
        const reveals = line.split(/(?::|;) /).slice(1);
        revealLoop: for (const reveal of reveals) {
            const colors = reveal.split(", ");
            colorLoop: for (const color of colors) {
                const [count, col] = color.split(" ");
                if (Number(count) > colorAllowance[col]) {
                    continue lineLoop;
                }
            }
        }
        possibleGamesSum += counter;
    }
    log(possibleGamesSum);
}
pt1();
function pt2() {
    let sum = 0;
    lineLoop: for (const line of lines) {
        const minNeeded = {
            red: 0,
            green: 0,
            blue: 0,
        };
        const reveals = line.split(/(?::|;) /).slice(1);
        revealLoop: for (const reveal of reveals) {
            const colors = reveal.split(", ");
            colorLoop: for (const color of colors) {
                const [count, col] = color.split(" ");
                minNeeded[col] = Math.max(minNeeded[col], Number(count));
            }
        }
        const minNeededPow = minNeeded.red * minNeeded.green * minNeeded.blue;
        sum += minNeededPow;
    }
    log(sum);
}
pt2();
