import { useEffect, useState } from 'react';

/**
 * Подсветка текущего блока при вертикальном скролле (якоря с id).
 * Учитывает и window, и #root (если скролл перенесён на контейнер).
 */
export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(() => sectionIds[0] ?? '');

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

    const rootEl = document.getElementById('root');

    compute();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    rootEl?.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      rootEl?.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [sectionIds.join('\0')]);

  return activeId;
}
