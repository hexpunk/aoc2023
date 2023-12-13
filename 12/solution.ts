import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

function swap(arr: string[], i: number, j: number): void {
  const iVal = arr[i];
  const jVal = arr[j];

  arr[i] = jVal;
  arr[j] = iVal;
}

// Heap's algorithm
function* permutations(input: string): Generator<string> {
  const workingCopy = input.split("");
  const stack = new Array(input.length).fill(0);

  const cache = new Set<string>();
  cache.add(input);
  yield input;

  let i = 1;
  while (i < input.length) {
    if (stack[i] < i) {
      if (i % 2 === 0) {
        swap(workingCopy, 0, i);
      } else {
        swap(workingCopy, stack[i], i);
      }

      const combo = workingCopy.join("");
      if (!cache.has(combo)) {
        cache.add(combo);
        yield combo;
      }

      stack[i]++;
      i = 1;
    } else {
      stack[i] = 0;
      i++;
    }
  }
}

function createTest(counts: number[]): (puzzle: string) => boolean {
  return (puzzle) =>
    new RegExp(
      "^\\.*" + counts.map((n) => `#{${n}}`).join("\\.+") + "\\.*$"
    ).test(puzzle);
}

function fillIn(puzzle: string, bag: string): string {
  let result = "";

  for (const c of puzzle.split("")) {
    if (c === "?") {
      result += bag.charAt(0);
      bag = bag.slice(1);
    } else {
      result += c;
    }
  }

  return result;
}

function countSolutions(puzzle: string, counts: number[]): number {
  let count = 0;

  const test = createTest(counts);
  const split = puzzle.split("");
  const missing =
    counts.reduce((total, n) => total + n) -
    split.filter((c) => c === "#").length;
  const empty = split.filter((c) => c === "?").length;
  const possibilities = [
    ...new Array(missing).fill("#"),
    ...new Array(empty - missing).fill("."),
  ].join("");

  const it = permutations(possibilities);

  let result = it.next();
  while (!result.done) {
    const attempt = fillIn(puzzle, result.value);

    if (test(attempt)) {
      count++;
    }

    result = it.next();
  }

  return count;
}

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
