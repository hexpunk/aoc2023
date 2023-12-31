import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let sum1 = 0;
let sum2 = 0;
rl.on("line", (line) => {
  const history = [line.split(" ").map(Number)];

  while (history[history.length - 1].some((x) => x !== 0)) {
    const last = history[history.length - 1];
    const next = [];

    for (let i = 1; i < last.length; i++) {
      next.push(last[i] - last[i - 1]);
    }

    history.push(next);
  }

  for (let i = history.length - 1; i > 0; i--) {
    const current = history[i];
    const next = history[i - 1];

    next.push(next[next.length - 1] + current[current.length - 1]);
    next.unshift(next[0] - current[0]);
  }

  sum1 += history[0][history[0].length - 1];
  sum2 += history[0][0];
});

rl.on("close", () => {
  console.log(`Part 1 sum: ${sum1}`);
  console.log(`Part 2 sum: ${sum2}`);
});
