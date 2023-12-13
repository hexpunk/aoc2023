import readline from "readline";

const cache = new Map<string, number>();
function countSolutions(puzzle: string, runs: number[]): number {
  function calc(puzzle: string, runs: number[]): number {
    if (puzzle === "") {
      if (runs.length === 0) {
        return 1;
      } else {
        return 0;
      }
    }

    if (runs.length === 0) {
      if (puzzle.indexOf("#") === -1) {
        return 1;
      } else {
        return 0;
      }
    }

    const [first, ...rest] = runs;
    let subtotal = 0;

    if (puzzle[0] === "." || puzzle[0] === "?") {
      subtotal += countSolutions(puzzle.substring(1), runs);
    }

    if (puzzle[0] === "#" || puzzle[0] === "?") {
      if (
        first <= puzzle.length &&
        puzzle.substring(0, first).indexOf(".") === -1 &&
        (first === puzzle.length || puzzle[first] !== "#")
      ) {
        subtotal += countSolutions(puzzle.substring(first + 1), rest);
      }
    }

    return subtotal;
  }

  const key = puzzle + "|" + String(runs);

  if (cache.has(key)) {
    return cache.get(key)!;
  } else {
    const result = calc(puzzle, runs);
    cache.set(key, result);

    return result;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let sum1 = 0;
let sum2 = 0;

rl.on("line", (line) => {
  const [puzzle, rawNumbers] = line.split(" ");
  const numbers = rawNumbers.split(",").map(Number);

  sum1 += countSolutions(puzzle, numbers);
  sum2 += countSolutions([puzzle, puzzle, puzzle, puzzle, puzzle].join("?"), [
    ...numbers,
    ...numbers,
    ...numbers,
    ...numbers,
    ...numbers,
  ]);
});

rl.on("close", () => {
  console.log(`Part 1 sum: ${sum1}`);
  console.log(`Part 2 sum: ${sum2}`);
});
