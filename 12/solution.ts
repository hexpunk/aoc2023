import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

function swap(str: string, i: number, j: number) {
  const arr = str.split("");
  arr[j] = str.charAt(i);
  arr[i] = str.charAt(j);

  return arr.join("");
}

// Heap's algorithm
function* permutations(input: string): Generator<string> {
  const stack = new Array(input.length).fill(0);

  const cache = new Set<string>([input]);
  yield input;

  let i = 1;
  while (i < input.length) {
    if (stack[i] < i) {
      if (i % 2 === 0) {
        input = swap(input, 0, i);
      } else {
        input = swap(input, stack[i], i);
      }

      if (!cache.has(input)) {
        cache.add(input);
        yield input;
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

rl.on("line", (line) => {
  const [puzzle, rawNumbers] = line.split(" ");

  sum += countSolutions(puzzle, rawNumbers.split(",").map(Number));
});

rl.on("close", () => {
  console.log(`Part 1 sum: ${sum}`);
});
