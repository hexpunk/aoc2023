import readline from "readline";

enum HandType {
  FiveOfAKind = 6,
  FourOfAKind = 5,
  FullHouse = 4,
  ThreeOfAKind = 3,
  TwoPair = 2,
  OnePair = 1,
  HighCard = 0,
}

type Cards = [string, string, string, string, string];

interface Hand {
  cards: Cards;
  bid: number;
  typePart1: HandType;
  typePart2: HandType;
}

const priorityPart1 = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

const priorityPart2 = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

function compareCards(priority: string[], a: string, b: string): number {
  const i = priority.indexOf(a);
  const j = priority.indexOf(b);

  if (i > j) {
    return -1;
  } else if (j > i) {
    return 1;
  } else {
    return 0;
  }
}

function cardsToTypePart1(cards: Cards): HandType {
  const [a, b, c, d, e] = cards.toSorted(
    compareCards.bind(null, priorityPart1)
  );

  if (a === b && b === c && c === d && d === e) {
    return HandType.FiveOfAKind;
  }

  if ((a === b && b === c && c === d) || (b === c && c === d && d === e)) {
    return HandType.FourOfAKind;
  }

  if ((a === b && b === c && d === e) || (a === b && c === d && d === e)) {
    return HandType.FullHouse;
  }

  if ((a === b && b === c) || (b === c && c === d) || (c === d && d === e)) {
    return HandType.ThreeOfAKind;
  }

  if ((a === b && c === d) || (b === c && d === e) || (a === b && d === e)) {
    return HandType.TwoPair;
  }

  if (a === b || b === c || c == d || d === e) {
    return HandType.OnePair;
  }

  return HandType.HighCard;
}

function cardsToTypePart2(cards: Cards): HandType {
  if (!cards.some((card) => card === "J")) {
    return cardsToTypePart1(cards);
  }

  return Math.max(
    ...priorityPart2.map((card) =>
      cardsToTypePart1(
        cards.map((original) => (original === "J" ? card : original)) as Cards
      )
    )
  );
}

function parseHand(input: string): Hand {
  const [rawCards, rawBid] = input.split(" ");
  const cards = rawCards.split("") as Cards;

  return {
    cards,
    bid: Number(rawBid),
    typePart1: cardsToTypePart1(cards),
    typePart2: cardsToTypePart2(cards),
  };
}

function compareHands(
  priority: string[],
  type: "typePart1" | "typePart2",
  a: Hand,
  b: Hand
): number {
  if (a[type] > b[type]) {
    return -1;
  }

  if (b[type] > a[type]) {
    return 1;
  }

  for (let i = 0; i < 5; i++) {
    const result = compareCards(priority, a.cards[i], b.cards[i]);

    if (result !== 0) {
      return result;
    }
  }

  return 0;
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

const hands: Hand[] = [];
rl.on("line", (line) => {
  hands.push(parseHand(line));
});

rl.on("close", () => {
  let compare = compareHands.bind(null, priorityPart1, "typePart1");
  hands.sort(compare);

  let winnings = 0;
  for (let i = 0; i < hands.length; i++) {
    winnings += hands[i].bid * (hands.length - i);
  }

  console.log(`Part 1 total winnings: ${winnings}`);

  compare = compareHands.bind(null, priorityPart2, "typePart2");
  hands.sort(compare);

  winnings = 0;
  for (let i = 0; i < hands.length; i++) {
    winnings += hands[i].bid * (hands.length - i);
  }

  console.log(`Part 2 total winnings: ${winnings}`);
});
