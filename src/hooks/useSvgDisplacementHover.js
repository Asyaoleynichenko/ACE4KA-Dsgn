import { useEffect } from 'react';

/**
 * Hover: animate feDisplacementMap scale — organic liquid / halftone wave.
 */
export function useSvgDisplacementHover(
  ref,
  { mapId = 'ace-halftone-liquid-map', scaleHover = 16, scaleRest = 0 } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const map = document.getElementById(mapId);
    if (!map) return undefined;

    const setScale = (v) => map.setAttribute('scale', String(v));

    const onEnter = () => setScale(scaleHover);
    const onLeave = () => setScale(scaleRest);

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      setScale(scaleRest);
    };
  }, [mapId, scaleHover, scaleRest]);
}
