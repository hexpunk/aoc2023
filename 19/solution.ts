import readline from "readline";

enum Compare {
  GreaterThan = ">",
  LessThan = "<",
}

interface Rule {
  rating: keyof Part;
  compare: Compare;
  amount: number;
  next: string;
}

interface Workflow {
  rules: Rule[];
  fallthrough: string;
}

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

const workflows = new Map<string, Workflow>();
const parts: Part[] = [];

function accepted(part: Part): boolean {
  let workflowName = "in";

  outer: while (workflowName !== "A" && workflowName !== "R") {
    const workflow = workflows.get(workflowName)!;

    for (const rule of workflow.rules) {
      const value = part[rule.rating];

      if (
        (rule.compare === Compare.GreaterThan && value > rule.amount) ||
        (rule.compare === Compare.LessThan && value < rule.amount)
      ) {
        workflowName = rule.next;
        continue outer;
      }
    }

    workflowName = workflow.fallthrough;
  }

  return workflowName === "A";
}

function partTotal(part: Part): number {
  return part.x + part.m + part.a + part.s;
}

function parseWorkflow(input: string) {
  const openCurlyIndex = input.indexOf("{");
  const name = input.slice(0, openCurlyIndex);
  const rulesStrs = input
    .slice(openCurlyIndex + 1, input.length - 1)
    .split(",");

  workflows.set(name, {
    rules: rulesStrs.slice(0, rulesStrs.length - 1).map((ruleStr) => {
      const [amount, next] = ruleStr.slice(2).split(":");

      return {
        rating: ruleStr[0] as keyof Part,
        compare: ruleStr[1] as Compare,
        amount: Number(amount),
        next,
      };
    }),
    fallthrough: rulesStrs[rulesStrs.length - 1],
  });
}

function parsePart(input: string) {
  const [, x, m, a, s] = /^{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}$/.exec(input)!;

  parts.push({ x: Number(x), m: Number(m), a: Number(a), s: Number(s) });
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let parser = parseWorkflow;
rl.on("line", (line) => {
  if (line === "") {
    parser = parsePart;
  } else {
    parser(line);
  }
});

rl.on("close", () => {
  const total = parts.reduce(
    (total, part) => (accepted(part) ? total + partTotal(part) : total),
    0
  );

  console.log(`Part 1 total: ${total}`);
});
