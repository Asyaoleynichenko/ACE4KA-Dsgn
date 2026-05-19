/**
 * Convert CSS px lengths to rem (16px = 1rem).
 * Usage: node scripts/px-to-rem.mjs [file...]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 16;

function pxToRem(px) {
  if (px === 0) return '0';
  const rem = px / BASE;
  const str = rem.toFixed(6).replace(/\.?0+$/, '');
  return `${str}rem`;
}

function convertContent(content) {
  return content.replace(/(-?\d*\.?\d+)px\b/g, (match, numStr) => {
    const n = parseFloat(numStr);
    if (Number.isNaN(n)) return match;
    return pxToRem(n);
  });
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/px-to-rem.mjs <files...>');
  process.exit(1);
}

for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = convertContent(before);
  if (before !== after) {
    writeFileSync(file, after);
    const count = (before.match(/\d*\.?\d+px\b/g) || []).length;
    console.log(`${file}: converted ${count} px values`);
  } else {
    console.log(`${file}: no changes`);
  }
}
