import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import {
  connectLenisScrollTrigger,
  disconnectLenisScrollTrigger,
  onScrollTriggerScrollerChange,
} from '../gsap/lenisScrollTrigger.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { MOTION_LERP, prefersNativeScroll } from '../motion/motionSystem.js';

const LenisContext = createContext({ lenis: null, enabled: false });

export function useLenisInstance() {
  return useContext(LenisContext);
}

const LENIS_OPTIONS = {
  /** RAF через GSAP ticker — синхрон с ScrollTrigger scrub */
  autoRaf: false,
  /** Inertia / «тяжёлый» скролл — ниже = плавнее и дольше затухание */
  lerp: MOTION_LERP,
  wheelMultiplier: 0.92,
  smoothWheel: true,
  syncTouch: true,
  syncTouchLerp: MOTION_LERP,
  touchInertiaExponent: 1.65,
  allowNestedScroll: true,
  anchors: true,
  prevent: (node) =>
    Boolean(
      node.closest?.(
        '[data-lenis-prevent], .scroll-scrub-row__viewport, .gallery--horizontal, [role="dialog"]',
      ),
    ),
};

function getScrollContent(wrapper) {
  if (wrapper === window) return document.documentElement;
  return wrapper.firstElementChild || wrapper;
}

function createLenisInstance() {
  const wrapper = getScrollWrapper();
  const content = getScrollContent(wrapper);
  return new Lenis({ ...LENIS_OPTIONS, wrapper, content });
}

export default function LenisProvider({ children }) {
  const { pathname } = useLocation();
  const basePath = stripLocaleFromPathname(pathname);
  /** GSAP pin/scrub (hero, компетенции, ленты кейсов) — только нативный скролл window. */
  const skipLenis =
    basePath === '/' || basePath === '/projects' || basePath.startsWith('/project/');
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 48rem)');
    let instance = null;
    let observer = null;

    const destroy = () => {
      disconnectLenisScrollTrigger();
      onScrollTriggerScrollerChange();
      instance?.destroy();
      instance = null;
      lenisRef.current = null;
      setLenis(null);
      setEnabled(false);
    };

    const mount = () => {
      destroy();
      if (prefersNativeScroll() || skipLenis) return;
      instance = createLenisInstance();
      lenisRef.current = instance;
      connectLenisScrollTrigger(instance);
      setLenis(instance);
      setEnabled(true);
    };

    mount();

    const root = document.getElementById('root');
    const onClassChange = () => {
      const nextWrapper = getScrollWrapper();
      if (instance?.options?.wrapper !== nextWrapper) {
        mount();
      } else if (instance) {
        onScrollTriggerScrollerChange();
      }
    };

    observer = new MutationObserver(onClassChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    if (root) {
      observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    }

    const onMotionPreferenceChange = () => mount();
    reduced.addEventListener('change', onMotionPreferenceChange);
    mqMobile.addEventListener('change', onMotionPreferenceChange);

    return () => {
      reduced.removeEventListener('change', onMotionPreferenceChange);
      mqMobile.removeEventListener('change', onMotionPreferenceChange);
      observer?.disconnect();
      destroy();
    };
  }, [skipLenis]);

  return <LenisContext.Provider value={{ lenis, enabled }}>{children}</LenisContext.Provider>;
}
