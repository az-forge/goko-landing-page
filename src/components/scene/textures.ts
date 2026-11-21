import * as THREE from "three";
import { STATUS_LABEL, type Session, type Sim } from "./sessions";

const CREAM = "244, 241, 233";
const ACCENT = "#F47735";
const SANS = "ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function canvasTexture(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return { ctx: canvas.getContext("2d")!, texture };
}

export function screenTexture() {
  return canvasTexture(408, 276);
}

const WIDTHS = [0.82, 0.46, 0.68, 0.9, 0.35, 0.74, 0.58, 0.8, 0.42, 0.63];

export function drawScreen(
  ctx: CanvasRenderingContext2D,
  session: Session,
  sim: Sim,
  time: number,
) {
  const w = 408;
  const h = 276;
  const s = sim.status;
  ctx.fillStyle = "#131513";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle =
    s === "working" || s === "dispatch"
      ? ACCENT
      : `rgba(${CREAM}, ${s === "waiting" ? 1 : 0.3})`;
  ctx.fillRect(24, 28, 16, 16);
  ctx.textBaseline = "middle";
  ctx.font = `600 27px ${SANS}`;
  ctx.fillStyle = `rgba(${CREAM}, 0.95)`;
  ctx.fillText(session.agent, 52, 37);
  ctx.font = `500 19px ${MONO}`;
  ctx.fillStyle = `rgba(${CREAM}, 0.5)`;
  ctx.textAlign = "right";
  ctx.fillText(STATUS_LABEL[s], w - 24, 37);
  ctx.textAlign = "left";
  ctx.fillStyle = `rgba(${CREAM}, 0.1)`;
  ctx.fillRect(24, 66, w - 48, 2);

  const top = 92;
  const row = 30;
  if (s === "working") {
    const scroll = Math.floor(time * 3.2 + session.id);
    for (let i = 0; i < 6; i++) {
      const k = (scroll + i) % WIDTHS.length;
      const fresh = i === 5;
      ctx.fillStyle =
        k % 4 === 1 ? "rgba(244, 119, 53, 0.85)" : `rgba(${CREAM}, ${fresh ? 0.6 : 0.24})`;
      ctx.fillRect(24, top + i * row, (w - 48) * WIDTHS[k], 11);
    }
  } else if (s === "waiting") {
    ctx.fillStyle = `rgba(${CREAM}, 0.24)`;
    ctx.fillRect(24, top, (w - 48) * 0.7, 11);
    ctx.fillRect(24, top + row, (w - 48) * 0.5, 11);
    ctx.fillStyle = `rgba(${CREAM}, 0.95)`;
    ctx.fillRect(24, top + 74, w - 48, 74);
    ctx.fillStyle = "#131513";
    ctx.font = `600 25px ${SANS}`;
    ctx.fillText("Allow this edit?", 42, top + 112);
    if (Math.floor(time * 2) % 2 === 0) ctx.fillRect(w - 62, top + 98, 14, 28);
  } else if (s === "done") {
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = `rgba(${CREAM}, 0.14)`;
      ctx.fillRect(24, top + i * row, (w - 48) * WIDTHS[(i + session.id) % WIDTHS.length], 11);
    }
    ctx.font = `500 22px ${MONO}`;
    ctx.fillStyle = `rgba(${CREAM}, 0.6)`;
    ctx.fillText("finished, ready to review", 24, top + 122);
  } else {
    ctx.font = `500 24px ${MONO}`;
    ctx.fillStyle = `rgba(${CREAM}, 0.45)`;
    ctx.fillText("$", 24, top + 10);
    if (s === "dispatch" || Math.floor(time * 2) % 2 === 0) {
      ctx.fillStyle = s === "dispatch" ? ACCENT : `rgba(${CREAM}, 0.6)`;
      ctx.fillRect(48, top - 4, 13, 27);
    }
  }
}

export function labelTexture(name: string, branch: string) {
  const { ctx, texture } = canvasTexture(640, 96);
  ctx.textBaseline = "middle";
  ctx.font = `600 44px ${SANS}`;
  ctx.fillStyle = `rgba(${CREAM}, 0.95)`;
  ctx.fillText(name, 8, 50);
  const x = ctx.measureText(name).width + 30;
  ctx.font = `500 30px ${MONO}`;
  ctx.fillStyle = `rgba(${CREAM}, 0.45)`;
  ctx.fillText(branch, x, 52);
  return texture;
}

export function glowTexture() {
  const { ctx, texture } = canvasTexture(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return texture;
}
