import readline from "readline";

interface Pull {
  red: number;
  green: number;
  blue: number;
}

interface Bag extends Pull {}

interface Game {
  id: number;
  pulls: Pull[];
}

function parsePull(input: string): Pull {
  let pull = { red: 0, green: 0, blue: 0 };

  for (const cube of input.split(", ")) {
    const { groups } = /^(?<number>\d*) (?<color>red|green|blue)$/.exec(cube)!;

    pull[groups!.color as keyof Pull] = Number(groups!.number);
  }

  return pull;
}

function parseGame(input: string): Game {
  const { groups } = /^Game (?<id>[0-9]*): (?<pulls>.*)$/.exec(input)!;

  return {
    id: Number(groups!.id),
    pulls: groups!.pulls.split("; ").map(parsePull),
  };
}

function checkGame(bag: Bag, game: Game): boolean {
  return game.pulls.every(
    (pull) =>
      pull.red <= bag.red && pull.green <= bag.green && pull.blue <= bag.blue
  );
}

function minimumViableBag(game: Game): Bag {
  const bag: Bag = { red: 0, green: 0, blue: 0 };

  for (const pull of game.pulls) {
    bag.red = Math.max(bag.red, pull.red);
    bag.green = Math.max(bag.green, pull.green);
    bag.blue = Math.max(bag.blue, pull.blue);
  }

  return bag;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let idTotals = 0;
let sumOfPowers = 0;

const part1Bag: Bag = {
  red: 12,
  green: 13,
  blue: 14,
};

rl.on("line", (line) => {
  const game = parseGame(line);

  if (checkGame(part1Bag, game)) {
    idTotals += game.id;
  }

  const bag = minimumViableBag(game);
  sumOfPowers += bag.red * bag.green * bag.blue;
});

rl.on("close", () => {
  console.log(`Part 1 total: ${idTotals}`);
  console.log(`Part 2 total: ${sumOfPowers}`);
});
