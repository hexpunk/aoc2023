import readline from "readline";

interface Token {
  line: number;
  column: number;
  value: string;
}

interface State {
  line: number;
  nums: Token[];
  syms: Token[];
}

// Modifies `state`
function parseLine(state: State, input: string) {
  const re = /\d+|[^\.]/dg;
  let match;

  while ((match = re.exec(input)) !== null) {
    const literal = match[0];
    const column = match.indices![0][0];

    const token: Token = { line: state.line, column, value: literal };

    if (literal[0] >= "0" && literal[0] <= "9") {
      state.nums.push(token);
    } else {
      state.syms.push(token);
    }
  }

  state.line++;
}

function isPart(num: Token, syms: Token[]): boolean {
  // Assumes `syms` is already sorted
  for (const sym of syms) {
    if (sym.line < num.line - 1) {
      continue;
    }

    if (sym.line > num.line + 1) {
      break;
    }

    if (
      sym.line === num.line &&
      (sym.column === num.column - 1 ||
        sym.column === num.column + num.value.length)
    ) {
      return true;
    }

    if (
      sym.line !== num.line &&
      sym.column >= num.column - 1 &&
      sym.column <= num.column + num.value.length
    ) {
      return true;
    }
  }

  return false;
}

function gearRatio(sym: Token, nums: Token[]): number | null {
  if (sym.value !== "*") {
    return null;
  }

  const parts: Token[] = [];

  // Assumes `nums` is already sorted
  for (const num of nums) {
    if (parts.length > 2) {
      return null;
    }

    if (isPart(num, [sym])) {
      parts.push(num);
    }
  }

  if (parts.length !== 2) {
    return null;
  }

  return Number(parts[0].value) * Number(parts[1].value);
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

const state: State = { line: 1, syms: [], nums: [] };
rl.on("line", (line) => {
  parseLine(state, line);
});

rl.on("close", () => {
  let partNumberTotal = 0;
  for (const num of state.nums) {
    if (isPart(num, state.syms)) {
      partNumberTotal += Number(num.value);
    }
  }

  let gearRatioTotal = 0;
  for (const sym of state.syms) {
    gearRatioTotal += gearRatio(sym, state.nums) ?? 0;
  }

  console.log(`Part 1 total: ${partNumberTotal}`);
  console.log(`Part 2 total: ${gearRatioTotal}`);
});
