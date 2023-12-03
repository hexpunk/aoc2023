import readline from "readline";

interface Token {
  line: number;
  column: number;
}

interface Sym extends Token {}

interface Num extends Token {
  value: string;
}

interface State {
  line: number;
  nums: Num[];
  syms: Sym[];
}

// Modifies `state`
function parseLine(state: State, input: string) {
  const re = /\d+|[^\.]/dg;
  let match;

  while ((match = re.exec(input)) !== null) {
    const literal = match[0];
    const column = match.indices![0][0];

    const token: Token = { line: state.line, column };

    if (literal[0] >= "0" && literal[0] <= "9") {
      state.nums.push({ ...token, value: literal });
    } else {
      state.syms.push(token as Sym);
    }
  }

  state.line++;
}

function isPart(num: Num, syms: Sym[]): boolean {
  // Assumes `state.syms` is already sorted
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

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

const state: State = { line: 1, syms: [], nums: [] };
rl.on("line", (line) => {
  parseLine(state, line);
});

rl.on("close", () => {
  let total = 0;
  for (const num of state.nums) {
    if (isPart(num, state.syms)) {
      total += Number(num.value);
    }
  }

  console.log(`Part 1 total: ${total}`);
});
