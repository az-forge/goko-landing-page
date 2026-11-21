"use client";

import { Html, Line, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import {
  HUB,
  PLATFORM,
  PROJECTS,
  SESSIONS,
  STATUS_LABEL,
  TILE,
  advance,
  answer,
  count,
  createSims,
  type Counts,
  type Session,
  type Sim,
} from "./sessions";
import { drawScreen, glowTexture, labelTexture, screenTexture } from "./textures";

const ACCENT = new THREE.Color("#F47735");
const CREAM = new THREE.Color("#F4F1E9");
const DIM = new THREE.Color("#3a3c39");
const FLAT = -Math.PI / 2;

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M326 128H236C170 128 128 170 128 236V304C128 370 170 400 226 400H270C291 400 304 386 304 366C304 346 290 332 270 332H232C208 332 196 320 196 296V236C196 208 212 196 240 196H326C350 196 364 182 364 162C364 142 350 128 326 128Z"/><path d="M312 248H362C384 248 396 262 396 284V334C396 376 368 400 330 400H306C321 384 328 365 328 344V316H312C294 316 284 304 284 282C284 260 294 248 312 248Z"/></svg>`;

const ease = (x: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(x, 0, 1), 3);

function Rig({ reduced }: { reduced: boolean }) {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const { camera, invalidate } = get();
    camera.position.set(10, 9, 10);
    camera.lookAt(0, 0.9, -0.2);
    camera.zoom = Math.min(size.width / (size.width < 640 ? 11.4 : 13.4), size.height / 8.6);
    camera.updateProjectionMatrix();
    if (reduced) invalidate();
  }, [get, size, reduced]);
  return null;
}

function Logo({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const piece = useRef<THREE.Group>(null!);
  const geometries = useMemo(
    () =>
      new SVGLoader().parse(LOGO_SVG).paths.map((path) => {
        const g = new THREE.ExtrudeGeometry(path.toShapes(), {
          depth: 46,
          bevelEnabled: true,
          bevelThickness: 5,
          bevelSize: 3,
          bevelSegments: 3,
          curveSegments: 18,
        });
        g.translate(-262, -264, 0);
        return g;
      }),
    [],
  );
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const k = reduced ? 1 : ease((t - 0.5) / 1.3);
    piece.current.position.set((1 - k) * 1.5, (1 - k) * 0.9, (1 - k) * 1.5);
    group.current.position.y = reduced ? 0 : Math.sin(t * 1.1) * 0.04;
  });

  const s = 2.3 / 268;
  return (
    <group position={[HUB.x, 0, HUB.z]}>
      <RoundedBox args={[3.3, 0.22, 3.3]} radius={0.1} smoothness={4} position={[0, 0.11, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#262926" roughness={0.85} />
      </RoundedBox>
      <group ref={group}>
        <mesh geometry={geometries[0]} rotation-x={FLAT} scale={[s, -s, s]} position={[0, 0.26, 0]} castShadow>
          <meshStandardMaterial color="#F4F1E9" roughness={0.55} />
        </mesh>
        <group ref={piece}>
          <mesh geometry={geometries[1]} rotation-x={FLAT} scale={[s, -s, s]} position={[0, 0.26, 0]} castShadow>
            <meshStandardMaterial color="#F47735" roughness={0.45} emissive="#F47735" emissiveIntensity={0.25} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Platform({ project }: { project: (typeof PROJECTS)[number] }) {
  const label = useMemo(() => labelTexture(project.name, project.branch), [project]);
  useEffect(() => () => label.dispose(), [label]);
  return (
    <group position={[project.x, 0, project.z]}>
      <RoundedBox args={[PLATFORM.w, PLATFORM.h, PLATFORM.d]} radius={0.09} smoothness={4} position={[0, PLATFORM.h / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#232623" roughness={0.9} />
      </RoundedBox>
      <mesh rotation-x={FLAT} position={[-0.42, PLATFORM.h + 0.005, PLATFORM.d / 2 - 0.3]}>
        <planeGeometry args={[2.8, 0.42]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function path(session: Session) {
  return [
    new THREE.Vector3(HUB.x, 0.03, HUB.z),
    new THREE.Vector3(session.x, 0.03, HUB.z),
    new THREE.Vector3(session.x, 0.03, session.z),
  ];
}

function Trace({ session, sim, glow }: { session: Session; sim: Sim; glow: THREE.Texture }) {
  const points = useMemo(() => path(session), [session]);
  const pulse = useRef<THREE.Group>(null!);
  const a = points[0].distanceTo(points[1]);
  const b = points[1].distanceTo(points[2]);

  useFrame(() => {
    const on = sim.status === "dispatch";
    pulse.current.visible = on;
    if (!on) return;
    const d = ease(sim.t / sim.dur) * (a + b);
    if (d < a) pulse.current.position.lerpVectors(points[0], points[1], d / a);
    else pulse.current.position.lerpVectors(points[1], points[2], (d - a) / b);
    pulse.current.position.y = 0.3;
  });

  return (
    <>
      <Line points={points} color="#F4F1E9" lineWidth={1.2} transparent opacity={0.14} />
      <group ref={pulse} visible={false}>
        <mesh renderOrder={5}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} depthTest={false} />
        </mesh>
        <mesh rotation-x={FLAT} renderOrder={4}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshBasicMaterial map={glow} color={ACCENT} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthTest={false} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

function Tile({
  session,
  sim,
  glow,
  reduced,
  hovered,
  onHover,
}: {
  session: Session;
  sim: Sim;
  glow: THREE.Texture;
  reduced: boolean;
  hovered: boolean;
  onHover: (id: number | null) => void;
}) {
  const group = useRef<THREE.Group>(null!);
  const rim = useRef<THREE.MeshBasicMaterial>(null!);
  const halo = useRef<THREE.MeshBasicMaterial>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!);
  const screen = useRef<ReturnType<typeof screenTexture> | null>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null!);
  const drawn = useRef({ at: -1, status: "" });
  useEffect(() => {
    const created = screenTexture();
    const material = screenMat.current;
    screen.current = created;
    material.map = created.texture;
    material.color.set("#ffffff");
    material.needsUpdate = true;
    return () => {
      screen.current = null;
      created.texture.dispose();
    };
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const s = sim.status;
    const k = reduced ? 1 : 1 - Math.exp(-7 * dt);
    const appear = reduced ? 1 : ease((t - sim.delay) / 0.8);

    const lift = s === "waiting" ? 0.62 + Math.sin(t * 2.4) * 0.05 : s === "working" ? 0.14 : 0.06;
    const g = group.current;
    g.position.y = THREE.MathUtils.lerp(g.position.y, PLATFORM.h + lift + (1 - appear) * 2.2 + (hovered ? 0.08 : 0), k);
    g.scale.setScalar(Math.max(appear, 0.001));

    const color = s === "working" || s === "dispatch" ? ACCENT : s === "waiting" ? CREAM : DIM;
    rim.current.color.lerp(color, k);
    const beat = s === "working" && !reduced ? 0.5 + 0.5 * Math.sin(t * 4 + session.id) : 1;
    const glowTo = s === "working" ? 0.3 + 0.25 * beat : s === "waiting" ? 0.4 : s === "dispatch" ? 0.2 : 0;
    halo.current.color.copy(rim.current.color);
    halo.current.opacity = THREE.MathUtils.lerp(halo.current.opacity, glowTo, k);

    const ping = s === "waiting" && !reduced ? (t * 0.7) % 1 : 0;
    ring.current.visible = s === "waiting";
    ring.current.scale.setScalar(1 + ping * 0.9);
    ringMat.current.opacity = reduced ? 0.5 : (1 - ping) * 0.7;

    const live = s === "working" || s === "waiting" || s === "idle";
    const sc = screen.current;
    if (sc && (drawn.current.status !== s || (live && !reduced && t - drawn.current.at > 0.14))) {
      drawn.current = { at: t, status: s };
      drawScreen(sc.ctx, session, sim, t);
      sc.texture.needsUpdate = true;
    }
  });

  return (
    <group position={[session.x, 0, session.z]}>
      <mesh rotation-x={FLAT} position={[0, PLATFORM.h + 0.012, 0]}>
        <planeGeometry args={[TILE.w * 1.9, TILE.d * 2.3]} />
        <meshBasicMaterial ref={halo} map={glow} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group
        ref={group}
        position={[0, 3, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(session.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          answer(sim);
        }}
      >
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[TILE.w + 0.07, TILE.h * 0.5, TILE.d + 0.07]} />
          <meshBasicMaterial ref={rim} color={DIM} toneMapped={false} />
        </mesh>
        <RoundedBox args={[TILE.w, TILE.h, TILE.d]} radius={0.04} smoothness={3} position={[0, TILE.h / 2, 0]} castShadow>
          <meshStandardMaterial color="#2b2e2b" roughness={0.7} />
        </RoundedBox>
        <mesh rotation-x={FLAT} position={[0, TILE.h + 0.004, 0]}>
          <planeGeometry args={[TILE.w - 0.12, TILE.d - 0.12]} />
          <meshBasicMaterial ref={screenMat} color="#131513" toneMapped={false} />
        </mesh>
        <group scale={[TILE.w / 1.414, 1, TILE.d / 1.414]} position={[0, -0.02, 0]}>
          <mesh ref={ring} rotation-x={FLAT} visible={false}>
            <ringGeometry args={[1.03, 1.07, 4, 1, Math.PI / 4]} />
            <meshBasicMaterial ref={ringMat} color={CREAM} transparent toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {hovered && (
          <Html position={[0, 0.5, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
            <div className="-translate-y-12 whitespace-nowrap rounded-xl border border-line bg-surface/95 px-3 py-2 text-left shadow-[0_12px_32px_rgb(8_10_8/0.6)]">
              <p className="text-[13px] font-medium text-fg">
                {session.agent} <span className="text-muted">in {session.project}</span>
              </p>
              <p className="font-mono text-[11px] text-muted">
                {sim.status === "waiting" ? "Click to answer" : `${STATUS_LABEL[sim.status]}: ${session.task}`}
              </p>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function World({ reduced, onCounts }: { reduced: boolean; onCounts: (c: Counts) => void }) {
  const world = useRef<THREE.Group>(null!);
  const sims = useMemo(() => createSims(), []);
  const glow = useMemo(() => glowTexture(), []);
  const last = useRef("");
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => () => glow.dispose(), [glow]);
  useEffect(() => {
    document.body.style.cursor = hovered === null ? "" : "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame(({ clock, pointer }, dt) => {
    if (!reduced) {
      advance(sims, Math.min(dt, 0.1));
      const to = pointer.x * 0.07 + Math.sin(clock.elapsedTime * 0.2) * 0.025;
      world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, to, 3, dt);
    }
    const c = count(sims);
    const key = `${c.working}/${c.waiting}/${c.done}`;
    if (key !== last.current) {
      last.current = key;
      onCounts(c);
    }
  });

  return (
    <group ref={world}>
      <mesh rotation-x={FLAT} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.45} />
      </mesh>
      <Logo reduced={reduced} />
      {PROJECTS.map((p) => (
        <Platform key={p.name} project={p} />
      ))}
      {SESSIONS.map((s, i) => (
        <group key={s.id}>
          <Trace session={s} sim={sims[i]} glow={glow} />
          <Tile session={s} sim={sims[i]} glow={glow} reduced={reduced} hovered={hovered === s.id} onHover={setHovered} />
        </group>
      ))}
    </group>
  );
}

export default function WorkspaceScene({
  reduced,
  active,
  onCounts,
}: {
  reduced: boolean;
  active: boolean;
  onCounts: (c: Counts) => void;
}) {
  return (
    <Canvas
      orthographic
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      camera={{ position: [10, 9, 10], zoom: 60, near: -60, far: 120 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Rig reduced={reduced} />
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
      <World reduced={reduced} onCounts={onCounts} />
    </Canvas>
  );
}
