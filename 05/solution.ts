import readline from "readline";

interface Seed {
  id: number;
}

interface Mapping {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
}

const seeds: Seed[] = [];
const seedToSoil: Mapping[] = [];
const soilToFertilizer: Mapping[] = [];
const fertilizerToWater: Mapping[] = [];
const waterToLight: Mapping[] = [];
const lightToTemperature: Mapping[] = [];
const temperatureToHumidity: Mapping[] = [];
const humidityToLocation: Mapping[] = [];

function parseSeeds(input: string) {
  seeds.push(
    ...input
      .substring("seeds: ".length)
      .split(" ")
      .map((id) => ({
        id: Number(id),
      }))
  );
}

let currentMap: Mapping[] | undefined = undefined;
function parseMap(input: string) {
  if (input.trim().length === 0) {
    // Sort by source range start to make lookup more efficient
    currentMap?.sort((a, b) => a.sourceRangeStart - b.sourceRangeStart);
    currentMap = undefined;
  } else if (input.endsWith("map:")) {
    currentMap = {
      "seed-to-soil": seedToSoil,
      "soil-to-fertilizer": soilToFertilizer,
      "fertilizer-to-water": fertilizerToWater,
      "water-to-light": waterToLight,
      "light-to-temperature": lightToTemperature,
      "temperature-to-humidity": temperatureToHumidity,
      "humidity-to-location": humidityToLocation,
    }[input.split(" ")[0]];

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

function seedIdToLocationId({ id: seedId }: Seed): number {
  const soilId = getDestination(seedToSoil, seedId);
  const fertilizerId = getDestination(soilToFertilizer, soilId);
  const waterId = getDestination(fertilizerToWater, fertilizerId);
  const lightId = getDestination(waterToLight, waterId);
  const temperatureId = getDestination(lightToTemperature, lightId);
  const humidityId = getDestination(temperatureToHumidity, temperatureId);

  return getDestination(humidityToLocation, humidityId);
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  parse(line);
});

rl.on("close", () => {
  const locationIds = seeds.map(seedIdToLocationId);

  console.log(`Part 1 lowest location number: ${Math.min(...locationIds)}`);
});
