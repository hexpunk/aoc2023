interface Token {
  line: number;
  column: number;
}

export interface Symbol extends Token {}

export interface Part extends Token {
  partNumber: string;
}

export function parseLine(
  lineNumber: number,
  input: string
): { symbols: Symbol[]; parts: Part[] } {
  const result = { symbols: [] as Symbol[], parts: [] as Part[] };
  let partialPart: Part | null = null;

  function promotePartialPart() {
    if (partialPart !== null) {
      result.parts.push(partialPart);
      partialPart = null;
    }
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char >= "0" && char <= "9") {
      if (partialPart === null) {
        partialPart = { line: lineNumber, column: i, partNumber: "" };
      }

      partialPart.partNumber += char;

      continue;
    }

    promotePartialPart();

    if (char === ".") {
      continue;
    }

    result.symbols.push({ line: lineNumber, column: i });
  }

  promotePartialPart();

  return result;
}

export function hasAdjacentSymbol(
  part: Part,
  sortedSymbols: Symbol[]
): boolean {
  for (const symbol of sortedSymbols) {
    if (symbol.line < part.line - 1) {
      continue;
    }

    if (symbol.line > part.line + 1) {
      return false;
    }

    if (part.line === symbol.line) {
      if (
        symbol.column === part.column - 1 ||
        symbol.column === part.column + part.partNumber.length
      ) {
        return true;
      }
    } else {
      if (
        symbol.column >= part.column - 1 &&
        symbol.column <= part.column + part.partNumber.length + 1
      ) {
        return true;
      }
    }
  }

  return false;
}
