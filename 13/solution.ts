import readline from "readline";

interface GroundMap {
  data: string;
  rowLength: number;
}

function countRows(gm: GroundMap): number {
  return gm.data.length / gm.rowLength;
}

function countColumns(gm: GroundMap): number {
  return gm.rowLength;
}

function toRows(gm: GroundMap): string[] {
  const result: string[] = [];
  let data = gm.data;

  while (data.length > 0) {
    result.push(data.substring(0, gm.rowLength));
    data = data.substring(gm.rowLength);
  }

  return result;
}

// Rotates 90 degrees clockwise
function toColumns(gm: GroundMap): string[] {
  const rows = countRows(gm);
  const result: string[] = [];

  for (let i = 0; i < gm.rowLength; i++) {
    let str = "";
    for (let j = rows - 1; j >= 0; j--) {
      str += gm.data[j * gm.rowLength + i];
    }
    result.push(str);
  }

  return result;
}

function findMirror(rows: string[]): number | null {
  for (let i = 1; i < rows.length; i++) {
    let left = rows.slice(0, i);
    let right = rows.slice(i);

    if (right.length > left.length) {
      right = right.slice(0, left.length);
    }

    if (left.length > right.length) {
      left = left.slice(left.length - right.length);
    }

    if (left.join("") === right.reverse().join("")) {
      return i;
    }
  }

  return null;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});
const dataset: GroundMap[] = [];
let inProgress: GroundMap = { data: "", rowLength: 0 };
rl.on("line", (line) => {
  if (line === "") {
    dataset.push(inProgress);
    inProgress = { data: "", rowLength: 0 };
  } else {
    inProgress.data += line;
    inProgress.rowLength = line.length;
  }
});

rl.on("close", () => {
  dataset.push(inProgress);

  let total = 0;

  for (const gm of dataset) {
    const column = findMirror(toColumns(gm));

    if (column === null) {
      const row = findMirror(toRows(gm));

      if (row !== null) {
        total += 100 * row;
      }
    } else {
      total += column;
    }
  }

  console.log(`Part 1 total: ${total}`);
});
