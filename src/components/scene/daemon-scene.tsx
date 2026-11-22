"use client";

import { Line, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { Session, Sim } from "./sessions";
import { drawScreen, glowTexture, screenTexture } from "./textures";
import { AGENTS, WINDOW_PX, drawWindow, loadLogos } from "./window-texture";

const ACCENT = new THREE.Color("#F47735");
const FLAT = -Math.PI / 2;
const BASE = { w: 9.4, h: 0.36, d: 5.2 };
const PANEL = { w: 7.6, h: 4.3, z: -2.1 };
const TURN = 0.42;
const BLOCK = { w: 1.42, h: 0.4, d: 1.02, z: 1.05 };
const TASKS = ["Make search case-insensitive", "Fix flaky daemon test", "Write benchmarks", "Update changelog", "Review pull requests"];

const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);
// 1 while the app window is open, 0 while it is closed.
const openAt = (p: number) => 1 - smooth(0.27, 0.36, p) + smooth(0.64, 0.73, p);

function Rig() {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const { camera } = get();
    camera.position.set(10, 9, 10);
    camera.lookAt(0, 1.75, 0);
    camera.zoom = Math.min(size.width / 11.6, size.height / 8.6);
    camera.updateProjectionMatrix();
  }, [get, size]);
  return null;
}

function Panel({ progress, glow }: { progress: MotionValue<number>; glow: THREE.Texture }) {
  const hinge = useRef<THREE.Group>(null!);
  const frame = useRef<THREE.MeshStandardMaterial>(null!);
  const screen = useRef<THREE.MeshBasicMaterial>(null!);
  const ghost = useRef<THREE.Group>(null!);
  const spill = useRef<THREE.MeshBasicMaterial>(null!);
  const canvas = useRef<{ ctx: CanvasRenderingContext2D; texture: THREE.CanvasTexture; logos: HTMLImageElement[]; fonts: { sans: string; mono: string } } | null>(null);
  const drawn = useRef("");

  useEffect(() => {
    const el = document.createElement("canvas");
    el.width = WINDOW_PX.w;
    el.height = WINDOW_PX.h;
    const texture = new THREE.CanvasTexture(el);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    const css = getComputedStyle(document.documentElement);
    const fonts = {
      sans: `${css.getPropertyValue("--font-geist-sans") || "system-ui"}, system-ui, sans-serif`,
      mono: `${css.getPropertyValue("--font-geist-mono") || "ui-monospace"}, ui-monospace, monospace`,
    };
    const logos = loadLogos(() => {
      drawn.current = "";
    });
    const material = screen.current;
    canvas.current = { ctx: el.getContext("2d")!, texture, logos, fonts };
    material.map = texture;
    material.color.set("#ffffff");
    material.needsUpdate = true;
    return () => {
      canvas.current = null;
      texture.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    const p = progress.get();
    const open = openAt(p);
    hinge.current.rotation.x = -(1 - open) * 1.25;
    hinge.current.position.y = BASE.h - (1 - open) * 0.4;
    hinge.current.visible = open > 0.01;
    frame.current.opacity = open;
    screen.current.opacity = open;
    ghost.current.visible = open < 0.99;
    spill.current.opacity = open * 0.16;
    ghost.current.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) m.opacity = (1 - open) * 0.5;
    });

    const c = canvas.current;
    if (!c) return;
    const late = p > 0.78;
    const cursor = Math.floor(clock.elapsedTime * 2) % 2 === 0;
    const key = `${late}${cursor}`;
    if (key === drawn.current) return;
    drawn.current = key;
    drawWindow(c.ctx, c.logos, c.fonts, late, cursor);
    c.texture.needsUpdate = true;
  });

  const outline = useMemo(() => {
    const x = PANEL.w / 2 + 0.15;
    const top = PANEL.h + 0.3;
    return [
      [-x, 0, 0],
      [-x, top, 0],
      [x, top, 0],
      [x, 0, 0],
      [-x, 0, 0],
    ] as [number, number, number][];
  }, []);

  return (
    <>
      <group ref={ghost} position={[0, BASE.h, PANEL.z]} visible={false}>
        <Line points={outline} color="#F4F1E9" lineWidth={1.2} dashed dashSize={0.18} gapSize={0.14} transparent opacity={0} />
      </group>
      <mesh rotation-x={FLAT} position={[0, BASE.h + 0.02, PANEL.z + 1.15]}>
        <planeGeometry args={[PANEL.w * 1.05, 2.6]} />
        <meshBasicMaterial ref={spill} map={glow} color="#F4F1E9" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={hinge} position={[0, BASE.h, PANEL.z]}>
        <RoundedBox args={[PANEL.w + 0.3, PANEL.h + 0.3, 0.16]} radius={0.07} smoothness={4} position={[0, PANEL.h / 2 + 0.15, 0]} castShadow>
          <meshStandardMaterial ref={frame} color="#3b3e3b" roughness={0.7} transparent />
        </RoundedBox>
        <mesh position={[0, PANEL.h / 2 + 0.15, 0.085]}>
          <planeGeometry args={[PANEL.w, PANEL.h]} />
          <meshBasicMaterial ref={screen} color="#161816" toneMapped={false} transparent />
        </mesh>
      </group>
    </>
  );
}

function Block({ index, x, progress, glow }: { index: number; x: number; progress: MotionValue<number>; glow: THREE.Texture }) {
  const session = useMemo<Session>(
    () => ({ id: index * 3 + 1, agent: AGENTS[index].name, project: "strata", task: TASKS[index], x, z: BLOCK.z, initial: "working" }),
    [index, x],
  );
  const sim = useMemo<Sim>(() => ({ status: "working", t: 0, dur: 1, answered: false, delay: 0 }), []);
  const screen = useRef<ReturnType<typeof screenTexture> | null>(null);
  const top = useRef<THREE.MeshBasicMaterial>(null!);
  const halo = useRef<THREE.MeshBasicMaterial>(null!);
  const cable = useRef<THREE.Group>(null!);
  const pulse = useRef<THREE.Mesh>(null!);
  const at = useRef(-1);

  useEffect(() => {
    const created = screenTexture();
    const material = top.current;
    screen.current = created;
    material.map = created.texture;
    material.color.set("#ffffff");
    material.needsUpdate = true;
    return () => {
      screen.current = null;
      created.texture.dispose();
    };
  }, []);

  const from = BLOCK.z - BLOCK.d / 2;
  const to = PANEL.z + 0.1;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = progress.get();
    const open = openAt(p);
    const beat = 0.5 + 0.5 * Math.sin(t * 3.4 + index * 1.3);
    // Sessions glow a little harder while the window is closed: they are the ones still working.
    halo.current.opacity = 0.28 + 0.24 * beat + (1 - open) * 0.3;

    cable.current.scale.z = Math.max(open, 0.001);
    cable.current.visible = open > 0.02;
    const flowing = open > 0.95;
    pulse.current.visible = flowing;
    if (flowing) {
      const speed = p > 0.73 ? 0.9 : 0.45;
      const k = (t * speed + index * 0.21) % 1;
      pulse.current.position.z = THREE.MathUtils.lerp(from, to, k);
    }

    const s = screen.current;
    if (s && t - at.current > 0.14) {
      at.current = t;
      drawScreen(s.ctx, session, sim, t);
      s.texture.needsUpdate = true;
    }
  });

  return (
    <group position={[x, BASE.h, 0]}>
      <mesh rotation-x={FLAT} position={[0, 0.012, BLOCK.z]}>
        <planeGeometry args={[BLOCK.w * 1.9, BLOCK.d * 2.3]} />
        <meshBasicMaterial ref={halo} map={glow} color={ACCENT} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, BLOCK.h * 0.2, BLOCK.z]}>
        <boxGeometry args={[BLOCK.w + 0.07, BLOCK.h * 0.4, BLOCK.d + 0.07]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <RoundedBox args={[BLOCK.w, BLOCK.h, BLOCK.d]} radius={0.04} smoothness={3} position={[0, BLOCK.h / 2 + 0.06, BLOCK.z]} castShadow>
        <meshStandardMaterial color="#2b2e2b" roughness={0.7} />
      </RoundedBox>
      <mesh rotation-x={FLAT} position={[0, BLOCK.h + 0.065, BLOCK.z]}>
        <planeGeometry args={[BLOCK.w - 0.12, BLOCK.d - 0.12]} />
        <meshBasicMaterial ref={top} color="#131513" toneMapped={false} />
      </mesh>
      <group ref={cable} position={[0, 0.03, from]}>
        <mesh position={[0, 0, (to - from) / 2]}>
          <boxGeometry args={[0.05, 0.03, Math.abs(to - from)]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.7} />
        </mesh>
      </group>
      <mesh ref={pulse} position={[0, 0.09, from]} visible={false}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshBasicMaterial color="#ffd9c2" toneMapped={false} />
      </mesh>
    </group>
  );
}

const BLOCK_X = AGENTS.map((_, i) => (i - 2) * 1.72);
// Where each DOM label sits in the scene: one per agent, then "gokod", then "window closed".
const ANCHORS = [
  ...BLOCK_X.map((x) => new THREE.Vector3(x, BASE.h + BLOCK.h + 0.62, BLOCK.z)),
  new THREE.Vector3(0, BASE.h / 2, BASE.d / 2 + 0.05),
  new THREE.Vector3(0, BASE.h + PANEL.h / 2, PANEL.z),
];

type Labels = RefObject<(HTMLElement | null)[]>;

function World({ progress, labels }: { progress: MotionValue<number>; labels: Labels }) {
  const world = useRef<THREE.Group>(null!);
  const point = useMemo(() => new THREE.Vector3(), []);
  const glow = useMemo(() => glowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);

  useFrame(({ pointer, camera, size }, dt) => {
    const to = TURN + THREE.MathUtils.lerp(-0.08, 0.08, progress.get()) + pointer.x * 0.05;
    world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, to, 4, dt);
    world.current.updateMatrixWorld();

    ANCHORS.forEach((anchor, i) => {
      const el = labels.current[i];
      if (!el) return;
      point.copy(anchor).applyMatrix4(world.current.matrixWorld).project(camera);
      const x = (point.x * 0.5 + 0.5) * size.width;
      const y = (-point.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      el.style.opacity = i === ANCHORS.length - 1 ? String(1 - openAt(progress.get())) : "1";
    });
  });

  return (
    <group ref={world} rotation-y={TURN}>
      <mesh rotation-x={FLAT} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.45} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[BASE.w + 0.08, 0.06, BASE.d + 0.08]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <RoundedBox args={[BASE.w, BASE.h, BASE.d]} radius={0.09} smoothness={4} position={[0, BASE.h / 2 + 0.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#232623" roughness={0.9} />
      </RoundedBox>
      <Panel progress={progress} glow={glow} />
      {AGENTS.map((agent, i) => (
        <Block key={agent.name} index={i} x={BLOCK_X[i]} progress={progress} glow={glow} />
      ))}
    </group>
  );
}

const label = "absolute left-0 top-0 whitespace-nowrap opacity-0 will-change-transform";

export default function DaemonScene({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  const labels = useRef<(HTMLElement | null)[]>([]);

  return (
    <div className="relative h-full w-full">
      <Canvas
        orthographic
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [10, 9, 10], zoom: 60, near: -60, far: 120 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Rig />
        <ambientLight intensity={0.9} />
        <hemisphereLight args={["#fff4e4", "#1a1c1a", 0.7]} />
        <directionalLight
          position={[-5, 12, 5]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-11}
          shadow-camera-right={11}
          shadow-camera-top={11}
          shadow-camera-bottom={-11}
          shadow-bias={-0.0004}
        />
        <World progress={progress} labels={labels} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {AGENTS.map((agent, i) => (
          <p
            key={agent.name}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className={`${label} flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-2.5 py-1 text-xs font-medium text-fg`}
          >
            <Image src={agent.logo} alt="" width={14} height={14} unoptimized />
            {agent.name}
          </p>
        ))}
        <p
          ref={(el) => {
            labels.current[AGENTS.length] = el;
          }}
          className={`${label} rounded-full border border-accent/50 bg-surface/90 px-3 py-1 font-mono text-xs text-accent`}>
          gokod
        </p>
        <p
          ref={(el) => {
            labels.current[AGENTS.length + 1] = el;
          }}
          className={`${label} font-mono text-sm text-muted`}>
          window closed
        </p>
      </div>
    </div>
  );
}
