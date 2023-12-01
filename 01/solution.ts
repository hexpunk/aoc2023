import readline from "readline";

enum TokenType {
  Literal,
  Word,
}

interface Token {
  type: TokenType;
  value: number;
}

const WORD_NUMBER_PAIRS = [
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
] as const;

function parse(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;

  while (current < input.length) {
    let token = consumeDigit(input, current) ?? consumeWord(input, current);

    if (token !== null) {
      tokens.push(token);
    }

    current++;
  }

  return tokens;
}

function consumeDigit(input: string, current: number): Token | null {
  const char = input.charAt(current);

  if (char >= "0" && char <= "9") {
    return { type: TokenType.Literal, value: Number(char) };
  }

  return null;
}

function consumeWord(input: string, current: number): Token | null {
  for (const [word, value] of WORD_NUMBER_PAIRS) {
    if (input.substring(current, current + word.length) === word) {
      return { type: TokenType.Word, value };
    }
  }

  return null;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

let onlyDigitsTotal = 0;
let total = 0;

rl.on("line", (line) => {
  const tokens = parse(line);

  const firstDigit =
    tokens.find((token) => token.type === TokenType.Literal)?.value ?? 0;
  const lastDigit =
    tokens.findLast((token) => token.type === TokenType.Literal)?.value ?? 0;
  onlyDigitsTotal += firstDigit * 10;
  onlyDigitsTotal += lastDigit;

  total += (tokens[0].value ?? 0) * 10;
  total += tokens[tokens.length - 1].value ?? 0;
});

rl.on("close", () => {
  console.log(`Part 1 total: ${onlyDigitsTotal}`);
  console.log(`Part 2 total: ${total}`);
});
