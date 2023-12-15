import readline from "readline";

interface Lens {
  label: string;
  focal: number;
}

function hash(input: string): number {
  let currentValue = 0;

  for (let i = 0; i < input.length; i++) {
    currentValue += input.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }

  return currentValue;
}

let input = "";

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  input += line;
});

rl.on("close", () => {
  const instructions = input.split(",");
  const hashSum = instructions.reduce((total, str) => total + hash(str), 0);

  console.log(`Part 1 hash sum: ${hashSum}`);

  const boxes: Lens[][] = [];
  for (let i = 0; i < 256; i++) {
    boxes.push([]);
  }

  for (const instruction of instructions) {
    const [label, focal] = instruction.split(/\=|\-/);
    const boxId = hash(label);

    if (focal === "") {
      boxes[boxId] = boxes[boxId].filter((lens) => lens.label !== label);
    } else {
      const index = boxes[boxId].findIndex((lens) => lens.label === label);

      if (index === -1) {
        boxes[boxId].push({ label, focal: Number(focal) });
      } else {
        boxes[boxId][index].focal = Number(focal);
      }
    }
  }

  const power = boxes.reduce(
    (total, box, boxNumber) =>
      total +
      box.reduce(
        (boxTotal, lens, slotNumber) =>
          boxTotal + (1 + boxNumber) * (1 + slotNumber) * lens.focal,
        0
      ),
    0
  );

  console.log(`Part 2 focus power: ${power}`);
});
