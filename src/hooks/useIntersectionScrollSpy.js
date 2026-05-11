import { useEffect, useRef, useState } from 'react';

const DEFAULT_THRESHOLDS = [0, 0.04, 0.1, 0.18, 0.28, 0.4, 0.52, 0.65, 0.78, 0.9, 1];

/**
 * Активный id секции по Intersection Observer: «полоса» в верхней части вьюпорта,
 * победитель — максимальный intersectionRatio в этой полосе. Запасной критерий —
 * ближайший к линии якоря блок (как у классического scrollspy).
 */
export function useIntersectionScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(() => sectionIds[0] ?? '');
  const ratiosRef = useRef(new Map());
  const idsKey = sectionIds.join('\0');

  useEffect(() => {
    if (!sectionIds.length) {
      setActiveId('');
      return undefined;
    }

    const scrollRootEl = document.getElementById('root');
    const root =
      scrollRootEl && scrollRootEl.scrollHeight > scrollRootEl.clientHeight + 2 ? scrollRootEl : null;

    const anchorLine = () => Math.min(window.innerHeight * 0.33, 168);

    const pickByScrollFallback = () => {
      const line = anchorLine();
      let id = sectionIds[0];
      for (const sid of sectionIds) {
        const el = document.getElementById(sid);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= line && bottom > 72) id = sid;
      }
      return id;
    };

    const pickWinner = () => {
      const map = ratiosRef.current;
      let bestId = sectionIds[0];
      let bestR = -1;
      for (const sid of sectionIds) {
        const r = map.get(sid) ?? 0;
        if (r > bestR) {
          bestR = r;
          bestId = sid;
        }
      }
      const next = bestR > 0 ? bestId : pickByScrollFallback();
      setActiveId((prev) => (prev === next ? prev : next));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sid = entry.target.id;
          if (!sectionIds.includes(sid)) continue;
          ratiosRef.current.set(sid, entry.intersectionRatio);
        }
        pickWinner();
      },
      {
        root,
        rootMargin: '-28% 0px -56% 0px',
        threshold: DEFAULT_THRESHOLDS,
      },
    );

    for (const sid of sectionIds) {
      const el = document.getElementById(sid);
      if (el) observer.observe(el);
    }

    pickWinner();

    return () => {
      observer.disconnect();
      ratiosRef.current.clear();
    };
  }, [idsKey]);

  return activeId;
}
