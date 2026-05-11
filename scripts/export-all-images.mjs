/**
 * Copies all portfolio image assets into exports/images-<timestamp>/.
 * Sources: public/images, public/figma-assets, src/assets (raster/SVG).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.join(root, 'exports', `images-${stamp}`);

const sources = [
  { from: path.join(root, 'public', 'images'), to: path.join(outDir, 'images') },
  { from: path.join(root, 'public', 'figma-assets'), to: path.join(outDir, 'figma-assets') },
  { from: path.join(root, 'src', 'assets'), to: path.join(outDir, 'src-assets') },
];

fs.mkdirSync(outDir, { recursive: true });

for (const { from, to } of sources) {
  if (!fs.existsSync(from)) {
    console.warn('Skip (missing):', from);
    continue;
  }
  fs.cpSync(from, to, { recursive: true });
  console.log('Copied', from, '→', to);
}

const readme = `Portfolio image export
- images/ — from public/images
- figma-assets/ — from public/figma-assets
- src-assets/ — from src/assets (bundled rasters/SVG)

Generated: ${new Date().toISOString()}
Regenerate: npm run export:images
`;
fs.writeFileSync(path.join(outDir, 'README.txt'), readme, 'utf8');
console.log('Done:', outDir);
