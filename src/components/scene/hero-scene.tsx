"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Counts } from "./sessions";

const WorkspaceScene = dynamic(() => import("./workspace-scene"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-surface/40" />,
});

const READOUT = [
  ["working", "working", "bg-accent"],
  ["waiting", "need you", "bg-fg"],
  ["done", "done", "bg-fg/30"],
] as const;

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(true);
  const [counts, setCounts] = useState<Counts>({ working: 0, waiting: 0, done: 0 });

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Interactive 3D scene: the Goko logo connected to three projects, each running several coding agent sessions that switch between working, waiting for you and done."
      className="relative h-full w-full"
    >
      <WorkspaceScene reduced={reduced} active={active} onCounts={setCounts} />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-end gap-x-5 gap-y-2 font-mono text-xs text-muted sm:inset-x-8 sm:bottom-8">
        <span className="mr-auto hidden sm:block">Simulated sessions. Click one that needs you.</span>
        {READOUT.map(([key, label, swatch]) => (
          <span key={key} className="flex items-center gap-2">
            <span className={`size-2 ${swatch}`} />
            <span className="tabular-nums text-fg">{counts[key]}</span> {label}
          </span>
        ))}
      </div>
    </div>
  );
}
