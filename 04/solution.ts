import readline from "readline";

function parseCard(input: string): number {
  // Replace pesky double or triple spaces
  input = input.replaceAll(/ {2,}/g, " ");

  const { groups } = /^Card (?<card>.*): (?<winners>.*) \| (?<picks>.*)$/g.exec(
    input
  )!;

  const winners = new Set<string>(groups!.winners.split(" "));

  const matches = groups!.picks.split(" ").filter((pick) => winners.has(pick));

  // Total points
  return matches.length > 0 ? Math.pow(2, matches.length - 1) : 0;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let pointsTotal = 0;
rl.on("line", (line) => {
  pointsTotal += parseCard(line);
});

rl.on("close", () => {
  console.log(`Part 1 total: ${pointsTotal}`);
});
