"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const FEATURES: Feature[] = [
  {
    title: "Every agent in one window",
    body: "Claude Code, Codex, OpenCode, Devin and Antigravity each get a tab, listed under their project with live status.",
    shot: "/shots/agents.png",
    alt: "Goko running Claude Code in a terminal tab next to tabs for Devin, OpenCode, Antigravity and Codex, with all five sessions listed under the goko project in the sidebar",
    w: 1426,
    h: 813,
  },
  {
    title: "Start one in a click",
    body: "Pick an agent, a shell or any custom command for the project you are in. Split the tab to run two side by side.",
    shot: "/shots/picker.png",
    alt: "Goko new session menu listing Shell, Claude Code, Codex, OpenCode, Devin, Antigravity and a custom command option",
  },
  {
    title: "Review what the agent changed",
    body: "Unified or split diffs with staging per file. Write the commit message yourself or let an agent draft it.",
    shot: "/shots/changes.png",
    alt: "Goko changes view showing a unified diff of a Rust file next to the list of changed files and the commit box",
  },
  {
    title: "An editor when you need one",
    body: "Browse files, search text and make a quick fix without leaving the window.",
    shot: "/shots/files.png",
    alt: "Goko editor with the project file tree on the left and a Rust source file open",
  },
  {
    title: "Jump between projects",
    body: "Project Map finds any workspace, project or path from the keyboard.",
    shot: "/shots/map.png",
    alt: "Goko Project Map dialog listing a workspace and its two projects",
  },
];

type Feature = { title: string; body: string; shot: string; alt: string; w?: number; h?: number };

function Shot({ shot, alt, w = 2560, h = 1560, priority = false }: Feature & { priority?: boolean }) {
  return (
    <Image
      src={shot}
      alt={alt}
      width={w}
      height={h}
      sizes="(min-width: 1024px) 900px, 100vw"
      loading={priority ? "eager" : "lazy"}
      className="h-auto w-full"
    />
  );
}

export function Features() {
  const [active, setActive] = useState(0);

  return (
    <section id="features" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-36">
      <div className="reveal">
        <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl">
          The whole loop, from prompt to push.
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
          Start an agent, watch it work, read the diff and commit. Goko keeps every step for every project in one place.
        </p>
      </div>

      <div className="mt-14 hidden grid-cols-12 items-start gap-10 lg:grid">
        <div role="tablist" aria-label="Goko features" aria-orientation="vertical" className="col-span-4 flex flex-col">
          {FEATURES.map((f, i) => (
            <button
              key={f.title}
              role="tab"
              id={`feature-tab-${i}`}
              aria-selected={active === i}
              aria-controls="feature-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="relative py-5 pl-6 text-left"
            >
              {active === i && (
                <motion.span
                  layoutId="feature-marker"
                  className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className={`block text-2xl font-semibold tracking-tight transition-colors ${active === i ? "text-fg" : "text-muted"}`}>
                {f.title}
              </span>
              <span
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                  active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <span className="overflow-hidden">
                  <span className="block max-w-[38ch] pt-2 leading-relaxed text-muted">{f.body}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
        <div
          id="feature-panel"
          role="tabpanel"
          aria-labelledby={`feature-tab-${active}`}
          className="relative col-span-8"
        >
          <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgb(244_119_53/0.16),transparent_70%)]" />
          <div className="relative grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.shot}
                aria-hidden={active !== i}
                className={`col-start-1 row-start-1 self-start overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_100px_rgb(6_8_6/0.7)] transition-[opacity,transform] duration-500 ease-out ${
                  active === i ? "opacity-100" : "pointer-events-none scale-[1.015] opacity-0"
                }`}
              >
                <Shot {...f} priority={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:hidden">
        {FEATURES.map((f) => (
          <article key={f.title} className="reveal">
            <h3 className="text-2xl font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 max-w-[44ch] leading-relaxed text-muted">{f.body}</p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-line bg-surface">
              <div className="w-[180%] sm:w-full">
                <Shot {...f} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
