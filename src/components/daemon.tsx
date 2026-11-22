"use client";

import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const STEPS = [
  {
    title: "The app is only a window.",
    body: "A separate daemon, gokod, owns every terminal and every agent process. The app connects to it over a local socket.",
  },
  {
    title: "Close it. Nothing stops.",
    body: "Closing the window or quitting Goko ends only the connection. Your agents keep working in the background.",
  },
  {
    title: "Open it. Pick up where you left.",
    body: "The next launch attaches to the same sessions, with their output waiting for you.",
  },
];

// Illustrative sessions for the diagram, not live data.
const SESSIONS = [
  { name: "Claude Code", logo: "/agents/claude-code.svg", started: 754 },
  { name: "Codex", logo: "/agents/codex.svg", started: 312 },
  { name: "OpenCode", logo: "/agents/opencode.svg", started: 95 },
  { name: "Devin", logo: "/agents/devin.svg", started: 1403 },
  { name: "Antigravity", logo: "/agents/antigravity.svg", started: 41 },
];

const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const RANGES = [
  { at: [0, 0.26, 0.33], opacity: [1, 1, 0], y: [0, 0, -24] },
  { at: [0.33, 0.4, 0.6, 0.66], opacity: [0, 1, 1, 0], y: [24, 0, 0, -24] },
  { at: [0.66, 0.73, 1], opacity: [0, 1, 1], y: [24, 0, 0] },
];

function Step({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const range = RANGES[index];
  const opacity = useTransform(progress, range.at, range.opacity);
  const y = useTransform(progress, range.at, range.y);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <h3 className="text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl">{STEPS[index].title}</h3>
      <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-muted">{STEPS[index].body}</p>
    </motion.div>
  );
}

const LOG = ["Read src/search.rs", "Edit src/search.rs  +6 -1", "Run cargo test"];
const LATE_LOG = ["test search::tests::matches_in_order ... ok", "All tests pass. Ready for you to review."];

// A drawn stand-in for the app window, sized in em off the container width so it scales as one piece.
function WindowArt({ late }: { late: MotionValue<number> }) {
  return (
    <div className="@container">
      <div
        role="img"
        aria-label="Illustration of the Goko window: a project sidebar, five agent tabs and Claude Code working in a terminal"
        className="flex aspect-[16/9.6] flex-col bg-[#161816] text-[1.55cqw] leading-none text-fg"
      >
        <div className="flex h-[3.6em] shrink-0 items-center gap-[0.55em] border-b border-line bg-surface px-[1.2em]">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-[0.85em] rounded-full bg-fg/20" />
          ))}
          <span className="ml-[0.7em] font-semibold">goko</span>
          <span className="ml-auto rounded-[0.5em] border border-line px-[0.8em] py-[0.5em] font-mono text-[0.85em] text-muted">
            ~/projects/strata
          </span>
          <span className="mr-auto rounded-[0.5em] border border-accent/50 px-[0.8em] py-[0.5em] font-mono text-[0.85em] text-accent">
            feat/search
          </span>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="w-[24%] shrink-0 border-r border-line bg-surface p-[1em]">
            <p className="font-mono text-[0.72em] tracking-[0.08em] text-muted">PROJECTS</p>
            <p className="mt-[1.1em] font-medium">strata</p>
            <p className="mt-[0.45em] font-mono text-[0.8em] text-muted">feat/search</p>
            <ul className="mt-[0.9em] space-y-[0.25em]">
              {SESSIONS.map((s, i) => (
                <li
                  key={s.name}
                  className={`flex items-center gap-[0.7em] rounded-[0.5em] px-[0.7em] py-[0.6em] ${i === 0 ? "bg-accent/15 text-accent" : ""}`}
                >
                  <Image src={s.logo} alt="" width={16} height={16} unoptimized className="size-[1.15em]" />
                  <span className="truncate">{s.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-[1.4em] font-medium text-muted">goko</p>
            <p className="mt-[0.45em] font-mono text-[0.8em] text-muted">main</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 gap-[0.3em] border-b border-line px-[0.8em] py-[0.6em]">
              {SESSIONS.map((s, i) => (
                <span
                  key={s.name}
                  className={`flex items-center gap-[0.55em] rounded-[0.5em] px-[0.8em] py-[0.6em] ${i === 0 ? "bg-raised" : "text-muted"}`}
                >
                  <Image src={s.logo} alt="" width={16} height={16} unoptimized className="size-[1.05em]" />
                  {s.name}
                </span>
              ))}
            </div>
            <p className="flex shrink-0 items-center gap-[0.7em] border-b border-line px-[1.4em] py-[0.9em] text-muted">
              strata <span>/</span> <span className="font-medium text-fg">Claude Code</span>
              <span className="rounded-[0.4em] border border-accent/50 px-[0.6em] py-[0.35em] font-mono text-[0.8em] text-accent">
                running
              </span>
            </p>
            <div className="flex-1 space-y-[1em] p-[1.4em] font-mono text-[0.95em]">
              <p>
                <span className="text-accent">&gt;</span> make file search case-insensitive
              </p>
              {LOG.map((line) => (
                <p key={line} className="text-muted">
                  <span className="text-accent">●</span> {line}
                </p>
              ))}
              {LATE_LOG.map((line) => (
                <motion.p key={line} style={{ opacity: late }} className="text-fg">
                  <span className="text-accent">●</span> {line}
                </motion.p>
              ))}
              <p>
                <span className="text-accent">&gt;</span>{" "}
                <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-cell bg-fg" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sessions() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="mt-3 grid grid-cols-5 gap-2">
      {SESSIONS.map((s, i) => (
        <li key={s.name} className="rounded-xl border border-line bg-bg p-2 sm:p-3">
          <p className="flex items-center gap-2">
            <Image src={s.logo} alt="" width={18} height={18} unoptimized className="shrink-0" />
            <span className="hidden truncate text-sm font-medium md:block">{s.name}</span>
          </p>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-fg sm:text-xs">{clock(s.started + elapsed)}</p>
          <p className="mt-2 flex gap-1" aria-hidden>
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                style={{ animationDelay: `${i * 0.3 + bar * 0.4}s` }}
                className="h-1 flex-1 animate-cell rounded-full bg-accent"
              />
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
}

const CLOSE = [0.27, 0.36, 0.64, 0.73];

function FlatStage({ progress }: { progress: MotionValue<number> }) {
  const windowOpacity = useTransform(progress, CLOSE, [1, 0, 0, 1]);
  const windowScale = useTransform(progress, CLOSE, [1, 0.95, 0.95, 1]);
  const windowY = useTransform(progress, CLOSE, [0, -18, -18, 0]);
  const closedOpacity = useTransform(progress, CLOSE, [0, 1, 1, 0]);
  const linkScale = useTransform(progress, [0.25, 0.33, 0.66, 0.74], [1, 0, 0, 1]);
  const flowOpacity = useTransform(progress, [0.74, 0.8], [0, 1]);

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,calc((100dvh-24rem)*1.667))] lg:max-w-[min(100%,calc((100dvh-20rem)*1.667))]">
      <div className="pointer-events-none absolute -inset-x-10 -bottom-10 top-1/2 bg-[radial-gradient(50%_60%_at_50%_70%,rgb(244_119_53/0.16),transparent_70%)]" />

      <div className="relative">
        <motion.p
          style={{ opacity: closedOpacity }}
          className="absolute inset-0 grid place-items-center rounded-xl border border-dashed border-fg/20 font-mono text-sm text-muted"
        >
          window closed
        </motion.p>
        <motion.div
          style={{ opacity: windowOpacity, scale: windowScale, y: windowY }}
          className="relative overflow-hidden rounded-xl border border-line shadow-[0_30px_80px_rgb(6_8_6/0.7)]"
        >
          <WindowArt late={flowOpacity} />
        </motion.div>
      </div>

      <div className="grid h-8 grid-cols-5 gap-2 px-3 sm:h-10 sm:px-4" aria-hidden>
        {SESSIONS.map((s, i) => (
          <div key={s.name} className="relative mx-auto h-full w-px">
            <motion.span style={{ scaleY: linkScale }} className="absolute inset-0 origin-bottom bg-accent/60" />
            <motion.span style={{ opacity: flowOpacity }} className="absolute inset-x-0 bottom-0">
              <span
                style={{ animationDelay: `${i * 0.22}s` }}
                className="absolute -left-[3px] bottom-0 size-[7px] animate-flow rounded-full bg-accent"
              />
            </motion.span>
          </div>
        ))}
      </div>

      <div className="relative rounded-2xl border border-accent/40 bg-raised p-3 sm:p-4">
        <p className="flex items-baseline gap-3 font-mono text-xs">
          <span className="text-sm font-medium text-accent">gokod</span>
          <span className="text-muted">owns every terminal and agent process</span>
        </p>
        <Sessions />
      </div>
    </div>
  );
}

const DaemonScene = dynamic(() => import("./scene/daemon-scene"), { ssr: false });
const desktop = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(desktop);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function Daemon() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const threeD = useSyncExternalStore(subscribe, () => window.matchMedia(desktop).matches, () => false);
  const active = useInView(ref, { margin: "200px" });

  return (
    <section ref={ref} id="daemon" className="relative h-[320vh] border-t border-line">
      <h2 className="sr-only">How Goko keeps agents running in the background</h2>
      <div className="sticky top-0 mx-auto grid h-[100dvh] max-w-[1400px] grid-cols-1 content-center gap-8 overflow-hidden px-5 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-6">
        <div className="relative order-2 h-52 lg:order-1 lg:col-span-4 lg:h-72 lg:self-center">
          {STEPS.map((s, i) => (
            <Step key={s.title} progress={scrollYProgress} index={i} />
          ))}
        </div>
        {threeD ? (
          <div
            role="img"
            aria-label="3D scene: the Goko window stands on the gokod daemon, wired to five agent sessions. The window folds away while the sessions keep running, then returns with their output."
            className="relative order-1 h-[calc(100dvh-7rem)] lg:order-2 lg:col-span-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_62%,rgb(244_119_53/0.14),transparent_70%)]" />
            <DaemonScene progress={scrollYProgress} active={active} />
          </div>
        ) : (
          <div className="order-1 lg:order-2 lg:col-span-8">
            <FlatStage progress={scrollYProgress} />
          </div>
        )}
      </div>
    </section>
  );
}
