import readline from "readline";

function countSolutions(puzzle: string, runs: number[]): number {
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

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let sum = 0;
let count = 0;

rl.on("line", (line) => {
  count++;
  console.log(`Running on line ${count}`);
  const [puzzle, rawNumbers] = line.split(" ");

  sum += countSolutions(puzzle, rawNumbers.split(",").map(Number));
});

rl.on("close", () => {
  console.log(`Part 1 sum: ${sum}`);
});
