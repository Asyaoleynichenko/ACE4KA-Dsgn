import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { wrapInteractiveTextCondensed } from '../utils/wrapInteractiveTextCondensed.js';

/** После навигации — авто-обёртка текста ссылок/кнопок в `.text-condensed`. */
export default function InteractiveTextCondensedHost() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrapInteractiveTextCondensed(document);
      return undefined;
    }

    let cancelled = false;
    const run = () => {
      if (!cancelled) wrapInteractiveTextCondensed(document);
    };

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [pathname]);

  return null;
}
