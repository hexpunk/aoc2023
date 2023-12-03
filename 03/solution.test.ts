import { expect, test, describe } from "bun:test";
import { parseLine, hasAdjacentSymbol } from "./shared";

test("parseLine", () => {
  let { symbols, parts } = parseLine(0, "");

  expect(symbols).toBeEmpty();
  expect(parts).toBeEmpty();

  ({ symbols, parts } = parseLine(0, "............."));

  expect(symbols).toBeEmpty();
  expect(parts).toBeEmpty();

  ({ symbols, parts } = parseLine(0, "..........123"));

  expect(symbols).toBeEmpty();
  expect(parts).toBeArrayOfSize(1);
  expect(parts).toEqual([{ line: 0, column: 10, partNumber: "123" }]);

  ({ symbols, parts } = parseLine(0, "123=456"));

  expect(symbols).toBeArrayOfSize(1);
  expect(symbols).toEqual([{ line: 0, column: 3 }]);

  expect(parts).toBeArrayOfSize(2);
  expect(parts).toEqual([
    { line: 0, column: 0, partNumber: "123" },
    { line: 0, column: 4, partNumber: "456" },
  ]);
});

describe("hasAdjacentSymbol", () => {
  const part = { line: 4, column: 3, partNumber: "123" };

  test("before", () => {
    expect(hasAdjacentSymbol(part, [{ line: 4, column: 2 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 4, column: 1 }])).toBeFalse();
  });

  test("after", () => {
    expect(hasAdjacentSymbol(part, [{ line: 4, column: 6 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 4, column: 7 }])).toBeFalse();
  });

  test("vertical", () => {
    expect(hasAdjacentSymbol(part, [{ line: 3, column: 3 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 3, column: 4 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 3, column: 5 }])).toBeTrue();

    expect(hasAdjacentSymbol(part, [{ line: 5, column: 3 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 5, column: 4 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 5, column: 5 }])).toBeTrue();

    expect(hasAdjacentSymbol(part, [{ line: 2, column: 3 }])).toBeFalse();
    expect(hasAdjacentSymbol(part, [{ line: 6, column: 3 }])).toBeFalse();
  });

  test("diagonal", () => {
    expect(hasAdjacentSymbol(part, [{ line: 3, column: 2 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 3, column: 6 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 5, column: 2 }])).toBeTrue();
    expect(hasAdjacentSymbol(part, [{ line: 5, column: 6 }])).toBeTrue();

    expect(hasAdjacentSymbol(part, [{ line: 3, column: 1 }])).toBeFalse();
    expect(hasAdjacentSymbol(part, [{ line: 3, column: 7 }])).toBeFalse();
    expect(hasAdjacentSymbol(part, [{ line: 5, column: 1 }])).toBeFalse();
    expect(hasAdjacentSymbol(part, [{ line: 5, column: 7 }])).toBeFalse();

    expect(
      hasAdjacentSymbol({ line: 1, column: 75, partNumber: "900" }, [
        { line: 2, column: 79 },
      ])
    ).toBeFalse();
  });
});
