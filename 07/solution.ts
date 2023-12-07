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
  type: HandType;

  // For debugging purposes:
  line: number;
}

function compareCards(a: string, b: string): number {
  const lowestToHighest = [
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

  const i = lowestToHighest.indexOf(a);
  const j = lowestToHighest.indexOf(b);

  if (i > j) {
    return -1;
  } else if (j > i) {
    return 1;
  } else {
    return 0;
  }
}

function cardsToType(cards: Cards): HandType {
  const [a, b, c, d, e] = cards.toSorted(compareCards);

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

function parseHand(line: number, input: string): Hand {
  const [rawCards, rawBid] = input.split(" ");
  const cards = rawCards.split("") as Cards;

  return {
    cards,
    bid: Number(rawBid),
    type: cardsToType(cards),
    line,
  };
}

function compareHands(a: Hand, b: Hand): number {
  if (a.type > b.type) {
    return -1;
  }

  if (b.type > a.type) {
    return 1;
  }

  for (let i = 0; i < 5; i++) {
    const result = compareCards(a.cards[i], b.cards[i]);

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
let lineNumber = 1;
rl.on("line", (line) => {
  hands.push(parseHand(lineNumber, line));
  lineNumber++;
});

rl.on("close", () => {
  hands.sort(compareHands);

  let winnings = 0;
  for (let i = 0; i < hands.length; i++) {
    winnings += hands[i].bid * (hands.length - i);
  }

  console.log(`Part 1 total winnings: ${winnings}`);
});
