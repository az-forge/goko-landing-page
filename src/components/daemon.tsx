"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

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

const PROCESSES = ["claude", "codex", "opencode", "zsh", "cargo test"];

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

export function Daemon() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const appZ = useTransform(scrollYProgress, [0.3, 0.46, 0.68, 0.84], [250, 520, 520, 250]);
  const appOpacity = useTransform(scrollYProgress, [0.3, 0.46, 0.68, 0.84], [1, 0, 0, 1]);

  return (
    <section ref={ref} id="daemon" className="relative h-[320vh] border-t border-line">
      <h2 className="sr-only">How Goko keeps agents running in the background</h2>
      <div className="sticky top-0 mx-auto grid h-[100dvh] max-w-[1400px] grid-cols-1 content-center gap-6 overflow-hidden px-5 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="relative order-2 h-56 lg:order-1 lg:col-span-5 lg:h-72 lg:self-center">
          {STEPS.map((s, i) => (
            <Step key={s.title} progress={scrollYProgress} index={i} />
          ))}
        </div>
        <div className="order-1 grid h-[46dvh] place-items-center [perspective:1600px] lg:order-2 lg:col-span-7 lg:h-[80dvh]">
          <div className="relative aspect-[16/10] w-[min(78vw,600px)] [transform-style:preserve-3d] [transform:rotateX(56deg)_rotateZ(-38deg)_translateZ(-130px)]">
            <div className="absolute inset-0 rounded-2xl border border-line bg-surface p-5">
              <p className="font-mono text-xs text-muted">agent processes</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {PROCESSES.map((p, i) => (
                  <span
                    key={p}
                    style={{ animationDelay: `${i * 0.35}s` }}
                    className="animate-cell rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl border border-accent/50 bg-raised/85 p-5 [transform:translateZ(125px)]">
              <p className="font-mono text-sm font-medium text-accent">gokod</p>
              <p className="mt-1 font-mono text-xs text-muted">owns every PTY</p>
              <div className="mt-5 grid grid-cols-5 gap-2">
                {PROCESSES.map((p, i) => (
                  <span
                    key={p}
                    style={{ animationDelay: `${i * 0.35}s` }}
                    className="h-10 animate-cell rounded-lg bg-accent/80 sm:h-14"
                  />
                ))}
              </div>
            </div>
            <motion.div
              style={{ z: appZ, opacity: appOpacity }}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_40px_80px_rgb(8_10_8/0.7)]"
            >
              <Image
                src="/shots/agents.png"
                alt="The Goko app window"
                width={1426}
                height={813}
                sizes="600px"
                className="h-full w-full object-cover object-left-top"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
