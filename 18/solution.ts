import readline from "readline";

interface Coordinate {
  x: number;
  y: number;
}

interface Edge {
  point1: Coordinate;
  point2: Coordinate;
  length: number;

  // Pre-compute these because we use them a lot.
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function newEdgePart1(prev: Edge | undefined, input: string): Edge {
  const point1 = prev?.point2 ?? { x: 0, y: 0 };
  let [direction, strSpaces, _color] = input.split(" ");
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

    minX: Math.min(point1.x, point2.x),
    minY: Math.min(point1.y, point2.y),
    maxX: Math.max(point1.x, point2.x),
    maxY: Math.max(point1.y, point2.y),
  };
}

function newEdgePart2(prev: Edge | undefined, input: string): Edge {
  const point1 = prev?.point2 ?? { x: 0, y: 0 };
  const [direction, _spaces, color] = input.split(" ");

  const spaces = parseInt(color.slice(2, color.length - 1), 16);

  let point2: Coordinate;
  if (direction === "R") {
    point2 = { ...point1, x: point1.x + spaces };
  } else if (direction === "L") {
    point2 = { ...point1, x: point1.x - spaces };
  } else if (direction === "U") {
    point2 = { ...point1, y: point1.y - spaces };
  } else {
    point2 = { ...point1, y: point1.y + spaces };
  }

  return {
    point1,
    point2,

    length: spaces,

    minX: Math.min(point1.x, point2.x),
    minY: Math.min(point1.y, point2.y),
    maxX: Math.max(point1.x, point2.x),
    maxY: Math.max(point1.y, point2.y),
  };
}

function withinBorders(edges: Edge[], point: Coordinate): boolean {
  for (const edge of edges) {
    if (
      (edge.point1.y === edge.point2.y &&
        point.y === edge.point1.y &&
        edge.minX <= point.x &&
        edge.maxX >= point.x) ||
      (point.x === edge.point1.x &&
        edge.minY <= point.y &&
        edge.maxY >= point.y)
    ) {
      return true;
    }
  }

  return false;
}

function area(edges: Edge[]): number {
  const [horizontal, vertical] = edges.reduce(
    ([horizontal, vertical], edge) => {
      if (edge.point1.y === edge.point2.y) {
        horizontal.push(edge);
      } else {
        vertical.push(edge);
      }

      return [horizontal, vertical];
    },
    [[], []] as [Edge[], Edge[]]
  );

  const { topLeft, bottomRight } = edges.reduce(
    ({ topLeft, bottomRight }, edge) => ({
      topLeft: {
        x: Math.min(topLeft.x, edge.minX),
        y: Math.min(topLeft.y, edge.minY),
      },
      bottomRight: {
        x: Math.max(bottomRight.x, edge.maxX),
        y: Math.max(bottomRight.y, edge.maxY),
      },
    }),
    { topLeft: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 } }
  );

  const borderArea = edges.reduce((total, edge) => total + edge.length, 0);

  let interiorArea = 0;
  for (let y = topLeft.y; y <= bottomRight.y; y++) {
    for (let x = topLeft.x; x <= bottomRight.x; x++) {
      if (withinBorders(edges, { x, y })) {
        continue;
      }

      const above = horizontal.filter(
        (edge) => edge.point1.y < y && edge.minX <= x && edge.maxX > x
      );
      const left = vertical.filter(
        (edge) => edge.point1.x < x && edge.minY <= y && edge.maxY > y
      );

      if (above.length % 2 === 1 && left.length % 2 === 1) {
        interiorArea++;
      }
    }
  }

  return borderArea + interiorArea;
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
