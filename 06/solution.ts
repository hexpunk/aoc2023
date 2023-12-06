import readline from "readline";

interface Race {
  time: number;
  distance: number;
}

function parseRaces(input: string[]): Race[] {
  const times = input[0]
    .substring("Time:".length)
    .trim()
    .replaceAll(/ {2,}/g, " ")
    .split(" ");

  const distances = input[1]
    .substring("Distance:".length)
    .trim()
    .replaceAll(/ {2,}/g, " ")
    .split(" ");

  return times.map((time, i) => ({
    time: Number(time),
    distance: Number(distances[i]),
  }));
}

function parseRace(input: string[]): Race {
  const time = input[0].substring("Time:".length).replaceAll(" ", "");

  const distance = input[1].substring("Distance:".length).replaceAll(" ", "");

  return { time: Number(time), distance: Number(distance) };
}

function countWinningStrategies(race: Race): number {
  let winners = 0;
  // Ignore 0 and race.time because those would both result in 0 distance.
  for (let i = 1; i < race.time; i++) {
    if (i * (race.time - i) > race.distance) {
      winners++;
    }
  }

  return winners;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

const lines: string[] = [];
rl.on("line", (line) => {
  if (line.length > 0) {
    lines.push(line);
  }
});

rl.on("close", () => {
  const races = parseRaces(lines);

  const part1Answer = races
    .map(countWinningStrategies)
    .reduce((total, num) => total * num);

  console.log(`Part 1 answer: ${part1Answer}`);

  const race = parseRace(lines);

  console.log(`Part 2 answer: ${countWinningStrategies(race)}`);
});
