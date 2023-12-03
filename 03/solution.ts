import readline from "readline";
import { parseLine, hasAdjacentSymbol, Part, Symbol } from "./shared";

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let currentLine = 1;
const allSymbols: Symbol[] = [];
const allParts: Part[] = [];

rl.on("line", (line) => {
  const { symbols, parts } = parseLine(currentLine, line);
  allSymbols.push(...symbols);
  allParts.push(...parts);
  currentLine++;
});

rl.on("close", () => {
  let partNumberTotal = 0;
  for (const part of allParts) {
    if (hasAdjacentSymbol(part, allSymbols)) {
      partNumberTotal += Number(part.partNumber);
    }
  }

  console.log(`Part 1 total: ${partNumberTotal}`);
});
