import { useEffect, useRef, useState } from 'react';
import { COMPETENCIES_HEADING_ORDER } from '../data/competenciesHeadingOrder.js';
import { homeProjectsCatalog } from '../data/homeProjectsCatalog.js';
import { publicUrl } from '../utils/publicUrl.js';

/** Соответствие competency-строки → slug проекта-иллюстрации. */
const LINE_TO_PROJECT_SLUG = [
  'mail-monetization', // PRODUCT DESIGN
  'neural',            // AI И ВАЙБКОДИНГ
  'racktables',        // RESEARCH AND UX/UI
  'drop',              // ПРОЦЕССЫ
  'loochok',           // BRANDING
];

function previewForIndex(i) {
  const slug = LINE_TO_PROJECT_SLUG[i];
  if (!slug) return null;
  const entry = homeProjectsCatalog.find((p) => p.slug === slug);
  return entry?.image ?? null;
}

/**
 * Главная — блок компетенций (Figma 592:38775 / 418:21263).
 * При скролле через строки появляется превью проекта на тему текущей строки.
 */
export default function HomeCompetenciesScrub({ lines, ariaLabel, children }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const lineRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const elements = lineRefs.current.filter(Boolean);
    if (!elements.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            if (Number.isFinite(idx)) setActiveIndex(idx);
          }
        });
      },
      {
        /* Активируем строку когда она в средней зоне viewport. */
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lines]);

  return (
    <div className="home-competencies-scrub home-competencies-scrub--static">
      <div className="home-competencies__panel">
        <div className="home-competencies__inner home-competencies__inner--stack">
          <div className="home-competencies__type" role="group" aria-label={ariaLabel}>
            {lines.map((line, i) => {
              const previewSrc = previewForIndex(i);
              const isActive = activeIndex === i;
              return (
                <div
                  key={line}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  data-idx={i}
                  className={`home-competencies__line-wrap${isActive ? ' is-active' : ''}`}
                  data-heading={COMPETENCIES_HEADING_ORDER[i] ?? 3}
                >
                  {previewSrc ? (
                    <img
                      className="home-competencies__line-preview"
                      src={publicUrl(previewSrc)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      aria-hidden="true"
                    />
                  ) : null}
                  <p className="home-competencies__line">{line}</p>
                </div>
              );
            })}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
