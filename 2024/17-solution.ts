import { log } from "console";
import { processLines } from "./utilities.js";

// we don't know how many times instructions might repeat, so we account for large numbers
const REGISTER_A_IDX = 0;
const REGISTER_B_IDX = 1;
const REGISTER_C_IDX = 2;

const lines = await processLines("17-input.txt");

const registersEndIdx = lines.indexOf("");
const registers: bigint[] = lines
  .slice(0, registersEndIdx)
  .map((line) => BigInt(line.split(": ")[1]));

let instructionPtr = 0;
const instructions: number[] = lines[registersEndIdx + 1].split(": ")[1].split(",").map(Number);

let output: BigInt[] = [];
function printAll() {
  console.log();
  console.log("Output:", output.join(","));
  console.log("Registers:", registers.join(", "));
  console.log("Instruction Ptr:", instructionPtr);
  if (instructionPtr < instructions.length) {
    console.log("Instruction up next:", [
      instructions[instructionPtr],
      instructions[instructionPtr + 1],
    ]);
  }
  console.log();
}

// returns updated instruction pointer
function performOpCode(opCode: number, rawOperand: number, instructionPtr: number): number {
  const literalOperand = BigInt(rawOperand);
  const comboOperand = toComboOperand(rawOperand);
  let newInstructionPtr = instructionPtr + 2;

  // switch (opCode) {
  //   case 0:
  //     console.log(
  //       `registers[REGISTER_A_IDX] = ${registers[REGISTER_A_IDX]} / 2 ** ${comboOperand}`
  //     );
  //     break;
  //   case 1:
  //     console.log(`registers[REGISTER_B_IDX] = ${registers[REGISTER_B_IDX]} ^ ${literalOperand}`);
  //     break;
  //   case 2:
  //     console.log(`registers[REGISTER_B_IDX] = ${comboOperand} % 8`);
  //     break;
  //   case 3:
  //     console.log(`if (${registers[REGISTER_A_IDX]} !== 0) instructionPtr = ${rawOperand}`);
  //     break;
  //   case 4:
  //     console.log(
  //       `registers[REGISTER_B_IDX] = ${registers[REGISTER_B_IDX]} ^ ${registers[REGISTER_C_IDX]}`
  //     );
  //     break;
  //   case 5:
  //     console.log(`output.push(${comboOperand} % 8)`);
  //     break;
  //   case 6:
  //     console.log(
  //       `registers[REGISTER_B_IDX] = ${registers[REGISTER_A_IDX]} / 2 ** ${comboOperand}`
  //     );
  //     break;
  //   case 7:
  //     console.log(
  //       `registers[REGISTER_C_IDX] = ${registers[REGISTER_A_IDX]} / 2 ** ${comboOperand}`
  //     );
  //     break;
  //   default:
  //     throw new Error(`Invalid opCode ${opCode}`);
  // }

  switch (opCode) {
    case 0: // register A division
      // no need to floor since BigInt division is integer division
      registers[REGISTER_A_IDX] = registers[REGISTER_A_IDX] / BigInt(2) ** comboOperand;
      break;
    case 1: // register B xor
      registers[REGISTER_B_IDX] = registers[REGISTER_B_IDX] ^ literalOperand;
      break;
    case 2: // operand mod 8 to register B
      registers[REGISTER_B_IDX] = comboOperand % BigInt(8);
      break;
    case 3: // register A based jump if not zero
      if (registers[REGISTER_A_IDX] !== BigInt(0)) {
        // let this be a number because we are probably going to have some other problems first if
        // our instruction pointer needs to scale to require BigInt
        newInstructionPtr = rawOperand;
      }
      break;
    case 4: // register B and C xor
      registers[REGISTER_B_IDX] = registers[REGISTER_B_IDX] ^ registers[REGISTER_C_IDX];
      break;
    case 5: // output mod 8
      output.push(comboOperand % BigInt(8));
      break;
    case 6: // register A division but store in register B
      registers[REGISTER_B_IDX] = registers[REGISTER_A_IDX] / BigInt(2) ** comboOperand;
      break;
    case 7: // register A division but store in register C
      registers[REGISTER_C_IDX] = registers[REGISTER_A_IDX] / BigInt(2) ** comboOperand;
      break;
    default:
      throw new Error(`Invalid opCode ${opCode}`);
  }
  return newInstructionPtr;
}

function toComboOperand(operand: number): bigint {
  // combo operand 7 is never used, but it is a valid operand
  if (operand <= 3 || operand === 7) {
    return BigInt(operand);
  } else if (operand <= 6) {
    return registers[operand - 4];
  } else {
    throw new Error(`Invalid operand: ${operand}`);
  }
}

function pt1() {
  instructionPtr = 0;
  output = [];
  printAll();
  while (instructionPtr < instructions.length) {
    instructionPtr = performOpCode(
      instructions[instructionPtr],
      instructions[instructionPtr + 1],
      instructionPtr
    );
  }
  printAll();
}
// pt1();

/* Decompiled program:
b = a % 8
b = b XOR 5
c = a / 2^b
b = b XOR 6
b = b XOR c
PRINT(b % 8)
a = a / 8
JUMP if a > 0

We see:
- Each loop of the program is determined wholly by the value of register A.
- Each loop divides by 8, so 3 bits at the end of register A are lost on each loop.
- This means that we can build up the register A 3 bits at a time by iterating through the program
  in reverse. Why? Because later iterations cannot change earlier bits we landed on because that
  would change the output of those later iterations.
- A / 8 === 0 when the program terminates, so A < 8 on the last loop.

Therefore:
- We remove the last divide and jump instruction in the program to create a non-loop program.
- We create baseA = 0 and iteration = 0.
- Set register A to baseA + x, where x iterates from 0 through 8.
- Set baseA to the value of register A * 8 when we discover an iteration that outputs the program's
  i last elements.
- Increment iteration and perform the x iteration loop again.
- Repeat until the iteration equals the length of the program.
*/
function pt2() {
  // remove the last divide and jump instructions (2 values each)
  const shortenedProgram = instructions.slice(0, -4);

  // there may be some solutions that satisfy a partial output but not the full solution, so we have
  // to store fallback points to resume the search from if we hit a dead end
  const fallbacks: { iteration: number; baseA: bigint; x: number }[] = [];

  let baseA = BigInt(0);
  let iteration = 0;
  let fallback;
  while (iteration < instructions.length) {
    log(`Iteration ${iteration} start.`);

    let correctRegisterA;
    let x = 0;
    if (fallback) {
      x = fallback.x;
      fallback = null;
    }
    for (; x < 8; x++) {
      const newRegisterA = baseA + BigInt(x);
      registers[REGISTER_A_IDX] = newRegisterA;
      log("Register A:", newRegisterA.toString(8));
      instructionPtr = 0;
      output = [];
      while (instructionPtr < shortenedProgram.length) {
        instructionPtr = performOpCode(
          shortenedProgram[instructionPtr],
          shortenedProgram[instructionPtr + 1],
          instructionPtr
        );
      }
      if (output[0] === BigInt(instructions.at(-(iteration + 1))!)) {
        correctRegisterA = newRegisterA;
        fallbacks.push({ iteration, baseA, x: x + 1 });
        break;
      }
    }
    // if we didn't find a solution, we need to backtrack
    if (!correctRegisterA) {
      fallback = fallbacks.pop();
      if (fallback) {
        iteration = fallback.iteration;
        baseA = fallback.baseA;
        log("Fallback to iteration", iteration);
        continue;
      }
      throw new Error("No solution found.");
    }

    log(`Iteration ${iteration} complete.`);
    log(`Final register A: ${correctRegisterA}`);
    log("-----TEST OUTPUT START----");
    registers[REGISTER_A_IDX] = correctRegisterA;
    pt1();
    log("-----TEST OUTPUT END----");

    iteration++;
    if (iteration < instructions.length) {
      baseA = correctRegisterA * BigInt(8);
      registers[REGISTER_A_IDX] = baseA;
    }
  }
}
pt2();
