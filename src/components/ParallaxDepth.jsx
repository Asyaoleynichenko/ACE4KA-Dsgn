import { useEffect } from 'react';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { applyVerticalParallaxDepth } from '../utils/parallaxDepth.js';
import { bindScroll } from '../utils/scrollRoot.js';

/**
 * Вертикальный parallax для элементов с data-speed (сетки карточек, hero и т.д.).
 * Горизонтальные scrub-ленты обрабатываются в cinematicScrub.
 */
export default function ParallaxDepth() {
  const { lenis } = useLenisInstance();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = 0;
    const tick = () => {
      raf = 0;
      applyVerticalParallaxDepth();
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    const unbind = bindScroll(onScroll, { lenis });
    tick();

    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      unbind();
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      document.querySelectorAll('[data-speed].parallax-depth--active').forEach((el) => {
        el.style.transform = '';
        el.style.zIndex = '';
        el.classList.remove('parallax-depth--active');
      });
    };
  }, [lenis]);

  return null;
}
