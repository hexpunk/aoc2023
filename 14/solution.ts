import readline from "readline";

interface Platform {
  data: string[][];
}

enum Values {
  RoundRock = "O",
  FlatRock = "#",
  Empty = ".",
}

enum Directions {
  North = 0,
  West = 1,
  South = 2,
  East = 3,
}

function rows(input: Platform): number {
  return input.data.length;
}

function columns(input: Platform): number {
  return input.data[0].length;
}

function get(input: Platform, row: number, column: number): string {
  return input.data[row][column];
}

function set(input: Platform, row: number, column: number, char: string) {
  input.data[row][column] = char;
}

// moves O characters as far left as they can go until they hit the end or # or another O
function gravity(input: Platform, direction: Directions) {
  const numRows = rows(input);
  const numCols = columns(input);

  if (direction === Directions.North) {
    // Move O ^ until it hits # or O
    for (let col = 0; col < numCols; col++) {
      let row = 0;
      // numRows - 1 because it's evaluating pairs
      while (row < numRows - 1) {
        const one = get(input, row, col);
        const two = get(input, row + 1, col);

        if (one === Values.Empty && two === Values.RoundRock) {
          set(input, row, col, Values.RoundRock);
          set(input, row + 1, col, Values.Empty);

          row = 0;
        } else {
          row++;
        }
      }
    }
  } else if (direction === Directions.West) {
    // Move O <- until it hits # or O
    for (let row = 0; row < numRows; row++) {
      let col = 0;
      // numCols - 1 because it's evaluting pairs
      while (col < numCols - 1) {
        const one = get(input, row, col);
        const two = get(input, row, col + 1);

        if (one === Values.Empty && two === Values.RoundRock) {
          set(input, row, col, Values.RoundRock);
          set(input, row, col + 1, Values.Empty);

          col = 0;
        } else {
          col++;
        }
      }
    }
  } else if (direction === Directions.South) {
    // Move O v until it hits # or O
    for (let col = 0; col < numCols; col++) {
      let row = numRows - 1;
      // Stop BEFORE 0 because we're evaluating pairs
      while (row > 0) {
        const one = get(input, row, col);
        const two = get(input, row - 1, col);

        if (one === Values.Empty && two === Values.RoundRock) {
          set(input, row, col, Values.RoundRock);
          set(input, row - 1, col, Values.Empty);

          row = numRows - 1;
        } else {
          row--;
        }
      }
    }
  } else if (direction === Directions.East) {
    // Move O -> until it hits # or O
    for (let row = 0; row < numRows; row++) {
      let col = numCols - 1;
      // Stop BEFORE 0 because we're evaluating pairs
      while (col > 0) {
        const one = get(input, row, col);
        const two = get(input, row, col - 1);

        if (one === Values.Empty && two === Values.RoundRock) {
          set(input, row, col, Values.RoundRock);
          set(input, row, col - 1, Values.Empty);

          col = numCols - 1;
        } else {
          col--;
        }
      }
    }
  }
}

function cycle(input: Platform) {
  gravity(input, Directions.North);
  gravity(input, Directions.West);
  gravity(input, Directions.South);
  gravity(input, Directions.East);
}

function northLoad(input: Platform): number {
  const numRows = rows(input);
  let total = 0;

  for (let col = 0; col < columns(input); col++) {
    for (let row = 0; row < numRows; row++) {
      if (get(input, row, col) === Values.RoundRock) {
        total += numRows - row;
      }
    }
  }

  return total;
}

const input1: Platform = { data: [] };
const input2: Platform = { data: [] };

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  input1.data.push(line.split(""));
  input2.data.push(line.split(""));
});

rl.on("close", () => {
  gravity(input1, Directions.North);
  let totalLoad = northLoad(input1);

  console.log(`Part 1 total load: ${totalLoad}`);

  for (let i = 0; i < 1_000_000_000; i++) {
    if (i % 1_000_000 === 0) {
      console.log(`${i / 1_000_000_000}% done...`);
    }

    cycle(input2);
  }

  totalLoad = northLoad(input2);

  console.log(`Part 2 total load: ${totalLoad}`);
});
