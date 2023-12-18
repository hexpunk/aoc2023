import readline from "readline";

enum Direction {
  North,
  West,
  South,
  East,
}

type Coord = [number, number];

function direction([x1, y1]: Coord, [x2, y2]: Coord): Direction {
  if (x1 === x2) {
    return y1 < y2 ? Direction.East : Direction.West;
  } else {
    return x1 < x2 ? Direction.South : Direction.North;
  }
}

function key([line, column]: Coord): string {
  return `${line},${column}`;
}

function value(key: string): Coord {
  return key.split(",").map(Number) as Coord;
}

function neighbors([line, column]: Coord): Coord[] {
  return [
    [line, column + 1],
    [line, column - 1],
    [line + 1, column],
    [line - 1, column],
  ].filter(
    ([line, column]) =>
      line >= 0 && column >= 0 && line < grid.length && column < grid[0].length
  ) as Coord[];
}

function manhattan(a: Coord, b: Coord): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function path(cameFrom: Map<string, Coord>, last: Coord): Coord[] {
  const revPath: Coord[] = [last];
  let current = last;

  while (current[0] !== 0 && current[1] !== 0) {
    current = cameFrom.get(key(current))!;
    revPath.push(current);
  }

  // revPath.push([0, 0]);

  return revPath.reverse();
}

function aStar(
  start: Coord,
  goal: Coord,
  h: (cameFrom: Map<string, Coord>, current: Coord, neighbor?: Coord) => number
): Coord[] | null {
  const goalKey = key(goal);

  // "line,column"
  const openSet = new Set<string>();
  openSet.add(key(start));

  // "line,column": [line, column]
  const cameFrom = new Map<string, Coord>();

  // "line,column": cost
  const gScore = new Map<string, number>();
  gScore.set(key(start), 0);

  const fScore = new Map<string, number>();
  fScore.set(key(start), h(cameFrom, start));

  while (openSet.size > 0) {
    const currentKey = Array.from(openSet.keys())
      .map((key) => [key, fScore.get(key) ?? Infinity] as [string, number])
      .reduce((lowest, entry) => (lowest[1] > entry[1] ? entry : lowest))[0];
    const currentValue = value(currentKey);

    if (currentKey === goalKey) {
      return path(cameFrom, currentValue);
    }

    openSet.delete(currentKey);

    for (const neighborValue of neighbors(currentValue)) {
      const neighborKey = key(neighborValue);
      const tentativeGScore =
        (gScore.get(currentKey) ?? Infinity) +
        manhattan(currentValue, neighborValue);
      if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentValue);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(
          neighborKey,
          tentativeGScore + h(cameFrom, currentValue, neighborValue)
        );

        openSet.add(neighborKey);
      }
    }
  }

  return null;
}

function cost(
  cameFrom: Map<string, Coord>,
  current: Coord,
  next: Coord | null = null
): number {
  if (next === null) {
    // Cost of initial space
    return 0;
  }

  const prev1 = cameFrom.get(key(current)) ?? null;
  const prev2 = prev1 !== null ? cameFrom.get(key(prev1)) ?? null : null;
  const prev3 = prev2 !== null ? cameFrom.get(key(prev2)) ?? null : null;

  if (prev1 && prev2 && prev3) {
    const d1 = direction(prev3, prev2);
    const d2 = direction(prev2, prev1);
    const d3 = direction(prev1, current);
    const d4 = direction(current, next);

    if (d2 === d3 && d3 === d4) {
      return Infinity;
    }
  }

  return grid[next[0]][next[1]];
}

const grid: number[][] = [];

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  grid.push(line.split("").map(Number));
});

rl.on("close", () => {
  const bestPath = aStar([0, 0], [grid.length - 1, grid[0].length - 1], cost);

  console.log(bestPath);

  const heatLoss = bestPath?.reduce(
    (total, [line, column]) => total + grid[line][column],
    0
  );

  console.log(`Part 1 heat loss: ${heatLoss}`);
});
