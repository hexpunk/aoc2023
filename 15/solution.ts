import readline from "readline";

function hash(input: string): number {
  let currentValue = 0;

  for (let i = 0; i < input.length; i++) {
    currentValue += input.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }

  return currentValue;
}

let input = "";

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  input += line;
});

rl.on("close", () => {
  const hashSum = input.split(",").reduce((total, str) => total + hash(str), 0);

  console.log(`Part 1 hash sum: ${hashSum}`);
});
