import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { smartTweenReduced } from '../motion/smartAnimate.js';

/** Радиус кружка в compact rail (px). */
function dashDotRadius(level, isActive) {
  const l1 = (level ?? 2) <= 1;
  if (isActive) return l1 ? 8 : 7;
  return l1 ? 5 : 4;
}

const ROW_HEIGHT = 18;
const TRACK_WIDTH = 36;
const FILTER_ID = 'rail-gooey-local';

/**
 * Compact rail с metaball-эффектом, реализованным в чистом SVG (filter в том же
 * стейкинг-контексте, что и circles — гарантированно применяется и сливает
 * близкие кружки в peanut/blob форму).
 */
export default function CaseStudyRailMetaballDashes({
  rows,
  activeId,
  onNavigate,
  dashRowVariants,
  reduceMotion: reduceMotionProp,
  hasChapter,
}) {
  const reduceMotionHook = useReducedMotion() === true;
  const reduceMotion = reduceMotionProp ?? reduceMotionHook;
  const rowRefs = useRef([]);

  const activeIndex = useMemo(() => {
    const idx = rows.findIndex((r) => r.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [rows, activeId]);

  const rowCenters = useMemo(() => rows.map((_, i) => ROW_HEIGHT / 2 + i * ROW_HEIGHT), [rows]);
  const trackHeight = rows.length * ROW_HEIGHT;

  const activeLv = rows[activeIndex]?.level ?? (hasChapter ? 2 : 1);
  const activeRadius = dashDotRadius(activeLv, true);
  const activeCy = rowCenters[activeIndex] ?? 0;
  const prevActiveRef = useRef({ cy: activeCy, r: activeRadius });

  useLayoutEffect(() => {
    /* запоминаем предыдущее значение для построения keyframes */
    return () => {
      prevActiveRef.current = { cy: activeCy, r: activeRadius };
    };
  }, [activeCy, activeRadius]);

  return (
    <div className="case-study-rail__dashes case-study-rail__dashes--metaball">
      <svg
        className="case-study-rail__metaball-svg"
        width={TRACK_WIDTH}
        height={trackHeight}
        viewBox={`0 0 ${TRACK_WIDTH} ${trackHeight}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Gooey filter — внутри SVG: гарантированно резолвится. */}
          <filter id={FILTER_ID} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="rl-blur" />
            <feColorMatrix
              in="rl-blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="rl-goo"
            />
          </filter>
        </defs>
        <g filter={`url(#${FILTER_ID})`}>
          {rows.map((entry, index) => {
            const lv = entry.level ?? (hasChapter ? 2 : 1);
            const r = dashDotRadius(lv, false);
            const isActive = index === activeIndex;
            return (
              <circle
                key={entry.id}
                cx={TRACK_WIDTH / 2}
                cy={rowCenters[index]}
                r={r}
                fill="#ffffff"
                opacity={isActive ? 0 : 1}
              />
            );
          })}
          <motion.circle
            key={`blob-${activeIndex}`}
            initial={{ cy: prevActiveRef.current.cy, r: prevActiveRef.current.r }}
            cx={TRACK_WIDTH / 2}
            fill="#ffffff"
            animate={
              reduceMotion
                ? { cy: activeCy, r: activeRadius }
                : {
                    cy: [prevActiveRef.current.cy, (prevActiveRef.current.cy + activeCy) / 2, activeCy],
                    r: [prevActiveRef.current.r, Math.max(prevActiveRef.current.r, activeRadius) * 1.8, activeRadius],
                  }
            }
            transition={
              reduceMotion
                ? smartTweenReduced()
                : { duration: 0.7, times: [0, 0.5, 1], ease: [0.22, 1, 0.36, 1] }
            }
          />
        </g>
      </svg>

      <div className="case-study-rail__metaball-hits" style={{ height: trackHeight }}>
        {rows.map((entry, index) => {
          const { id, label, keyword, caption } = entry;
          const isActive = activeId === id;
          const tip = keyword && caption ? `${keyword} — ${caption}` : label;

          return (
            <motion.a
              key={id}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              href={`#${id}`}
              className={`case-study-rail__dash-hit${isActive ? ' is-active' : ''}`}
              title={tip}
              aria-current={isActive ? 'location' : undefined}
              variants={dashRowVariants}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(id);
              }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              style={{ height: ROW_HEIGHT }}
            />
          );
        })}
      </div>
    </div>
  );
}
