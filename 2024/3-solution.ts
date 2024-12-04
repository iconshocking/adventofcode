import { log } from "console";
import * as fs from "fs";

const text = fs.readFileSync("./3-input.txt", "utf-8");

function pt1() {
  const regex = /mul\(([0-9]+),([0-9]+)\)/g;
  let match;
  let sum = 0;
  while ((match = regex.exec(text)) !== null) {
    sum += parseInt(match[1]) * parseInt(match[2]);
  }
  log(sum);
}
// pt1();

function pt2() {
  const regex = /(?:(?:do(?:n't)?)|(?:mul\(([0-9]+),([0-9]+)\)))/g;
  let match;
  let sum = 0;
  let enabled = true;
  while ((match = regex.exec(text)) !== null) {
    if (match[0] === "do") {
      enabled = true;
    } else if (match[0] === "don't") {
      enabled = false;
    } else if (enabled) {
      sum += parseInt(match[1]) * parseInt(match[2]);
    }
  }
  log(sum);
}
pt2();
