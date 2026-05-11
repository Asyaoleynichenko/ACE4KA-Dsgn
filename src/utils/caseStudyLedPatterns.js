import { LED_CIRCLES_FIGMA, LED_VIEWBOX } from './caseStudyLedCirclesFromFigma.js';
import { LED_CELLS_FROM_PNG, LED_GRID } from './caseStudyLedCellsFromPng.js';

const margin = 3.5;
const span = LED_VIEWBOX - margin * 2;

function circlesFromPngCells(kind) {
  const raw = LED_CELLS_FROM_PNG[kind] ?? LED_CELLS_FROM_PNG.influence;
  const grid = LED_GRID;
  return raw.map(([ix, iy], i) => ({
    cx: margin + (ix / (grid - 1)) * span,
    cy: margin + (iy / (grid - 1)) * span,
    r: 1.4,
    idx: i,
  }));
}

/**
 * Кружки LED-иконки: точные координаты из Figma (`caseStudyLedCirclesFromFigma.js`);
 * «Решение» / «Влияние» — по сетке с PNG (`caseStudyLedCellsFromPng.js`).
 * @param {'task' | 'solution' | 'influence' | 'metrics' | 'problem' | 'context'} kind
 * @returns {{ viewBox: string, circles: Array<{ cx: number; cy: number; r: number; idx: number }> }}
 */
export function getLedPatternCircles(kind) {
  const fromFigma = LED_CIRCLES_FIGMA[kind];
  if (fromFigma) {
    return { viewBox: `0 0 ${LED_VIEWBOX} ${LED_VIEWBOX}`, circles: fromFigma };
  }
  const circles = circlesFromPngCells(kind);
  return { viewBox: `0 0 ${LED_VIEWBOX} ${LED_VIEWBOX}`, circles };
}
