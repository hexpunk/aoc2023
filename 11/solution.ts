import readline from "readline";

const grid: string[][] = [];
// [line, column], both 0-indexed
const galaxies: [number, number][] = [];

function expand(factor: number): [number, number][] {
  const copy = galaxies.map(([i, j]) => [i, j] as [number, number]);

  // Vertical expansion
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].every((x) => x === ".")) {
      for (let g = 0; g < galaxies.length; g++) {
        if (galaxies[g][0] > i) {
          copy[g][0] += factor - 1;
        }
      }
    }
  }

  // Horizontal expansion
  for (let j = 0; j < grid[0].length; j++) {
    const column = [];
    for (let i = 0; i < grid.length; i++) {
      column.push(grid[i][j]);
    }

    if (column.every((x) => x === ".")) {
      for (let g = 0; g < galaxies.length; g++) {
        if (galaxies[g][1] > j) {
          copy[g][1] += factor - 1;
        }
      }
    }
  }

  return copy;
}

function distance(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): number {
  return (
    Math.max(x1, x2) - Math.min(x1, x2) + (Math.max(y1, y2) - Math.min(y1, y2))
  );
}

function toKey(i: number, j: number): string {
  return `${Math.min(i, j)},${Math.max(i, j)}`;
}

function pairUp<T>(arr: T[]): [T, T][] {
  const pairs: [T, T][] = [];
  const visited = new Set<string>();

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i === j || visited.has(toKey(i, j))) {
        continue;
      }

      pairs.push([arr[i], arr[j]]);
      visited.add(toKey(i, j));
    }
  }

  return pairs;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  grid.push(line.split(""));
});

rl.on("close", () => {
  // Index galaxies
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "#") {
        galaxies.push([i, j]);
      }
    }
  }

  let pairs = pairUp(expand(2));
  let distanceSum = pairs.reduce((total, [i, j]) => total + distance(i, j), 0);

  console.log(`Part 1 distance sum: ${distanceSum}`);

  pairs = pairUp(expand(1_000_000));
  distanceSum = pairs.reduce((total, [i, j]) => total + distance(i, j), 0);

  console.log(`Part 2 distance sum: ${distanceSum}`);
});
