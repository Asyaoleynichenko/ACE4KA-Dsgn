import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'public', 'images', 'icons');

function readChunks(buf) {
  let o = 8;
  const idats = [];
  let width;
  let height;
  let bitDepth;
  let colorType;
  while (o < buf.length) {
    const len = buf.readUInt32BE(o);
    o += 4;
    const type = buf.toString('ascii', o, o + 4);
    o += 4;
    const data = buf.subarray(o, o + len);
    o += len;
    o += 4;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') idats.push(data);
    else if (type === 'IEND') break;
  }
  return { width, height, bitDepth, colorType, compressed: Buffer.concat(idats) };
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(buf) {
  const { width, height, bitDepth, colorType, compressed } = readChunks(buf);
  if (bitDepth !== 8 || colorType !== 6) {
    throw new Error(`Unsupported PNG depth=${bitDepth} colorType=${colorType}`);
  }
  const bpp = 4;
  const raw = zlib.inflateSync(compressed);
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const scan = raw.subarray(pos, pos + stride);
    pos += stride;
    const rowOff = y * stride;
    const prevOff = (y - 1) * stride;
    for (let x = 0; x < stride; x++) {
      const rawB = scan[x];
      const left = x >= bpp ? out[rowOff + x - bpp] : 0;
      const up = y > 0 ? out[prevOff + x] : 0;
      const upleft = y > 0 && x >= bpp ? out[prevOff + x - bpp] : 0;
      let v = rawB;
      if (filter === 1) v = (rawB + left) & 255;
      else if (filter === 2) v = (rawB + up) & 255;
      else if (filter === 3) v = (rawB + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) v = (rawB + paeth(left, up, upleft)) & 255;
      out[rowOff + x] = v;
    }
  }
  return { width, height, rgba: out };
}

function extractCells({ width, height, rgba }, grid, opts = {}) {
  const { lumaMin = 165, alphaMin = 35, minPerCell = 1 } = opts;
  const buckets = new Map();
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const i = (py * width + px) * 4;
      const r = rgba[i];
      const g = rgba[i + 1];
      const b = rgba[i + 2];
      const a = rgba[i + 3];
      const luma = (r * 299 + g * 587 + b * 114) / 1000;
      if (a < alphaMin || luma < lumaMin) continue;
      const gx = Math.min(grid - 1, Math.floor((px / width) * grid));
      const gy = Math.min(grid - 1, Math.floor((py / height) * grid));
      const k = `${gx},${gy}`;
      buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
  }
  const cells = [];
  for (const [k, cnt] of buckets) {
    if (cnt < minPerCell) continue;
    const [gx, gy] = k.split(',').map(Number);
    cells.push([gx, gy]);
  }
  cells.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  return cells;
}

const grid = 24;
const map = {};
for (const [file, key] of [
  ['card-solution.png', 'solution'],
  ['card-influence.png', 'influence'],
]) {
  const buf = fs.readFileSync(path.join(ROOT, file));
  map[key] = extractCells(decodePng(buf), grid, {});
}

const outPath = path.join(__dirname, '..', 'src', 'utils', 'caseStudyLedCellsFromPng.js');
const body = `/**
 * Координаты «диодов» с макетных PNG (Figma-экспорт в public/images/icons).
 * Остальные виды карточек — в \`caseStudyLedCirclesFromFigma.js\`.
 * Сетка ${grid}×${grid}: пересчёт — \`node scripts/generate-led-cells-data.mjs\`
 */
export const LED_GRID = ${grid};

export const LED_CELLS_FROM_PNG = {
  solution: ${JSON.stringify(map.solution)},
  influence: ${JSON.stringify(map.influence)},
};
`;
fs.writeFileSync(outPath, body);
console.log('Wrote', outPath);
for (const [k, v] of Object.entries(map)) console.log(k, v.length);
