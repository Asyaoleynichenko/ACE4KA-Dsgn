import { useEffect, useRef } from 'react';
import { collectFloatElements, decayMouseFloat, tickMouseFloat } from '../utils/mouseInertia.js';

/**
 * Mouse inertia / floating — hero, окно-превью, типографика с data-float (не карточки проектов).
 */
export default function MouseInertia() {
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const elementsRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return undefined;

    const refreshElements = () => {
      elementsRef.current = collectFloatElements();
    };

    refreshElements();

    const observer = new MutationObserver(() => {
      refreshElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    const loop = () => {
      raf = 0;
      const els = elementsRef.current;
      if (!els.length) return;

      if (pointerRef.current.active) {
        tickMouseFloat(pointerRef.current, els);
      } else {
        const still = decayMouseFloat(els);
        if (!still) return;
      }
      raf = requestAnimationFrame(loop);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      schedule();
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
      schedule();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    const onReduced = () => {
      if (reduced.matches) {
        elementsRef.current.forEach((el) => {
          el.style.removeProperty('--float-x');
          el.style.removeProperty('--float-y');
        });
      } else {
        refreshElements();
      }
    };
    reduced.addEventListener('change', onReduced);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      reduced.removeEventListener('change', onReduced);
      if (raf) cancelAnimationFrame(raf);
      elementsRef.current.forEach((el) => {
        el.style.removeProperty('--float-x');
        el.style.removeProperty('--float-y');
      });
    };
  }, []);

  return null;
}
