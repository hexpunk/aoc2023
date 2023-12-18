import readline from "readline";

interface Coordinate {
  x: number;
  y: number;
}

interface Edge {
  point1: Coordinate;
  point2: Coordinate;
  color: string;
}

function newEdge(prev: Edge | undefined, input: string): Edge {
  const point1 = prev?.point2 ?? { x: 0, y: 0 };
  const [direction, spaces, color] = input.split(" ");

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
    color: color.slice(1, color.length - 2),
  };
}

function listPoints(edge: Edge): Set<string> {
  const points = new Set<string>();

  if (edge.point1.x === edge.point2.x) {
    // Move vertically
    const top = edge.point1.y < edge.point2.y ? edge.point1 : edge.point2;
    const bottom = edge.point1 === top ? edge.point2 : edge.point1;

    for (let y = top.y; y <= bottom.y; y++) {
      points.add(`${edge.point1.x},${y}`);
    }
  } else {
    // Move horizontally
    const left = edge.point1.x < edge.point2.x ? edge.point1 : edge.point2;
    const right = left === edge.point1 ? edge.point2 : edge.point1;

    for (let x = left.x; x <= right.x; x++) {
      points.add(`${x},${edge.point1.y}`);
    }
  }

  return points;
}

const edges: Edge[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  edges.push(newEdge(edges[edges.length - 1], line));
});

rl.on("close", () => {
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
        x: Math.min(topLeft.x, edge.point1.x, edge.point2.x),
        y: Math.min(topLeft.y, edge.point1.y, edge.point2.y),
      },
      bottomRight: {
        x: Math.max(bottomRight.x, edge.point1.x, edge.point2.x),
        y: Math.max(bottomRight.y, edge.point1.y, edge.point2.y),
      },
    }),
    { topLeft: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 } }
  );

  const borderSet = edges.reduce((set, edge) => {
    for (const point of listPoints(edge).keys()) {
      set.add(point);
    }

    return set;
  }, new Set<string>());

  const interiorSet = new Set<string>();
  for (let y = topLeft.y; y <= bottomRight.y; y++) {
    for (let x = topLeft.x; x <= bottomRight.x; x++) {
      const key = `${x},${y}`;

      if (borderSet.has(key)) {
        continue;
      }

      const above = horizontal.filter((edge) => {
        const minX = Math.min(edge.point1.x, edge.point2.x);
        const maxX = Math.max(edge.point1.x, edge.point2.x);

        return edge.point1.y < y && minX <= x && maxX > x;
      });
      const left = vertical.filter((edge) => {
        const minY = Math.min(edge.point1.y, edge.point2.y);
        const maxY = Math.max(edge.point1.y, edge.point2.y);

        return edge.point1.x < x && minY <= y && maxY > y;
      });

      if (above.length % 2 === 1 && left.length % 2 === 1) {
        interiorSet.add(key);
      }
    }
  }

  const area = borderSet.size + interiorSet.size;

  console.log(`Part 1 area: ${area}`);
});
