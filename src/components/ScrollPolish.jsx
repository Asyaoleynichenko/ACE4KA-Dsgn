import { useEffect } from 'react';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { bindScroll } from '../utils/scrollRoot.js';

/**
 * Effect-only: no DOM. Drives `--scale-x` on the footer wordmark
 * and toggles `.is-revealed` on `[data-reveal]` via IntersectionObserver.
 * Footer rubber always runs from JS — Lenis breaks view() timelines.
 */
export default function ScrollPolish() {
  const { lenis } = useLenisInstance();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const vh = window.innerHeight;

        /* compressed → expanded as the wordmark enters, then back. Whole word, scaleX only. */
        const footer = document.querySelector('[data-scale="footer-mega"]');
        if (footer) {
          const r = footer.getBoundingClientRect();
          const travel = Math.max(vh * 0.72, r.height * 0.9);
          const raw = Math.max(0, Math.min(1, (vh - r.top) / travel));
          const wave = Math.sin(raw * Math.PI);
          const compressed = 0.65;
          footer.style.setProperty('--scale-x', (compressed + wave * (1 - compressed)).toFixed(4));
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    /* `[data-reveal]` — одиночный блок, `[data-reveal-group] > *` — каскад детей.
       reveal-pending ставится из JS (не из CSS-базы): без JS / с reduced-motion
       контент просто виден статично. MutationObserver подхватывает lazy-секции. */
    const armed = new WeakSet();
    const arm = () => {
      document.querySelectorAll('[data-reveal], [data-reveal-group] > *').forEach((el) => {
        if (armed.has(el)) return;
        armed.add(el);
        el.classList.add('reveal-pending');
        io.observe(el);
      });
    };
    arm();
    const mo = new MutationObserver(arm);
    mo.observe(document.body, { childList: true, subtree: true });

    const unbind = bindScroll(onScroll, { lenis });
    onScroll();

    return () => {
      unbind();
      io.disconnect();
      mo.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [lenis]);

  return null;
}
