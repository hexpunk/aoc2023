import readline from "readline";

let data = "";
let rowLength = 0;

// rotates 90 degrees counter-clockwise
// <- North
function toColumns(): string[] {
  const result = new Array(rowLength).fill("");

  for (let i = 0; i < data.length; i++) {
    const index = rowLength - 1 - (i % rowLength);

    result[index] = result[index] + data[i];
  }

  return result;
}

// rotates 90 degrees clockwise
function rotate(input: string[]): string[] {
  const output = new Array(input[0].length).fill("");

  for (let col = 0; col < input[0].length; col++) {
    for (let row = 0; row < input.length; row++) {
      output[col] = input[row][col] + output[col];
    }
  }

  return output;
}

const gravityCache = new Map<string, string>();
// moves O characters as far left as they can go until they hit the end or # or another O
function gravity(input: string): string {
  if (gravityCache.has(input)) {
    return gravityCache.get(input)!;
  }

  let output = input;
  let i = -1;
  while ((i = output.indexOf(".O")) !== -1) {
    output = output.slice(0, i) + "O." + output.slice(i + 2);
  }

  gravityCache.set(input, output);

  return output;
}

function cycle(input: string[]): string[] {
  const north = input.map(gravity);
  const west = rotate(north).map(gravity);
  const south = rotate(west).map(gravity);
  const east = rotate(south).map(gravity);
  const final = rotate(east);

  return final;
}

function load(input: string): number {
  return input
    .split("")
    .reverse()
    .reduce((total, char, i) => (char === "O" ? total + i + 1 : total), 0);
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  rowLength = line.length;
  data += line;
});

rl.on("close", () => {
  let totalLoad = toColumns().reduce(
    (total, col) => total + load(gravity(col)),
    0
  );

  console.log(`Part 1 total load: ${totalLoad}`);

  let cycled = toColumns();

  const nodes: string[] = [];
  const edges = new Map<number, number>();

  const loops = 1_000_000_000;
  let i = 0;
  while (i < loops) {
    const beforeNode = String(cycled);
    let beforeId = nodes.indexOf(beforeNode);
    if (beforeId === -1) {
      beforeId = nodes.length;
      nodes.push(beforeNode);
    }

    cycled = cycle(cycled);

    const afterNode = String(cycled);
    let afterId = nodes.indexOf(afterNode);
    if (afterId === -1) {
      afterId = nodes.length;
      nodes.push(afterNode);
    }

    edges.set(beforeId, afterId);

    if (nodes.every((_, i) => edges.has(i))) {
      break;
    }

    i++;
  }

  const loopsEvery = edges.size - edges.get(edges.size - 1)!;
  const remaining = loops - i - 1;

  for (let i = 0; i < remaining % loopsEvery; i++) {
    cycled = cycle(cycled);
  }

  totalLoad = cycled.reduce((total, col) => total + load(col), 0);

  console.log(`Part 2 total load: ${totalLoad}`);
});
