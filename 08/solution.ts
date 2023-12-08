import readline from "readline";

interface Node {
  left: string;
  right: string;
}

let path: string | null = null;
const nodes = new Map<string, Node>();

function parseNode(input: string) {
  const [, id, left, right] = /^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)$/g.exec(
    input
  )!;

  nodes.set(id, { left, right });
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
    const node = nodes.get(currentNodeName)!;
    const nextDirection = path!.charAt(steps % path!.length);
    steps++;

    currentNodeName = nextDirection === "L" ? node.left : node.right;
  }

  console.log(`Part 1 total steps: ${steps}`);
});
