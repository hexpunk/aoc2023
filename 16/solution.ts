import readline from "readline";

enum Direction {
  North = "N",
  West = "W",
  South = "S",
  East = "E",
}

interface Beam {
  line: number;
  column: number;
  direction: Direction;
}

interface State {
  visited: Set<string>;
  activeBeams: Beam[];
}

function isDone(state: State): boolean {
  return state.activeBeams.length === 0;
}

function newState(beam: Beam): State {
  return {
    visited: new Set(),
    activeBeams: [beam],
  };
}

function beamToKey(beam: Beam): string {
  return `${beam.line},${beam.column}|${beam.direction}`;
}

function beamOutOfBounds(grid: string[][], beam: Beam): boolean {
  return (
    beam.line < 0 ||
    beam.column < 0 ||
    beam.line >= grid.length ||
    beam.column >= grid[beam.line].length
  );
}

function beamVisited(state: State, beam: Beam): boolean {
  return state.visited.has(beamToKey(beam));
}

function stepBeam(beam: Beam) {
  if (beam.direction === Direction.North) {
    beam.line--;
  } else if (beam.direction === Direction.West) {
    beam.column--;
  } else if (beam.direction === Direction.South) {
    beam.line++;
  } else if (beam.direction === Direction.East) {
    beam.column++;
  }
}

function runStep(grid: string[][], state: State, beam: Beam) {
  stepBeam(beam);

  if (beamOutOfBounds(grid, beam) || beamVisited(state, beam)) {
    state.activeBeams = state.activeBeams.filter((b) => b !== beam);
  } else {
    state.visited.add(beamToKey(beam));

    const char = grid[beam.line][beam.column];

    if (char === "\\") {
      switch (beam.direction) {
        case Direction.North:
          beam.direction = Direction.West;
          break;

        case Direction.West:
          beam.direction = Direction.North;
          break;

        case Direction.South:
          beam.direction = Direction.East;
          break;

        case Direction.East:
          beam.direction = Direction.South;
          break;
      }
    } else if (char === "/") {
      switch (beam.direction) {
        case Direction.North:
          beam.direction = Direction.East;
          break;

        case Direction.West:
          beam.direction = Direction.South;
          break;

        case Direction.South:
          beam.direction = Direction.West;
          break;

        case Direction.East:
          beam.direction = Direction.North;
          break;
      }
    } else if (
      char === "|" &&
      (beam.direction === Direction.East || beam.direction === Direction.West)
    ) {
      beam.direction = Direction.North;
      state.activeBeams.push({ ...beam, direction: Direction.South });
    } else if (
      char === "-" &&
      (beam.direction === Direction.North || beam.direction === Direction.South)
    ) {
      beam.direction = Direction.East;
      state.activeBeams.push({ ...beam, direction: Direction.West });
    }
  }
}

function simulate(grid: string[][], state: State) {
  while (!isDone(state)) {
    for (const beam of state.activeBeams) {
      runStep(grid, state, beam);
    }
  }
}

function countBeamedSpaces(state: State): number {
  const spaces = new Set<string>();

  for (const key of Array.from(state.visited)) {
    const [coords] = key.split("|");
    spaces.add(coords);
  }

  return spaces.size;
}

const grid: string[][] = [];

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  grid.push(line.split(""));
});

rl.on("close", () => {
  const state = newState({ line: 0, column: -1, direction: Direction.East });

  simulate(grid, state);

  const count = countBeamedSpaces(state);

  console.log(`Part 1 total spaces: ${count}`);

  const maxLine = grid.length;
  const maxColumn = grid[0].length;

  const initialBeams: Beam[] = [];
  for (let i = 0; i < maxLine; i++) {
    initialBeams.push(
      { line: i, column: -1, direction: Direction.East },
      { line: i, column: maxColumn, direction: Direction.West }
    );
  }
  for (let i = 0; i < maxColumn; i++) {
    initialBeams.push(
      { line: -1, column: i, direction: Direction.South },
      { line: maxLine, column: i, direction: Direction.North }
    );
  }

  const max = initialBeams
    .map((beam) => {
      const state = newState(beam);
      simulate(grid, state);
      return countBeamedSpaces(state);
    })
    .reduce((max, n) => Math.max(max, n));

  console.log(`Part 2 max spaces: ${max}`);
});
