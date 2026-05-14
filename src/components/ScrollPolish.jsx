import { useEffect } from 'react';

/**
 * Effect-only: no DOM. Drives `--scale-y` on `[data-scale]` and
 * toggles `.is-revealed` on `[data-reveal]` via IntersectionObserver.
 * Skipped when native `animation-timeline: view()` is supported (CSS owns it).
 */
export default function ScrollPolish() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const supportsTimeline =
      typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()');

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const vh = window.innerHeight;

        if (!supportsTimeline) {
          const hero = document.querySelector('[data-scale="hero-name"]');
          if (hero) {
            const r = hero.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (vh - r.top) / vh));
            hero.style.setProperty('--scale-y', (1 + progress * 0.15).toFixed(3));
          }

          const title = document.querySelector('[data-scale="section-title"]');
          if (title) {
            const r = title.getBoundingClientRect();
            const distFromCenter = Math.abs(r.top + r.height / 2 - vh / 2);
            const closeness = Math.max(0, 1 - distFromCenter / vh);
            title.style.setProperty('--scale-y', (1 + closeness * 0.25).toFixed(3));
          }

          const footer = document.querySelector('[data-scale="footer-mega"]');
          if (footer) {
            const r = footer.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.8)));
            footer.style.setProperty('--scale-y', (0.85 + progress * 0.3).toFixed(3));
          }
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
      { threshold: 0.15 },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
