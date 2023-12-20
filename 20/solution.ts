import readline from "readline";

enum Pulse {
  Low,
  High,
}

enum ModuleType {
  FlipFlop,
  Conjunction,
  Broadcast,
}

interface Module {
  type: ModuleType;
  destinations: string[];
}

interface FlipFlop extends Module {
  type: ModuleType.FlipFlop;
  state: Pulse;
}

interface Conjunction extends Module {
  type: ModuleType.Conjunction;
  states: Map<string, Pulse>;
}

interface Broadcast extends Module {
  type: ModuleType.Broadcast;
}

function isFlipFlop(module: Module): module is FlipFlop {
  return module.type === ModuleType.FlipFlop;
}

function isConjunction(module: Module): module is Conjunction {
  return module.type === ModuleType.Conjunction;
}

function isBroadcast(module: Module): module is Broadcast {
  return module.type === ModuleType.Broadcast;
}

function press(modules: Map<string, Module>): { high: number; low: number } {
  let high = 0;
  let low = 0;

  const queue: { from: string; to: string; pulse: Pulse }[] = [];

  function send(from: string, to: string, pulse: Pulse) {
    if (modules.has(to)) {
      queue.push({ from, to, pulse });
    }

    if (pulse === Pulse.High) {
      high++;
    } else {
      low++;
    }
  }

  send("button", "broadcaster", Pulse.Low);

  while (queue.length > 0) {
    const message = queue.shift()!;
    const module = modules.get(message.to)!;

    if (isBroadcast(module)) {
      for (const dest of module.destinations) {
        send(message.to, dest, message.pulse);
      }
    } else if (isFlipFlop(module) && message.pulse === Pulse.Low) {
      module.state = module.state === Pulse.Low ? Pulse.High : Pulse.Low;
      for (const dest of module.destinations) {
        send(message.to, dest, module.state);
      }
    } else if (isConjunction(module)) {
      module.states.set(message.from, message.pulse);
      const sentPulse = Array.from(module.states.values()).every(
        (state) => state === Pulse.High
      )
        ? Pulse.Low
        : Pulse.High;

      for (const dest of module.destinations) {
        send(message.to, dest, sentPulse);
      }
    }
  }

  return { high, low };
}

const modules = new Map<string, Module>();

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

rl.on("line", (line) => {
  const [name, destinations] = line.split(" -> ");
  const destNames = destinations.split(", ");

  switch (name[0]) {
    case "%":
      modules.set(name.slice(1), {
        type: ModuleType.FlipFlop,
        destinations: destNames,
        state: Pulse.Low,
      } as FlipFlop);
      break;

    case "&":
      modules.set(name.slice(1), {
        type: ModuleType.Conjunction,
        destinations: destNames,
        states: new Map(),
      } as Conjunction);
      break;

    default:
      modules.set(name, {
        type: ModuleType.Broadcast,
        destinations: destNames,
      });
  }
});

rl.on("close", () => {
  for (const [name, module] of modules.entries()) {
    for (const destName of module.destinations) {
      const dest = modules.get(destName);

      if (dest && isConjunction(dest)) {
        dest.states.set(name, Pulse.Low);
      }
    }
  }

  let low = 0;
  let high = 0;

  for (let i = 0; i < 1_000; i++) {
    const result = press(modules);
    low += result.low;
    high += result.high;
  }

  console.log(`Part 1 result: ${low * high}`);
});
