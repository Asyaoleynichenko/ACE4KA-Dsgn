import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { smartTween, smartTweenReduced } from '../motion/smartAnimate.js';

/** Диаметр точки в compact rail (px). */
function dashDotPx(level, isActive) {
  const l1 = (level ?? 2) <= 1;
  if (isActive) return l1 ? 8 : 6;
  return l1 ? 6 : 4;
}

/**
 * Compact rail: gooey metaball — при скролле активная «капля» перетекает между точками.
 */
export default function CaseStudyRailMetaballDashes({
  rows,
  activeId,
  hasChapter,
  onNavigate,
  dashRowVariants,
  reduceMotion: reduceMotionProp,
}) {
  const reduceMotionHook = useReducedMotion() === true;
  const reduceMotion = reduceMotionProp ?? reduceMotionHook;

  const visualRef = useRef(null);
  const rowRefs = useRef([]);

  const activeIndex = useMemo(() => {
    const idx = rows.findIndex((r) => r.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [rows, activeId]);

  const [blob, setBlob] = useState({ top: 0, size: 6 });

  const measureBlob = useCallback(() => {
    const visual = visualRef.current;
    const row = rowRefs.current[activeIndex];
    if (!visual || !row) return;

    const visualRect = visual.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const centerY = rowRect.top + rowRect.height / 2 - visualRect.top;
    const entry = rows[activeIndex];
    const lv = entry?.level ?? (hasChapter ? 2 : 1);
    const size = dashDotPx(lv, true);

    setBlob((prev) => {
      const top = centerY - size / 2;
      if (prev.top === top && prev.size === size) return prev;
      return { top, size };
    });
  }, [activeIndex, rows, hasChapter]);

  useLayoutEffect(() => {
    measureBlob();
  }, [measureBlob, rows.length]);

  useLayoutEffect(() => {
    const visual = visualRef.current;
    if (!visual || typeof ResizeObserver === 'undefined') return undefined;

    const ro = new ResizeObserver(() => measureBlob());
    ro.observe(visual);
    rowRefs.current.forEach((el) => {
      if (el) ro.observe(el);
    });
    window.addEventListener('resize', measureBlob, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureBlob);
    };
  }, [measureBlob, rows.length]);

  const blobTransition = reduceMotion ? smartTweenReduced() : smartTween(0.42);

  return (
    <div className="case-study-rail__dashes case-study-rail__dashes--metaball">
      <div ref={visualRef} className="case-study-rail__metaball-visual" aria-hidden>
        {rows.map((entry, index) => {
          const lv = entry.level ?? (hasChapter ? 2 : 1);
          const inactive = dashDotPx(lv, false);
          const isActive = index === activeIndex;
          return (
            <div key={entry.id} className="case-study-rail__metaball-slot">
              <span
                className={`case-study-rail__metaball-node${isActive ? ' case-study-rail__metaball-node--hidden' : ''}`}
                style={{ width: inactive, height: inactive }}
              />
            </div>
          );
        })}
        <motion.span
          className="case-study-rail__metaball-blob"
          initial={false}
          animate={{
            top: blob.top,
            width: blob.size,
            height: blob.size,
          }}
          transition={blobTransition}
        />
      </div>

      <div className="case-study-rail__metaball-hits">
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
            />
          );
        })}
      </div>
    </div>
  );
}
