import readline from "readline";

interface Coordinate {
  x: number;
  y: number;
}

interface Edge {
  point1: Coordinate;
  point2: Coordinate;
  length: number;
}

function newEdgePart1(prev: Edge | undefined, input: string): Edge {
  const point1 = prev?.point2 ?? { x: 0, y: 0 };
  let [direction, strSpaces] = input.split(" ");
  const spaces = Number(strSpaces);

  let point2: Coordinate;
  if (direction === "R") {
    point2 = { ...point1, x: point1.x + Number(spaces) };
  } else if (direction === "L") {
    point2 = { ...point1, x: point1.x - Number(spaces) };
  } else if (direction === "U") {
    point2 = { ...point1, y: point1.y - Number(spaces) };
  } else {
    point2 = { ...point1, y: point1.y + Number(spaces) };
  }

  return {
    point1,
    point2,

    length: spaces,
  };
}

function newEdgePart2(prev: Edge | undefined, input: string): Edge {
  const point1 = prev?.point2 ?? { x: 0, y: 0 };
  const [, , color] = input.split(" ");

  const spaces = parseInt(color.slice(2, color.length - 2), 16);
  const direction = color.slice(color.length - 2, color.length - 1);

  let point2: Coordinate;
  if (direction === "0") {
    point2 = { ...point1, x: point1.x + spaces };
  } else if (direction === "2") {
    point2 = { ...point1, x: point1.x - spaces };
  } else if (direction === "3") {
    point2 = { ...point1, y: point1.y - spaces };
  } else {
    point2 = { ...point1, y: point1.y + spaces };
  }

  return {
    point1,
    point2,

    length: spaces,
  };
}

function area(edges: Edge[]): number {
  const borderArea = edges.reduce((total, edge) => total + edge.length, 0);

  const shoelace =
    edges.reduce(
      (total, edge) =>
        total + (edge.point1.x * edge.point2.y - edge.point2.x * edge.point1.y),
      0
    ) / 2;

  return shoelace + borderArea / 2 + 1;
}

const edges1: Edge[] = [];
const edges2: Edge[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  edges1.push(newEdgePart1(edges1[edges1.length - 1], line));
  edges2.push(newEdgePart2(edges2[edges2.length - 1], line));
});

rl.on("close", () => {
  const a1 = area(edges1);

  console.log(`Part 1 area: ${a1}`);

  const a2 = area(edges2);

  console.log(`Part 2 area: ${a2}`);
});
