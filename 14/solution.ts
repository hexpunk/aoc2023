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

// moves O characters as far left as they can go until they hit the end or # or another O
function gravity(input: string): string {
  let i = -1;
  while ((i = input.indexOf(".O")) !== -1) {
    input = input.slice(0, i) + "O." + input.slice(i + 2);
  }

  return input;
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
  const totalLoad = toColumns().reduce(
    (total, col) => total + load(gravity(col)),
    0
  );

  console.log(`Part 1 total load: ${totalLoad}`);
});
