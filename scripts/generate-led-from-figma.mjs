/**
 * Строит `src/utils/caseStudyLedCirclesFromFigma.js` из:
 * 1) SVG с <rect> (экспорт Figma) — например `nav-icon-430-29004.svg`
 * 2) JSX-дампов `get_design_context` (Tailwind absolute + size-[…]px)
 *
 * Запуск: `node scripts/generate-led-from-figma.mjs`
 * Узлы макета «Problem, solution, impact block» (300:107895): 430:27165 Задача, 430:27691 Проблема, 430:27863 Метрики.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'utils', 'caseStudyLedCirclesFromFigma.js');
const DUMPS = path.join(__dirname, 'figma-led-dumps');

const margin = 3.5;
const vb = 64;
const span = vb - margin * 2;

/** @param {number} cxF @param {number} cyF @param {number} rF @param {number} W @param {number} H */
function mapFigmaToSvg(cxF, cyF, rF, W, H) {
  return {
    cx: margin + (cxF / W) * span,
    cy: margin + (cyF / H) * span,
    r: (rF / W) * span,
  };
}

/** @param {string} className */
function parseTailwindRect(className) {
  const sizeM = className.match(/size-\[([\d.]+)px\]/);
  const size = sizeM ? parseFloat(sizeM[1]) : 4;
  let left = undefined;
  const lm = className.match(/left-\[([\d.]+)px\]/);
  if (lm) left = parseFloat(lm[1]);
  else if (/\bleft-0\b/.test(className)) left = 0;
  let top = undefined;
  const tm = className.match(/top-\[([\d.]+)px\]/);
  if (tm) top = parseFloat(tm[1]);
  else if (/\btop-0\b/.test(className)) top = 0;
  if (left === undefined || top === undefined) return null;
  const half = size / 2;
  return { cxF: left + half, cyF: top + half, rF: half };
}

/**
 * @param {string} jsx
 * @param {{ w: number; h: number }} frame
 */
function circlesFromTailwindDump(jsx, { w, h }) {
  const pts = [];
  for (const line of jsx.split('\n')) {
    if (!line.includes('absolute bg-white') || !line.includes('className=')) continue;
    const m = line.match(/className="([^"]+)"/);
    if (!m) continue;
    const p = parseTailwindRect(m[1]);
    if (!p) continue;
    pts.push(p);
  }
  return pts.map((p, idx) => {
    const { cx, cy, r } = mapFigmaToSvg(p.cxF, p.cyF, p.rF, w, h);
    return { cx, cy, r, idx };
  });
}

/** @param {string} svgText @param {{ w: number; h: number }} frame */
function circlesFromSvgRects(svgText, frame) {
  const { w, h } = frame;
  const re = /<rect\s+([^>]+)>/g;
  const pts = [];
  let m;
  while ((m = re.exec(svgText))) {
    const attrs = m[1];
    const x = parseFloat(/x="([^"]+)"/.exec(attrs)?.[1] ?? '0');
    const y = parseFloat(/y="([^"]+)"/.exec(attrs)?.[1] ?? '0');
    const rw = parseFloat(/width="([^"]+)"/.exec(attrs)?.[1] ?? '0');
    const rh = parseFloat(/height="([^"]+)"/.exec(attrs)?.[1] ?? '0');
    const half = rw / 2;
    pts.push({ cxF: x + half, cyF: y + half, rF: half });
  }
  return pts.map((p, idx) => {
    const { cx, cy, r } = mapFigmaToSvg(p.cxF, p.cyF, p.rF, w, h);
    return { cx, cy, r, idx };
  });
}

function readDump(name) {
  const p = path.join(DUMPS, name);
  if (!fs.existsSync(p)) throw new Error(`Missing dump: ${p} (paste get_design_context output)`);
  return fs.readFileSync(p, 'utf8');
}

function emit() {
  const navSvg = fs.readFileSync(path.join(ROOT, 'public', 'images', 'icons', 'nav-icon-430-29004.svg'), 'utf8');
  const vbMatch = /viewBox="0\s+0\s+([\d.]+)\s+([\d.]+)"/.exec(navSvg);
  if (!vbMatch) throw new Error('nav-icon SVG: viewBox not found');
  const contextW = parseFloat(vbMatch[1]);
  const contextH = parseFloat(vbMatch[2]);

  const context = circlesFromSvgRects(navSvg, { w: contextW, h: contextH });
  const task = circlesFromTailwindDump(readDump('430-27165.jsx'), { w: 108, h: 84 });
  const problem = circlesFromTailwindDump(readDump('430-27691.jsx'), { w: 91.63636016845703, h: 84 });
  const metrics = circlesFromTailwindDump(readDump('430-27863.jsx'), { w: 84, h: 84 });

  const body = `/**
 * Координаты LED-диодов из Figma (get_design_context) + SVG nav-icon-430-29004 (узел 430:29004).
 * Перегенерация: \`node scripts/generate-led-from-figma.mjs\`
 */
export const LED_VIEWBOX = ${vb};

export const LED_CIRCLES_FIGMA = {
  context: ${JSON.stringify(context)},
  task: ${JSON.stringify(task)},
  problem: ${JSON.stringify(problem)},
  metrics: ${JSON.stringify(metrics)},
};
`;
  fs.writeFileSync(OUT, body);
  console.log('Wrote', OUT, {
    context: context.length,
    task: task.length,
    problem: problem.length,
    metrics: metrics.length,
  });
}

emit();
