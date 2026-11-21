export type Status = "idle" | "dispatch" | "working" | "waiting" | "done";

export type Session = {
  id: number;
  agent: string;
  project: string;
  task: string;
  x: number;
  z: number;
  initial: Status;
};

export type Sim = {
  status: Status;
  t: number;
  dur: number;
  answered: boolean;
  delay: number;
};

export type Counts = { working: number; waiting: number; done: number };

export const HUB = { x: 2.6, z: 2.6 };
export const TILE = { w: 1.7, h: 0.14, d: 1.15 };
export const PLATFORM = { w: 4, h: 0.2, d: 3.4 };

const SLOTS = [
  [-0.95, -0.88],
  [0.95, -0.88],
  [-0.95, 0.48],
  [0.95, 0.48],
];

// Sample data for the hero demo, not real sessions.
export const PROJECTS = [
  {
    name: "goko",
    branch: "main",
    x: -3.2,
    z: 2.2,
    sessions: [
      ["Claude Code", "Refactor sidebar rows", "working"],
      ["Codex", "Fix flaky daemon test", "idle"],
      ["Shell", "cargo test --workspace", "done"],
    ],
  },
  {
    name: "strata",
    branch: "feat/search",
    x: -2.2,
    z: -2.2,
    sessions: [
      ["Claude Code", "Add fuzzy file search", "waiting"],
      ["OpenCode", "Write search benchmarks", "working"],
      ["Devin", "Update the changelog", "idle"],
    ],
  },
  {
    name: "landing",
    branch: "main",
    x: 2.2,
    z: -3.2,
    sessions: [
      ["Codex", "Build the pricing table", "working"],
      ["Antigravity", "Review open pull requests", "done"],
    ],
  },
] as const;

export const SESSIONS: Session[] = PROJECTS.flatMap((p, pi) =>
  p.sessions.map(([agent, task, initial], si) => ({
    id: pi * 10 + si,
    agent,
    project: p.name,
    task,
    x: p.x + SLOTS[si][0],
    z: p.z + SLOTS[si][1],
    initial: initial as Status,
  })),
);

export const STATUS_LABEL: Record<Status, string> = {
  idle: "Idle",
  dispatch: "Starting",
  working: "Working",
  waiting: "Needs you",
  done: "Done",
};

export function createSims(): Sim[] {
  return SESSIONS.map((s, i) => ({
    status: s.initial,
    t: 0,
    dur: 3 + ((i * 2.7) % 6),
    answered: false,
    delay: 0.25 + i * 0.09,
  }));
}

function enter(sim: Sim, status: Status, dur: number) {
  sim.status = status;
  sim.t = 0;
  sim.dur = dur;
}

export function answer(sim: Sim) {
  if (sim.status !== "waiting") return;
  sim.answered = true;
  enter(sim, "dispatch", 0.9);
}

export function advance(sims: Sim[], dt: number) {
  const waiting = sims.filter((s) => s.status === "waiting").length;
  for (const sim of sims) {
    sim.t += dt;
    if (sim.t < sim.dur) continue;
    switch (sim.status) {
      case "idle":
        enter(sim, "dispatch", 0.9);
        break;
      case "dispatch":
        enter(sim, "working", 5 + Math.random() * 6);
        break;
      case "working":
        if (!sim.answered && waiting < 2 && Math.random() < 0.5)
          enter(sim, "waiting", 9 + Math.random() * 4);
        else {
          sim.answered = false;
          enter(sim, "done", 4 + Math.random() * 4);
        }
        break;
      case "waiting":
        answer(sim);
        break;
      case "done":
        enter(sim, "idle", 1.5 + Math.random() * 3);
        break;
    }
  }
}

export function count(sims: Sim[]): Counts {
  const c = { working: 0, waiting: 0, done: 0 };
  for (const s of sims) {
    if (s.status === "working" || s.status === "dispatch") c.working++;
    else if (s.status === "waiting") c.waiting++;
    else if (s.status === "done") c.done++;
  }
  return c;
}
