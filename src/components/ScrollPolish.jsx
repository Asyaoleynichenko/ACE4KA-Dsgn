import { useEffect } from 'react';
import { fitFooterWordmark } from '../utils/fitFooterWordmark.js';

/**
 * Effect-only: no DOM. Fits footer ACE4KA to screen width
 * and toggles `.is-revealed` on `[data-reveal]`.
 */
export default function ScrollPolish() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const getFooter = () => document.querySelector('[data-scale="footer-mega"]');
    const fit = () => {
      const footer = getFooter();
      if (footer) footer.style.setProperty('--footer-word-grow', '1');
      fitFooterWordmark(footer);
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

    const ro = new ResizeObserver(fit);

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
      const nextWordmark = getFooter()?.closest('.site-footer__wordmark');
      if (nextWordmark) ro.observe(nextWordmark);
      fit();
    };
    arm();
    const mo = new MutationObserver(arm);
    mo.observe(document.body, { childList: true, subtree: true });

    const fontsReady = document.fonts?.ready?.then(fit);
    window.addEventListener('resize', fit);

    return () => {
      io.disconnect();
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', fit);
      fontsReady?.catch?.(() => {});
    };
  }, []);

  return null;
}
