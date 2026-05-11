import { useMemo } from 'react';
import { getLedPatternCircles } from '../utils/caseStudyLedPatterns.js';

/**
 * LED-иконка угла карточки кейса: каждый «диод» — отдельный <circle> с CSS-анимацией.
 * @param {{ kind: 'task' | 'solution' | 'influence' | 'metrics' | 'problem' | 'context', staggerIndex?: number }} props
 */
export default function CaseStudyCardCornerIcon({ kind, staggerIndex = 0 }) {
  const { viewBox, circles } = useMemo(() => getLedPatternCircles(kind), [kind]);
  const staggerSec = (Number(staggerIndex) % 24) * 0.055;

  if (!kind) return null;

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
