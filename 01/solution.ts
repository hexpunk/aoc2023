import readline from "readline";

enum TokenType {
  Literal,
  Word,
}

interface Token {
  type: TokenType;
  value: number;
}

function parse(input: string): Token[] {
  const tokens: Token[] = [];

  return tokens;
}

function isDigit(str: string): boolean {
  return str >= "0" && str <= "9";
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {});

rl.on("close", () => {});

// --------------------------------

const input = await Bun.stdin.text();
let total = 0;

for (const line of input.split("\n")) {
  let number = 0;

  for (let i = 0; i < line.length; i++) {
    const value = Number(line[i]);
    if (!isNaN(value)) {
      number = value * 10;
      break;
    }
  }

  for (let i = line.length - 1; i >= 0; i--) {
    const value = Number(line[i]);
    if (!isNaN(value)) {
      number += value;
      break;
    }
  }

  total += number;
}

console.log(`The total is ${total}.`);
