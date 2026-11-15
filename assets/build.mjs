// Generates the theme-adaptive banner SVGs (dark + light) from one layout.
// Run: node assets/build.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 340;

const dark = {
  mode: "dark",
  bg: "#0B0E17",
  panel: "#101422",
  border: "rgba(255,255,255,0.10)",
  grid: "rgba(255,255,255,0.055)",
  name: "#F2F5FF",
  kicker: "#93AEFF",
  desc: "#C6CEE3",
  mono: "#7F8AA6",
  dim: "#5A6478",
  blue: "#4C7DFF",
  violet: "#A06BFF",
  glowBlue: "0.22",
  glowViolet: "0.20",
  edge: "rgba(147,174,255,0.45)",
  node: "#C9D6FF",
  caret: "#93AEFF",
};

const light = {
  mode: "light",
  bg: "#FBFCFE",
  panel: "#F4F6FC",
  border: "rgba(10,20,60,0.10)",
  grid: "rgba(20,40,110,0.07)",
  name: "#101528",
  kicker: "#3B5BD9",
  desc: "#38415A",
  mono: "#5D6784",
  dim: "#8791A8",
  blue: "#3B6BF0",
  violet: "#8A4BF0",
  glowBlue: "0.13",
  glowViolet: "0.12",
  edge: "rgba(59,107,240,0.40)",
  node: "#2B3C74",
  caret: "#3B5BD9",
};

// agent hub: one centre node dispatching to six tools
const HUB = [992, 172];
const RING = 112;
const SATS = ["MCP", "SKILLS", "CLI", "GIT", "TUI", "API"].map((label, i) => {
  const a = (-90 + i * 60) * (Math.PI / 180);
  return {
    label,
    x: Math.round(HUB[0] + RING * Math.cos(a)),
    y: Math.round(HUB[1] + RING * Math.sin(a)),
  };
});

const TYPED = 'zenty --now "agent tooling"';
const TYPED_W = 332;
const TYPED_X = 64;
const TYPED_Y = 288;

function banner(p) {
  const spokes = SATS.map(
    (s) => `<path class="edge" d="M${HUB[0]} ${HUB[1]} L${s.x} ${s.y}" />`,
  ).join("\n    ");

  const nodeMarks = SATS.map(
    (s, i) =>
      `<circle class="halo${i === 1 ? " pulse" : ""}" cx="${s.x}" cy="${s.y}" r="13" />` +
      `<circle class="dot" cx="${s.x}" cy="${s.y}" r="4" />` +
      `<text class="tag" x="${s.x}" y="${s.y + 25}" text-anchor="middle">${s.label}</text>`,
  ).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Zenty — Java 后端工程师，构建 AI Agent 工具链">
  <title>Zenty — Java 后端工程师，构建 AI Agent 工具链</title>
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.blue}"/>
      <stop offset="1" stop-color="${p.violet}"/>
    </linearGradient>
    <radialGradient id="glowBlue" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${p.blue}" stop-opacity="${p.glowBlue}"/>
      <stop offset="1" stop-color="${p.blue}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${p.violet}" stop-opacity="${p.glowViolet}"/>
      <stop offset="1" stop-color="${p.violet}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${p.grid}"/>
    </pattern>
    <mask id="reveal">
      <rect class="reveal" x="${TYPED_X}" y="${TYPED_Y - 22}" width="${TYPED_W + 20}" height="40" fill="#fff"/>
    </mask>
  </defs>

  <style>
    .wordmark { font: 800 47px/1 "Segoe UI", Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif; letter-spacing: 11px; }
    .kicker { font: 600 11.5px/1 "Segoe UI", Inter, system-ui, -apple-system, sans-serif; letter-spacing: 4.6px; }
    .desc { font: 400 19px/1.55 "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif; }
    .mono { font: 400 15px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
    .edge { fill: none; stroke: ${p.edge}; stroke-width: 1.2; stroke-dasharray: 3 7; animation: flow 7s linear infinite; }
    .halo { fill: none; stroke: ${p.edge}; stroke-width: 1; opacity: 0.5; }
    .dot { fill: ${p.node}; opacity: 0.9; }
    .pulse { animation: pulse 5s ease-in-out infinite; }
    .ring { fill: none; stroke: ${p.edge}; stroke-width: 1; stroke-opacity: ${p.mode === "dark" ? 0.28 : 0.24}; }
    .ring.faint { stroke-dasharray: 2 10; stroke-opacity: ${p.mode === "dark" ? 0.16 : 0.14}; }
    .tag { font: 500 9px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 1.6px; fill: ${p.dim}; }
    .hub { fill: url(#accent); }
    .hubGlow { fill: url(#glowViolet); }
    .reveal { animation: reveal 2.1s steps(22, end) 0.35s both; }
    .caret { animation: blink 1.1s steps(1, end) 2.5s infinite; }
    @keyframes flow { to { stroke-dashoffset: -100; } }
    @keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
    @keyframes reveal { from { transform: translateX(-${TYPED_W + 30}px); } to { transform: translateX(0); } }
    @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  </style>

  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  <ellipse cx="150" cy="360" rx="520" ry="300" fill="url(#glowBlue)"/>
  <ellipse cx="1090" cy="30" rx="470" ry="290" fill="url(#glowViolet)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="${p.border}"/>

  <g>
    <rect x="64" y="54" width="60" height="60" rx="17" fill="url(#accent)" opacity="0.14"/>
    <rect x="64" y="54" width="60" height="60" rx="17" fill="none" stroke="url(#accent)" stroke-opacity="0.65"/>
    <text x="94" y="95" text-anchor="middle" font-family="Segoe UI, Inter, system-ui, sans-serif" font-size="30" font-weight="700" fill="url(#accent)">Z</text>
  </g>

  <text class="wordmark" x="146" y="100" fill="${p.name}">ZENTY</text>
  <text class="kicker" x="150" y="125" fill="${p.kicker}">BACKEND ENGINEER · AGENT TOOLING</text>

  <line x1="64" y1="162" x2="470" y2="162" stroke="url(#accent)" stroke-opacity="0.5"/>

  <text class="desc" x="64" y="202" fill="${p.desc}">Java / Spring 后端出身，写过 Python 爬虫，也在 JVM 与分布式里踩过坑。</text>
  <text class="desc" x="64" y="234" fill="${p.desc}">现在专注 AI Agent 工具链：Pi · Claude Code · Codex · MCP。</text>

  <text class="mono" x="64" y="${TYPED_Y}" fill="${p.mono}" textLength="${TYPED_W}" lengthAdjust="spacing" mask="url(#reveal)">${TYPED}</text>
  <rect class="caret" x="${TYPED_X + TYPED_W + 6}" y="${TYPED_Y - 13}" width="9" height="17" fill="${p.caret}"/>

  <text class="mono" x="64" y="318" fill="${p.dim}">github.com/Zenty-Me</text>

  <g>
    <circle class="ring" cx="${HUB[0]}" cy="${HUB[1]}" r="${RING}" />
    <circle class="ring faint" cx="${HUB[0]}" cy="${HUB[1]}" r="${RING + 26}" />
    ${spokes}
    ${nodeMarks}
    <circle class="hubGlow" cx="${HUB[0]}" cy="${HUB[1]}" r="34" />
    <circle class="hub" cx="${HUB[0]}" cy="${HUB[1]}" r="9" />
  </g>
</svg>
`;
}

mkdirSync(here, { recursive: true });
for (const p of [dark, light]) {
  const file = join(here, `banner-${p.mode}.svg`);
  writeFileSync(file, banner(p), "utf8");
  console.log("wrote", file);
}
