import { LED_CIRCLES_FIGMA, LED_VIEWBOX } from './caseStudyLedCirclesFromFigma.js';

/**
 * Кружки LED-иконки: координаты из Figma (`caseStudyLedCirclesFromFigma.js`).
 * «Решение» / «Влияние» в углу карточки — растровые PNG (`CaseStudyCardCornerIcon`).
 * @param {'task' | 'solution' | 'influence' | 'metrics' | 'problem' | 'context'} kind
 * @returns {{ viewBox: string, circles: Array<{ cx: number; cy: number; r: number; idx: number }> } | null}
 */
export function getLedPatternCircles(kind) {
  const fromFigma = kind && LED_CIRCLES_FIGMA[kind];
  if (!fromFigma) return null;
  return { viewBox: `0 0 ${LED_VIEWBOX} ${LED_VIEWBOX}`, circles: fromFigma };
}
