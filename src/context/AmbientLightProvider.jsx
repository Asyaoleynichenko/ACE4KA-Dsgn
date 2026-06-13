import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AmbientLightContext = createContext(null);

const PROXIMITY_RADIUS = 280;
const PROXIMITY_LERP = 0.14;
const AUTO_LUMINOUS_SELECTORS = [
  '.project-case-study-mail .project-info',
  '.project-case-study-mail .title-info-card',
  '.project-case-study-mail .section .hyp-list',
  '.contact-item',
  '.preview-card .preview-image',
  '.preview-card-block',
].join(', ');

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function useAmbientLight() {
  const ctx = useContext(AmbientLightContext);
  if (!ctx) {
    throw new Error('useAmbientLight must be used within AmbientLightProvider');
  }
  return ctx;
}

export function useAmbientLightOptional() {
  return useContext(AmbientLightContext);
}

/** Tracks cursor/hover to drive inset glow intensity on registered cards only. */
export default function AmbientLightProvider({ children }) {
  const { pathname } = useLocation();
  const sourcesRef = useRef(new Map());
  const cursorRef = useRef({ px: 0, py: 0, active: false });
  const rafRef = useRef(null);
  const reducedRef = useRef(false);

  const runFrame = useCallback(() => {
    if (reducedRef.current) return;

    const sources = sourcesRef.current;
    if (sources.size === 0) return;

    const cursor = cursorRef.current;
    let keepAnimating = false;

    sources.forEach((entry) => {
      const { el } = entry;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const d = dist(cursor.px, cursor.py, cx, cy);
      const targetProximity = cursor.active ? clamp01(1 - d / PROXIMITY_RADIUS) : 0;
      const currentProximity = entry.proximity ?? 0;
      const lerp = reducedRef.current ? 1 : PROXIMITY_LERP;
      const proximity = currentProximity + (targetProximity - currentProximity) * lerp;
      entry.proximity = proximity;

      if (Math.abs(proximity - targetProximity) > 0.004 || targetProximity > 0.02) {
        keepAnimating = true;
      }

      el.style.setProperty('--ambient-proximity', proximity.toFixed(3));
    });

    const keepAlive = cursor.active || keepAnimating;

    if (keepAlive && rafRef.current == null) {
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        runFrame();
      });
    }
  }, []);

  const scheduleFrame = useCallback(() => {
    if (rafRef.current != null || reducedRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      runFrame();
    });
  }, [runFrame]);

  const register = useCallback(
    (id, el, options = {}) => {
      if (!el) return;
      if (options.color) {
        el.style.setProperty('--ambient-glow-rgb', options.color);
      }
      sourcesRef.current.set(id, { el, color: options.color ?? '255, 255, 255', proximity: 0 });
      scheduleFrame();
    },
    [scheduleFrame],
  );

  const unregister = useCallback((id) => {
    sourcesRef.current.delete(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReduced = () => {
      reducedRef.current = mq.matches;
    };
    syncReduced();
    mq.addEventListener('change', syncReduced);
    return () => mq.removeEventListener('change', syncReduced);
  }, []);

  useEffect(() => {
    if (reducedRef.current) return undefined;

    const autoBound = new Map();
    document.querySelectorAll(AUTO_LUMINOUS_SELECTORS).forEach((el) => {
      if (el.closest('.home-competencies-scrub') || el.closest('.scroll-scrub-row')) return;
      const id = `luminous-${autoBound.size}`;
      autoBound.set(el, id);
      register(id, el);
    });
    scheduleFrame();

    return () => {
      autoBound.forEach((id) => unregister(id));
    };
  }, [pathname, register, unregister, scheduleFrame]);

  useEffect(() => {
    if (reducedRef.current) return undefined;

    const onPointerMove = (e) => {
      cursorRef.current = { px: e.clientX, py: e.clientY, active: true };
      scheduleFrame();
    };

    const onPointerLeave = () => {
      cursorRef.current.active = false;
      scheduleFrame();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleFrame]);

  const value = useMemo(() => ({ register, unregister }), [register, unregister]);

  return <AmbientLightContext.Provider value={value}>{children}</AmbientLightContext.Provider>;
}
