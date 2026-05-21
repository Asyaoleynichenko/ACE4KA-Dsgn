import { useEffect, useState } from 'react';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { bindScrollResize } from '../utils/scrollRoot.js';

/**
 * Подсветка текущего блока при вертикальном скролле (якоря с id).
 * Учитывает Lenis и нативный скролл window / #root.
 */
export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(() => sectionIds[0] ?? '');
  const { lenis } = useLenisInstance();

  useEffect(() => {
    if (!sectionIds.length) {
      setActiveId('');
      return undefined;
    }

    const anchorLine = () => Math.min(window.innerHeight * 0.32, 152);

    const compute = () => {
      let active = sectionIds[0];
      const line = anchorLine();
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top } = el.getBoundingClientRect();
        if (top <= line) active = id;
      }
      setActiveId((prev) => (prev === active ? prev : active));
    };

    let raf = null;
    const onScrollOrResize = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        compute();
      });
    };

    const unbind = bindScrollResize(onScrollOrResize, { lenis });

    return () => {
      unbind();
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [sectionIds.join('\0'), lenis]);

  return activeId;
}
