/**
 * Конвертация растровых картинок в public/images → WebP (q82), удаление оригиналов.
 * SVG/GIF не трогаем. Запуск: node scripts/convert-images-webp.mjs
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/images';
const RASTER = new Set(['.png', '.jpg', '.jpeg']);

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let count = 0;
let before = 0;
let after = 0;
const failed = [];

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!RASTER.has(ext)) continue;
  const out = file.slice(0, -ext.length) + '.webp';
  try {
    const src = await stat(file);
    before += src.size;
    await sharp(file).webp({ quality: 82, effort: 4 }).toFile(out);
    const dst = await stat(out);
    after += dst.size;
    await unlink(file);
    count += 1;
  } catch (e) {
    failed.push(`${file}: ${e.message}`);
  }
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`converted: ${count} files`);
console.log(`raster before: ${mb(before)}MB → webp after: ${mb(after)}MB (−${mb(before - after)}MB)`);
if (failed.length) console.log('FAILED:', failed.slice(0, 10));
