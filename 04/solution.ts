import readline from "readline";

function getMatchCount(input: string): number {
  // Replace pesky double or triple spaces
  input = input.replaceAll(/ {2,}/g, " ");

  const { groups } = /^Card .*: (?<winners>.*) \| (?<picks>.*)$/g.exec(input)!;

  const winners = new Set<string>(groups!.winners.split(" "));

  const matches = groups!.picks.split(" ").filter((pick) => winners.has(pick));

  return matches.length;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let currentCardIndex = 0;
let pointsTotal = 0;
let numCards: number[] = [];

rl.on("line", (line) => {
  numCards[currentCardIndex] = numCards[currentCardIndex] ?? 1;

  const matches = getMatchCount(line);

  if (matches > 0) {
    pointsTotal += Math.pow(2, matches - 1);
  }

  for (let i = 1; i <= matches; i++) {
    numCards[currentCardIndex + i] = numCards[currentCardIndex + i] ?? 1;
    numCards[currentCardIndex + i] += numCards[currentCardIndex];
  }

  currentCardIndex++;
});

rl.on("close", () => {
  console.log(`Part 1 total: ${pointsTotal}`);
  console.log(
    `Part 2 total: ${numCards.reduce((total, num) => total + num, 0)}`
  );
});
