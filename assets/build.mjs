// Generates the theme-adaptive banner SVGs (dark + light) from one layout.
// Type sizes are tuned for GitHub's ~760px profile column (≈0.63× of this 1200px canvas).
// Run: node assets/build.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 356;

const dark = {
  mode: "dark",
  bg: "#0B0E17",
  border: "rgba(255,255,255,0.10)",
  grid: "rgba(255,255,255,0.055)",
  name: "#F2F5FF",
  kicker: "#93AEFF",
  desc: "#C6CEE3",
  mono: "#8691AC",
  dim: "#5A6478",
  blue: "#4C7DFF",
  violet: "#A06BFF",
  glowBlue: "0.22",
  glowViolet: "0.20",
  edge: "rgba(147,174,255,0.45)",
  node: "#C9D6FF",
  ringOpacity: 0.3,
  ringFaint: 0.17,
  caret: "#93AEFF",
};

const light = {
  mode: "light",
  bg: "#FBFCFE",
  border: "rgba(10,20,60,0.10)",
  grid: "rgba(20,40,110,0.07)",
  name: "#101528",
  kicker: "#3B5BD9",
  desc: "#38415A",
  mono: "#5D6784",
  dim: "#7C869C",
  blue: "#3B6BF0",
  violet: "#8A4BF0",
  glowBlue: "0.14",
  glowViolet: "0.12",
  edge: "rgba(59,107,240,0.42)",
  node: "#2B3C74",
  ringOpacity: 0.26,
  ringFaint: 0.15,
  caret: "#3B5BD9",
};

// agent hub: one centre node dispatching to six tools
const HUB = [988, 178];
const RING = 118;
const SATS = ["MCP", "SKILLS", "CLI", "GIT", "TUI", "API"].map((label, i) => {
  const a = (-90 + i * 60) * (Math.PI / 180);
  return {
    label,
    x: Math.round(HUB[0] + RING * Math.cos(a)),
    y: Math.round(HUB[1] + RING * Math.sin(a)),
  };
});

const TYPED = 'zenty --now "agent tooling"';
const TYPED_W = 318;
const TYPED_X = 64;
const TYPED_Y = 300;

function banner(p) {
  const spokes = SATS.map(
    (s) => `<path class="edge" d="M${HUB[0]} ${HUB[1]} L${s.x} ${s.y}"/>`,
  ).join("\n    ");

  const marks = SATS.map(
    (s, i) =>
      `<circle class="halo${i === 1 ? " pulse" : ""}" cx="${s.x}" cy="${s.y}" r="15"/>` +
      `<circle class="dot" cx="${s.x}" cy="${s.y}" r="4.5"/>` +
      `<text class="tag" x="${s.x}" y="${s.y + 30}" text-anchor="middle">${s.label}</text>`,
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
      <rect class="reveal" x="${TYPED_X}" y="${TYPED_Y - 30}" width="${TYPED_W + 24}" height="52" fill="#fff"/>
    </mask>
  </defs>

  <style>
    .wordmark { font: 800 54px/1 "Segoe UI", Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif; letter-spacing: 12px; }
    .kicker { font: 600 15px/1 "Segoe UI", Inter, system-ui, -apple-system, sans-serif; letter-spacing: 5px; }
    .desc { font: 400 21px/1.5 "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif; }
    .mono { font: 400 20px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
    .tag { font: 500 12px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 2px; fill: ${p.dim}; }
    .edge { fill: none; stroke: ${p.edge}; stroke-width: 1.4; stroke-dasharray: 3 8; animation: flow 7s linear infinite; }
    .halo { fill: none; stroke: ${p.edge}; stroke-width: 1.2; opacity: 0.55; }
    .dot { fill: ${p.node}; opacity: 0.92; }
    .ring { fill: none; stroke: ${p.edge}; stroke-width: 1.1; stroke-opacity: ${p.ringOpacity}; }
    .ring.faint { stroke-dasharray: 2 12; stroke-opacity: ${p.ringFaint}; }
    .hub { fill: url(#accent); }
    .hubGlow { fill: url(#glowViolet); }
    .pulse { animation: pulse 5s ease-in-out infinite; }
    .reveal { animation: reveal 2.1s steps(22, end) 0.4s both; }
    .caret { animation: blink 1.1s steps(1, end) 2.6s infinite; }
    @keyframes flow { to { stroke-dashoffset: -110; } }
    @keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
    @keyframes reveal { from { transform: translateX(-${TYPED_W + 30}px); } to { transform: translateX(0); } }
    @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  </style>

  <rect width="${W}" height="${H}" fill="${p.bg}"/>
  <ellipse cx="150" cy="380" rx="540" ry="320" fill="url(#glowBlue)"/>
  <ellipse cx="1090" cy="30" rx="480" ry="300" fill="url(#glowViolet)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="${p.border}"/>

  <rect x="64" y="56" width="68" height="68" rx="19" fill="url(#accent)" opacity="0.14"/>
  <rect x="64" y="56" width="68" height="68" rx="19" fill="none" stroke="url(#accent)" stroke-opacity="0.7"/>
  <text x="98" y="104" text-anchor="middle" font-family="Segoe UI, Inter, system-ui, sans-serif" font-size="34" font-weight="700" fill="url(#accent)">Z</text>

  <text class="wordmark" x="154" y="106" fill="${p.name}">ZENTY</text>
  <text class="kicker" x="157" y="134" fill="${p.kicker}">BACKEND ENGINEER · AGENT TOOLING</text>

  <line x1="64" y1="176" x2="500" y2="176" stroke="url(#accent)" stroke-opacity="0.55"/>

  <text class="desc" x="64" y="218" fill="${p.desc}">Java / Spring 后端出身，写过 Python 爬虫，也在 JVM 踩过坑。</text>
  <text class="desc" x="64" y="252" fill="${p.desc}">现在专注 AI Agent 工具链：Pi / Claude Code / Codex。</text>

  <text class="mono" x="${TYPED_X}" y="${TYPED_Y}" fill="${p.mono}" textLength="${TYPED_W}" lengthAdjust="spacing" mask="url(#reveal)">${TYPED}</text>
  <rect class="caret" x="${TYPED_X + TYPED_W + 8}" y="${TYPED_Y - 17}" width="11" height="22" fill="${p.caret}"/>

  <text class="mono" x="64" y="332" fill="${p.dim}" font-size="15">github.com/Zenty-Me</text>

  <g>
    <circle class="ring faint" cx="${HUB[0]}" cy="${HUB[1]}" r="${RING + 30}"/>
    <circle class="ring" cx="${HUB[0]}" cy="${HUB[1]}" r="${RING}"/>
    ${spokes}
    ${marks}
    <circle class="hubGlow" cx="${HUB[0]}" cy="${HUB[1]}" r="40"/>
    <circle class="hub" cx="${HUB[0]}" cy="${HUB[1]}" r="10"/>
  </g>
</svg>
`;
}


// Compact banner for narrow viewports (GitHub mobile ≈ 360–420px wide).
const MW = 640;
const MH = 220;
const MHUB = [556, 92];

function bannerMobile(p) {
  const spokes = SATS.map(
    (_, i) => {
      const a = (-90 + i * 60) * (Math.PI / 180);
      const x = Math.round(MHUB[0] + 48 * Math.cos(a));
      const y = Math.round(MHUB[1] + 48 * Math.sin(a));
      return `<path class="edge" d="M${MHUB[0]} ${MHUB[1]} L${x} ${y}"/><circle class="dot" cx="${x}" cy="${y}" r="3.4"/>`;
    },
  ).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MW} ${MH}" width="${MW}" height="${MH}" role="img" aria-label="Zenty — Java 后端工程师，构建 AI Agent 工具链">
  <title>Zenty — Java 后端工程师，构建 AI Agent 工具链</title>
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.blue}"/><stop offset="1" stop-color="${p.violet}"/>
    </linearGradient>
    <radialGradient id="glowBlue" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${p.blue}" stop-opacity="${p.glowBlue}"/>
      <stop offset="1" stop-color="${p.blue}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${p.violet}" stop-opacity="${p.glowViolet}"/>
      <stop offset="1" stop-color="${p.violet}" stop-opacity="0"/>
    </radialGradient>
    <mask id="reveal">
      <rect class="reveal" x="24" y="${158 - 28}" width="292" height="48" fill="#fff"/>
    </mask>
  </defs>
  <style>
    .wordmark { font: 800 40px/1 "Segoe UI", Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif; letter-spacing: 8px; }
    .desc { font: 400 22px/1.4 "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif; }
    .mono { font: 400 17px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .edge { fill: none; stroke: ${p.edge}; stroke-width: 1.2; stroke-dasharray: 3 7; animation: flow 7s linear infinite; }
    .dot { fill: ${p.node}; opacity: 0.92; }
    .hub { fill: url(#accent); }
    .hubGlow { fill: url(#glowViolet); }
    .reveal { animation: reveal 2.1s steps(22, end) 0.4s both; }
    .caret { animation: blink 1.1s steps(1, end) 2.6s infinite; }
    @keyframes flow { to { stroke-dashoffset: -100; } }
    @keyframes reveal { from { transform: translateX(-330px); } to { transform: translateX(0); } }
    @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  </style>

  <rect width="${MW}" height="${MH}" fill="${p.bg}"/>
  <ellipse cx="80" cy="220" rx="300" ry="180" fill="url(#glowBlue)"/>
  <ellipse cx="600" cy="10" rx="260" ry="160" fill="url(#glowViolet)"/>
  <rect x="0.5" y="0.5" width="${MW - 1}" height="${MH - 1}" rx="16" fill="none" stroke="${p.border}"/>

  <rect x="24" y="22" width="50" height="50" rx="15" fill="url(#accent)" opacity="0.14"/>
  <rect x="24" y="22" width="50" height="50" rx="15" fill="none" stroke="url(#accent)" stroke-opacity="0.7"/>
  <text x="49" y="54" text-anchor="middle" font-family="Segoe UI, Inter, system-ui, sans-serif" font-size="24" font-weight="700" fill="url(#accent)">Z</text>

  <text class="wordmark" x="90" y="60" fill="${p.name}">ZENTY</text>
  <text class="desc" x="24" y="112" fill="${p.desc}">Java / Spring 后端 · AI Agent 工具链</text>
  <text class="mono" x="24" y="158" fill="${p.mono}" textLength="272" lengthAdjust="spacing" mask="url(#reveal)">${TYPED}</text>
  <rect class="caret" x="304" y="${158 - 14}" width="10" height="19" fill="${p.caret}"/>

  <g>
    <circle class="hubGlow" cx="${MHUB[0]}" cy="${MHUB[1]}" r="30"/>
    ${spokes}
    <circle class="hub" cx="${MHUB[0]}" cy="${MHUB[1]}" r="6.5"/>
  </g>
</svg>
`;
}

mkdirSync(here, { recursive: true });
for (const p of [dark, light]) {
  for (const [name, svg] of [
    [`banner-${p.mode}.svg`, banner(p)],
    [`banner-${p.mode}-mobile.svg`, bannerMobile(p)],
  ]) {
    writeFileSync(join(here, name), svg, "utf8");
    console.log("wrote", name);
  }
}
