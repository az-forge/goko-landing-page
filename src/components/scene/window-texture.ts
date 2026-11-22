const CREAM = "244, 241, 233";
const ACCENT = "#F47735";

export const WINDOW_PX = { w: 1620, h: 920 };

export const AGENTS = [
  { name: "Claude Code", logo: "/agents/claude-code.svg" },
  { name: "Codex", logo: "/agents/codex.svg" },
  { name: "OpenCode", logo: "/agents/opencode.svg" },
  { name: "Devin", logo: "/agents/devin.svg" },
  { name: "Antigravity", logo: "/agents/antigravity.svg" },
];

const LOG = ["Read src/search.rs", "Edit src/search.rs  +6 -1", "Run cargo test"];
const LATE_LOG = ["test search::tests::matches_in_order ... ok", "All tests pass. Ready for you to review."];

export function loadLogos(onLoad: () => void) {
  return AGENTS.map(({ logo }) => {
    const img = new Image();
    img.onload = onLoad;
    img.src = logo;
    return img;
  });
}

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, stroke: string) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.stroke();
}

// Illustrative app window for the daemon scene, drawn to a canvas so it can sit on a 3D panel.
export function drawWindow(
  ctx: CanvasRenderingContext2D,
  logos: HTMLImageElement[],
  fonts: { sans: string; mono: string },
  late: boolean,
  cursor: boolean,
) {
  const { w, h } = WINDOW_PX;
  const sans = (px: number, weight = 500) => `${weight} ${px}px ${fonts.sans}`;
  const mono = (px: number) => `500 ${px}px ${fonts.mono}`;
  const line = `rgba(${CREAM}, 0.14)`;
  const muted = `rgba(${CREAM}, 0.62)`;
  const fg = `rgba(${CREAM}, 0.96)`;
  const side = 400;
  const bar = 76;

  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#1d201d";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#252825";
  ctx.fillRect(0, 0, w, bar);
  ctx.fillRect(0, bar, side, h - bar);
  ctx.fillStyle = line;
  ctx.fillRect(0, bar, w, 2);
  ctx.fillRect(side, bar, 2, h - bar);

  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(${CREAM}, 0.2)`;
    ctx.beginPath();
    ctx.arc(38 + i * 30, bar / 2, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = fg;
  ctx.font = sans(28, 600);
  ctx.fillText("goko", 130, bar / 2 + 1);
  ctx.font = mono(22);
  ctx.fillStyle = muted;
  ctx.fillText("~/projects/strata", 660, bar / 2 + 1);
  pill(ctx, 640, 18, 270, 40, line);
  ctx.fillStyle = ACCENT;
  ctx.fillText("feat/search", 944, bar / 2 + 1);
  pill(ctx, 924, 18, 190, 40, "rgba(244, 119, 53, 0.5)");

  ctx.font = mono(19);
  ctx.fillStyle = muted;
  ctx.fillText("PROJECTS", 30, bar + 44);
  ctx.font = sans(27);
  ctx.fillStyle = fg;
  ctx.fillText("strata", 30, bar + 96);
  ctx.font = mono(21);
  ctx.fillStyle = muted;
  ctx.fillText("feat/search", 30, bar + 130);
  AGENTS.forEach((agent, i) => {
    const y = bar + 168 + i * 62;
    if (i === 0) {
      ctx.fillStyle = "rgba(244, 119, 53, 0.16)";
      ctx.beginPath();
      ctx.roundRect(20, y, side - 40, 54, 12);
      ctx.fill();
    }
    if (logos[i]?.complete && logos[i].naturalWidth) ctx.drawImage(logos[i], 38, y + 12, 30, 30);
    ctx.font = sans(26);
    ctx.fillStyle = i === 0 ? ACCENT : fg;
    ctx.fillText(agent.name, 84, y + 28);
  });
  ctx.font = sans(27);
  ctx.fillStyle = muted;
  ctx.fillText("goko", 30, bar + 520);
  ctx.font = mono(21);
  ctx.fillText("main", 30, bar + 554);

  let x = side + 24;
  AGENTS.forEach((agent, i) => {
    ctx.font = sans(25);
    const width = ctx.measureText(agent.name).width + 78;
    if (i === 0) {
      ctx.fillStyle = "#313431";
      ctx.beginPath();
      ctx.roundRect(x, bar + 14, width, 52, 12);
      ctx.fill();
    }
    if (logos[i]?.complete && logos[i].naturalWidth) ctx.drawImage(logos[i], x + 16, bar + 27, 26, 26);
    ctx.fillStyle = i === 0 ? fg : muted;
    ctx.fillText(agent.name, x + 54, bar + 41);
    x += width + 8;
  });
  ctx.fillStyle = line;
  ctx.fillRect(side, bar + 80, w - side, 2);

  ctx.font = sans(25);
  ctx.fillStyle = muted;
  ctx.fillText("strata  /", side + 34, bar + 122);
  ctx.fillStyle = fg;
  ctx.fillText("Claude Code", side + 144, bar + 122);
  ctx.font = mono(20);
  ctx.fillStyle = ACCENT;
  ctx.fillText("running", side + 320, bar + 123);
  pill(ctx, side + 306, bar + 104, 116, 38, "rgba(244, 119, 53, 0.5)");
  ctx.fillStyle = line;
  ctx.fillRect(side, bar + 162, w - side, 2);

  const left = side + 36;
  let y = bar + 214;
  const row = (text: string, color: string, bullet = true) => {
    ctx.font = mono(25);
    ctx.fillStyle = ACCENT;
    ctx.fillText(bullet ? "●" : ">", left, y);
    ctx.fillStyle = color;
    ctx.fillText(text, left + 34, y);
    y += 52;
  };
  row("make file search case-insensitive", fg, false);
  LOG.forEach((text) => row(text, muted));
  if (late) LATE_LOG.forEach((text) => row(text, fg));
  ctx.fillStyle = ACCENT;
  ctx.fillText(">", left, y);
  if (cursor) {
    ctx.fillStyle = fg;
    ctx.fillRect(left + 34, y - 15, 15, 30);
  }
}
