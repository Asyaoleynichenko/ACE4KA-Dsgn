import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initTypographyRevealAll } from '../motion/typographyReveal.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';

/** Подхватывает `[data-type-reveal]` на странице после навигации. */
export default function TypographyRevealHost() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    const run = () => {
      if (cancelled) return;
      cleanup = initTypographyRevealAll(document);
      requestAnimationFrame(() => refreshScrollTrigger());
    };

    const id = requestAnimationFrame(run);

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      cleanup();
    };
  }, [pathname]);

  return null;
}
