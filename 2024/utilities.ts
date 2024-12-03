import * as fs from "node:fs";
import * as readline from "node:readline";

/**
 * @param {fs.PathLike} inputPath
 */
export async function processLines(inputPath: string) {
  const fileStream = fs.createReadStream(inputPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') as a single line break.

  const list = [];
  for await (const line of rl) {
    list.push(line);
  }
  return list;
}
