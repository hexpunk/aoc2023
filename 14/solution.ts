import readline from "readline";

interface Platform {
  data: string;
  rowLength: number;
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
  return input.rowLength;
}

function columns(input: Platform): number {
  return input.data.length / rows(input);
}

function get(input: Platform, row: number, column: number): string {
  return input.data[row * rows(input) + column];
}

function set(
  input: Platform,
  row: number,
  column: number,
  char: string
): Platform {
  const output = { ...input };

  const i = row * rows(output) + column;
  output.data =
    output.data.slice(0, i) + char + output.data.slice(i + char.length);

  return output;
}

// moves O characters as far left as they can go until they hit the end or # or another O
function gravity(input: Platform, direction: Directions): Platform {
  let output = { ...input };

  const numRows = rows(output);
  const numCols = columns(output);

  if (direction === Directions.North) {
    // Move O ^ until it hits # or O
    for (let col = 0; col < numCols; col++) {
      let row = 0;
      // numRows - 1 because it's evaluating pairs
      while (row < numRows - 1) {
        const one = get(output, row, col);
        const two = get(output, row + 1, col);

        if (one === Values.Empty && two === Values.RoundRock) {
          output = set(output, row, col, Values.RoundRock);
          output = set(output, row + 1, col, Values.Empty);

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
        const one = get(output, row, col);
        const two = get(output, row, col + 1);

        if (one === Values.Empty && two === Values.RoundRock) {
          output = set(output, row, col, Values.RoundRock);
          output = set(output, row, col + 1, Values.Empty);

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
        const one = get(output, row, col);
        const two = get(output, row - 1, col);

        if (one === Values.Empty && two === Values.RoundRock) {
          output = set(output, row, col, Values.RoundRock);
          output = set(output, row - 1, col, Values.Empty);

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
        const one = get(output, row, col);
        const two = get(output, row, col - 1);

        if (one === Values.Empty && two === Values.RoundRock) {
          output = set(output, row, col, Values.RoundRock);
          output = set(output, row, col - 1, Values.Empty);

          col = numCols - 1;
        } else {
          col--;
        }
      }
    }
  }

  return output;
}

function cycle(input: Platform): Platform {
  const north = gravity(input, Directions.North);
  const west = gravity(north, Directions.West);
  const south = gravity(west, Directions.South);
  const east = gravity(south, Directions.East);

  return east;
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

const input: Platform = { data: "", rowLength: 0 };

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  input.data += line;
  input.rowLength = line.length;
});

rl.on("close", () => {
  let totalLoad = northLoad(gravity(input, Directions.North));

  console.log(`Part 1 total load: ${totalLoad}`);

  let cycled = input;
  for (let i = 0; i < 1_000_000_000; i++) {
    if (i % 10_000 === 0) {
      console.log(`Doing cycle ${i}`);
    }

    cycled = cycle(cycled);
  }

  totalLoad = northLoad(cycled);

  console.log(`Part 2 total load: ${totalLoad}`);
});
