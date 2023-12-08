import readline from "readline";

interface Node {
  left: string;
  right: string;
}

let path: string | null = null;
const nodeMap = new Map<string, Node>();

function parseNode(input: string) {
  const [, id, left, right] = /^(.{3}) = \((.{3}), (.{3})\)$/g.exec(input)!;

  nodeMap.set(id, { left, right });
}

function gcd(a: number, b: number): number {
  while (b > 0) {
    const t = a;
    a = b;
    b = t % b;
  }

  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  if (path === null) {
    path = line;
  } else if (line.length > 0) {
    parseNode(line);
  }
});

rl.on("close", () => {
  let steps = 0;
  let currentNodeName = "AAA";

  while (currentNodeName !== "ZZZ") {
    const node = nodeMap.get(currentNodeName)!;
    const nextDirection = path!.charAt(steps % path!.length);
    steps++;

    currentNodeName = nextDirection === "L" ? node.left : node.right;
  }

  console.log(`Part 1 total steps: ${steps}`);

  const nodeSteps = Array.from(nodeMap.keys())
    .filter((name) => name.charAt(2) === "A")
    .map((name) => {
      let steps = 0;
      let currentNodeName = name;

      while (currentNodeName.charAt(2) !== "Z") {
        const node = nodeMap.get(currentNodeName)!;
        const nextDirection = path!.charAt(steps % path!.length);
        steps++;

        currentNodeName = nextDirection === "L" ? node.left : node.right;
      }

      return steps;
    });

  steps = nodeSteps.reduce((prev, curr) => lcm(prev, curr));

  console.log(`Part 2 total steps: ${steps}`);
});
