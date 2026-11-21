"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig, useReducedMotion } from "motion/react";
import { useEffect } from "react";

function SmoothScroll() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, allowNestedScroll: true });
    return () => lenis.destroy();
  }, [reduced]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      {children}
    </MotionConfig>
  );
}
