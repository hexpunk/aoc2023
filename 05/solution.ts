import readline from "readline";

interface Mapping {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
}

const part1Seeds: number[] = [];
const seedToSoil: Mapping[] = [];
const soilToFertilizer: Mapping[] = [];
const fertilizerToWater: Mapping[] = [];
const waterToLight: Mapping[] = [];
const lightToTemperature: Mapping[] = [];
const temperatureToHumidity: Mapping[] = [];
const humidityToLocation: Mapping[] = [];

function parseSeeds(input: string) {
  part1Seeds.push(...input.substring("seeds: ".length).split(" ").map(Number));
}

let currentMap: Mapping[] | null = null;
function parseMap(input: string) {
  if (input.trim().length === 0) {
    // Sort by source range start to make lookup more efficient
    currentMap?.sort((a, b) => a.sourceRangeStart - b.sourceRangeStart);
    currentMap = null;
  } else if (input.endsWith("map:")) {
    currentMap =
      {
        "seed-to-soil": seedToSoil,
        "soil-to-fertilizer": soilToFertilizer,
        "fertilizer-to-water": fertilizerToWater,
        "water-to-light": waterToLight,
        "light-to-temperature": lightToTemperature,
        "temperature-to-humidity": temperatureToHumidity,
        "humidity-to-location": humidityToLocation,
      }[input.split(" ")[0]] ?? null;

    if (typeof currentMap === "undefined") {
      throw new Error(`Couldn't find mapping for "${input}"`);
    }
  } else {
    const [destinationRangeStart, sourceRangeStart, rangeLength] = input
      .split(" ")
      .map(Number);

    currentMap?.push({ destinationRangeStart, sourceRangeStart, rangeLength });
  }
}

function parse(input: string) {
  if (input.startsWith("seeds:")) {
    parseSeeds(input);
  } else {
    parseMap(input);
  }
}

function getDestination(mappings: Mapping[], sourceId: number): number {
  const mapping = mappings.find(
    (mapping) =>
      mapping.sourceRangeStart <= sourceId &&
      mapping.sourceRangeStart + mapping.rangeLength - 1 >= sourceId
  );

  if (typeof mapping === "undefined") {
    return sourceId;
  } else {
    const offset = sourceId - mapping.sourceRangeStart;

    return mapping.destinationRangeStart + offset;
  }
}

function getSource(mappings: Mapping[], destinationId: number): number {
  const mapping = mappings.find(
    (mapping) =>
      mapping.destinationRangeStart <= destinationId &&
      mapping.destinationRangeStart + mapping.rangeLength - 1 >= destinationId
  );

  if (typeof mapping === "undefined") {
    return destinationId;
  } else {
    const offset = destinationId - mapping.destinationRangeStart;

    return mapping.sourceRangeStart + offset;
  }
}

function seedToLocationId(seedId: number): number {
  const soilId = getDestination(seedToSoil, seedId);
  const fertilizerId = getDestination(soilToFertilizer, soilId);
  const waterId = getDestination(fertilizerToWater, fertilizerId);
  const lightId = getDestination(waterToLight, waterId);
  const temperatureId = getDestination(lightToTemperature, lightId);
  const humidityId = getDestination(temperatureToHumidity, temperatureId);

  return getDestination(humidityToLocation, humidityId);
}

function locationToSeedId(locationId: number): number {
  const humidityId = getSource(humidityToLocation, locationId);
  const temperatureId = getSource(temperatureToHumidity, humidityId);
  const lightId = getSource(lightToTemperature, temperatureId);
  const waterId = getSource(waterToLight, lightId);
  const fertilizerId = getSource(fertilizerToWater, waterId);
  const soilId = getSource(soilToFertilizer, fertilizerId);

  return getSource(seedToSoil, soilId);
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  parse(line);
});

rl.on("close", () => {
  let lowestLocationId: number | null = null;

  for (const seed of part1Seeds) {
    lowestLocationId = Math.min(
      lowestLocationId ?? Infinity,
      seedToLocationId(seed)
    );
  }

  console.log(`Part 1 lowest location number: ${lowestLocationId}`);

  for (let i = 0; ; i++) {
    const seedId = locationToSeedId(i);

    for (let j = 0; j < part1Seeds.length; j += 2) {
      const start = part1Seeds[j];
      const length = part1Seeds[j + 1];

      if (seedId >= start && seedId <= start + length) {
        console.log(`Part 2 lowest location number: ${i}`);
        return;
      }
    }
  }
});
