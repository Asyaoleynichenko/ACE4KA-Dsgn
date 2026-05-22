import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';

const ParallaxDepth = lazy(() => import('./ParallaxDepth.jsx'));
const MouseInertia = lazy(() => import('./MouseInertia.jsx'));
const ScrollPolish = lazy(() => import('./ScrollPolish.jsx'));
const SvgDisplacementDefs = lazy(() => import('./SvgDisplacementDefs.jsx'));
const TypographyRevealHost = lazy(() => import('./TypographyRevealHost.jsx'));

/** Motion/GSAP — после первого кадра, не блокирует initial bundle. */
export default function MotionEffects() {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const isHome = stripLocaleFromPathname(pathname) === '/';

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return undefined;

    let cancelled = false;
    const boot = () => {
      if (!cancelled) setReady(true);
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(boot, { timeout: 1200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const id = window.setTimeout(boot, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <SvgDisplacementDefs />
      <ParallaxDepth />
      <MouseInertia />
      <ScrollPolish />
      {isHome ? <TypographyRevealHost /> : null}
    </Suspense>
  );
}
