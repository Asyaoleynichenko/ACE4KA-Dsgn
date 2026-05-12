import { useMemo } from 'react';
import { getLedPatternCircles } from '../utils/caseStudyLedPatterns.js';
import { publicUrl } from '../utils/publicUrl.js';

/** Угловые «шестерёнки» из макетных PNG — без пересборки по сетке (1:1 с экспортом Figma). */
const RASTER_CORNER_SRC = {
  solution: '/images/icons/card-solution.png',
  influence: '/images/icons/card-influence.png',
};

/**
 * LED-иконка угла карточки кейса: каждый «диод» — отдельный <circle> с CSS-анимацией.
 * @param {{ kind: 'task' | 'solution' | 'influence' | 'metrics' | 'problem' | 'context', staggerIndex?: number }} props
 */
export default function CaseStudyCardCornerIcon({ kind, staggerIndex = 0 }) {
  const rasterPath = kind && RASTER_CORNER_SRC[kind];
  const pattern = useMemo(() => {
    if (!kind || RASTER_CORNER_SRC[kind]) return null;
    return getLedPatternCircles(kind);
  }, [kind]);

  if (rasterPath) {
    return (
      <span className="card__corner-icon-led card__corner-icon-led--raster" aria-hidden>
        <img className="case-strip-corner-led-img" src={publicUrl(rasterPath)} alt="" />
      </span>
    );
  }

  if (!pattern) return null;

  const { viewBox, circles } = pattern;
  const staggerSec = (Number(staggerIndex) % 24) * 0.055;

  return (
    <span className="card__corner-icon-led" style={{ '--led-card-stagger': `${staggerSec}s` }}>
      <svg
        className="case-strip-led-svg"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {circles.map((c) => (
          <circle
            key={`${c.idx}-${c.cx}-${c.cy}`}
            className="case-strip-led-svg__dot"
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            style={{ '--led-idx': c.idx }}
          />
        ))}
      </svg>
    </span>
  );
}
