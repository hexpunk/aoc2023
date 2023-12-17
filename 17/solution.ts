import readline from "readline";

function key([line, column]: [number, number]): string {
  return `${line},${column}`;
}

function value(key: string): [number, number] {
  return key.split(",").map(Number) as [number, number];
}

function aStar(
  start: [number, number],
  goal: [number, number],
  h: (node: [number, number]) => number
) {
  // "line,column"
  const openSet = new Set<string>();

  // "line,column": [line, column]
  const cameFrom = new Map<string, [number, number]>();

  // "line,column": cost
  const gScore = new Map<string, number>();
  gScore.set(key(start), 0);

  const fScore = new Map<string, number>();
  fScore.set(key(start), h(start));

  while (openSet.size > 0) {
    const current = Array.from(fScore.entries())
      .filter(([key]) => openSet.has(key))
      .reduce((lowest, entry) => (lowest[1] > entry[1] ? entry : lowest))[0];

    if (current === key(goal)) {
      return; // reached goal!
    }

    openSet.delete(current);
  }
}

const grid: string[][] = [];

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  grid.push(line.split(""));
});

rl.on("close", () => {});
