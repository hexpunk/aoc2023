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
  const partNumbers = new Set<number>();
  for (const part of allParts) {
    console.log(part.partNumber, hasAdjacentSymbol(part, allSymbols));
    if (hasAdjacentSymbol(part, allSymbols)) {
      partNumbers.add(Number(part.partNumber));
    }
  }

  const partNumberTotal = Array.of(...partNumbers.values()).reduce(
    (total, num) => total + num
  );

  console.log(`Part 1 total: ${partNumberTotal}`);
});
