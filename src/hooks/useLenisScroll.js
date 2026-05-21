import { useEffect } from 'react';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { bindScroll } from '../utils/scrollRoot.js';

/**
 * Подписка на скролл (Lenis или нативный fallback при reduced-motion).
 */
export function useLenisScroll(handler, deps = []) {
  const { lenis } = useLenisInstance();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    return bindScroll(handler, { lenis });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, ...deps]);
}
