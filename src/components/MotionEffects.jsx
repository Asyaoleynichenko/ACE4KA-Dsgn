import { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { lazyWithRetry } from '../utils/lazyWithRetry.js';
/* SVG-фильтр-defs — eager: нужен сразу для metaball-эффекта в side-nav, иначе filter url() не резолвится. */
import SvgDisplacementDefs from './SvgDisplacementDefs.jsx';

const ParallaxDepth = lazyWithRetry(() => import('./ParallaxDepth.jsx'));
const MouseInertia = lazyWithRetry(() => import('./MouseInertia.jsx'));
const ScrollPolish = lazyWithRetry(() => import('./ScrollPolish.jsx'));
const TypographyRevealHost = lazyWithRetry(() => import('./TypographyRevealHost.jsx'));
const InteractiveTextCondensedHost = lazyWithRetry(() => import('./InteractiveTextCondensedHost.jsx'));
const CustomCursor = lazyWithRetry(() => import('./CustomCursor.jsx'));

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

  return (
    <>
      <SvgDisplacementDefs />
      <Suspense fallback={null}>
        <InteractiveTextCondensedHost />
      </Suspense>
      {!ready ? null : (
        <Suspense fallback={null}>
          <ParallaxDepth />
          <MouseInertia />
          <ScrollPolish />
          <CustomCursor />
          {isHome ? <TypographyRevealHost /> : null}
        </Suspense>
      )}
    </>
  );
}
