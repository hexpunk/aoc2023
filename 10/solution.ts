import readline from "readline";

// This is a pipe that exists within the loop.
interface Pipe {
  // [line, column], both 0-indexed
  coord: [number, number];
  // This is the number of steps from the starting location.
  steps: number;
}

const grid: string[][] = [];
// [line, column], both 0-indexed
let start: [number, number] | null = null;

const connectsNorth = ["S", "|", "L", "J"];
const connectsEast = ["S", "-", "L", "F"];
const connectsSouth = ["S", "|", "7", "F"];
const connectsWest = ["S", "-", "J", "7"];

function getConnectingCoords([line, column]: [number, number]): Array<
  [number, number]
> {
  const connections: Array<[number, number]> = [];
  const here = grid[line][column];

  // Connects north?
  if (connectsNorth.includes(here)) {
    const north = grid[line - 1][column];
    // Connects south?
    if (connectsSouth.includes(north)) {
      connections.push([line - 1, column]);
    }
  }

  // Connects east?
  if (connectsEast.includes(here)) {
    const east = grid[line][column + 1];
    // Connects west?
    if (connectsWest.includes(east)) {
      connections.push([line, column + 1]);
    }
  }

  // Connects south?
  if (connectsSouth.includes(here)) {
    const south = grid[line + 1][column];
    // Connects north?
    if (connectsNorth.includes(south)) {
      connections.push([line + 1, column]);
    }
  }

  // Connects west?
  if (connectsWest.includes(here)) {
    const west = grid[line][column - 1];
    // Connects east?
    if (connectsEast.includes(west)) {
      connections.push([line, column - 1]);
    }
  }

  return connections;
}

function coordToString([line, column]: [number, number]): string {
  return `${line},${column}`;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  grid.push(line.split(""));
  const i = line.indexOf("S");

  if (i !== -1) {
    start = [grid.length - 1, i];
  }
});

rl.on("close", () => {
  let steps = 1;
  const cache = new Set([coordToString(start!)]);
  const visited: Pipe[] = [{ coord: start!, steps: 0 }];
  let nextLocations: Array<[number, number]> = [start!];

  while (nextLocations.length > 0) {
    const prevLocations = nextLocations;
    nextLocations = [];

    for (const location of prevLocations) {
      for (const next of getConnectingCoords(location)) {
        if (!cache.has(coordToString(next))) {
          cache.add(coordToString(next));
          visited.push({ coord: next, steps });
          nextLocations.push(next);
        }
      }
    }

    steps++;
  }

  const maxSteps = Math.max(...visited.map((pipe) => pipe.steps));

  console.log(`Part 1 furthest pipe: ${maxSteps} steps`);

  /*
   * For Part 2, I'm going to try to figure out which positions are inside the loop
   * by counting the number of border characters left and above a given spot. If the
   * number of borders are odd, we're inside the loop. The possible exception to this
   * is if multiple border spaces are contiguous. Contiguous border spaces should
   * only count as one border.
   *
   * ┌───────────┐
   * │ A         │ B
   * │  ┌────────┘
   * │  │    C
   * │  └───┐
   * │    D │
   * └──────┘
   *
   * In this example, A has 1 border to the left and 1 border above.
   * B has 2 borders to the left and 0 borders above.
   * C has 2 borders to the left and 2 borders above.
   * D has 1 border to the left and 3 borders above.
   */

  const printChars: { [key: string]: string } = {
    "|": "│",
    "-": "─",
    F: "┌",
    J: "┘",
    "7": "┐",
    L: "└",
    S: "S",
  };

  // Number of border spaces seen per column
  const columnBorderCount = new Array<number>(grid[0].length).fill(0);
  let rowBorderCount = 0;
  let innerCount = 0;

  for (let i = 0; i < grid.length; i++) {
    rowBorderCount = 0;

    let printLine = "";
    const line = grid[i];
    for (let j = 0; j < line.length; j++) {
      if (cache.has(coordToString([i, j]))) {
        rowBorderCount++;
        columnBorderCount[j]++;
        printLine += printChars[grid[i][j]];
      } else {
        if (rowBorderCount % 2 === 1 && columnBorderCount[j] % 2 === 1) {
          innerCount++;
          printLine += "I";
        } else {
          printLine += "O";
        }
      }
    }
    console.log(printLine);
  }
});
