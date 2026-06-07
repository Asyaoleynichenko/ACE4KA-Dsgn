import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { bindScroll, getScrollWrapper, getScrollY, scrollToTop } from '../utils/scrollRoot.js';

const posKey = (pathname) => `scroll-pos:${pathname}`;

function readSavedY(pathname) {
  try {
    const raw = sessionStorage.getItem(posKey(pathname));
    const y = raw === null ? NaN : Number(raw);
    return Number.isFinite(y) && y > 0 ? y : 0;
  } catch {
    return 0;
  }
}

function writeSavedY(pathname, y) {
  try {
    sessionStorage.setItem(posKey(pathname), String(Math.round(y)));
  } catch {
    /* private mode / quota — просто без восстановления */
  }
}

function maxScrollY() {
  const wrapper = getScrollWrapper();
  if (wrapper === window) {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
  return wrapper.scrollHeight - wrapper.clientHeight;
}

function setScrollY(y, lenis) {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
    return;
  }
  const wrapper = getScrollWrapper();
  if (wrapper === window) window.scrollTo(0, y);
  else wrapper.scrollTop = y;
}

/**
 * Бесшовный контекст скролла: PUSH/REPLACE — с нуля, POP (back/forward) —
 * восстановление позиции страницы. Lazy-секции дорастают асинхронно,
 * поэтому restore ретраит в rAF, пока высота документа не догонит цель.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const { lenis } = useLenisInstance();

  /** До отрисовки новой страницы — без «вспышки» старого скролла */
  useLayoutEffect(() => {
    /* Браузерное авто-восстановление конфликтует с ручным — выключаем один раз */
    if (typeof window !== 'undefined' && window.history.scrollRestoration !== 'manual') {
      window.history.scrollRestoration = 'manual';
    }

    let restoreRaf = null;
    const savedY = navigationType === 'POP' ? readSavedY(pathname) : 0;

    if (savedY > 0) {
      let tries = 0;
      const attempt = () => {
        setScrollY(Math.min(savedY, Math.max(0, maxScrollY())), lenis);
        tries += 1;
        /* ~1s на догрузку lazy-контента; как только высоты хватает — стоп */
        if (maxScrollY() < savedY && tries < 60) {
          restoreRaf = requestAnimationFrame(attempt);
        } else {
          restoreRaf = requestAnimationFrame(refreshScrollTrigger);
        }
      };
      attempt();
    } else {
      scrollToTop({ lenis, immediate: true });
      requestAnimationFrame(refreshScrollTrigger);
    }

    /* Текущая позиция страницы пишется по ходу скролла; фиксация — при уходе */
    let lastY = savedY;
    const unbind = bindScroll(
      () => {
        lastY = lenis ? lenis.scroll : getScrollY();
      },
      { lenis },
    );

    return () => {
      if (restoreRaf != null) cancelAnimationFrame(restoreRaf);
      unbind();
      writeSavedY(pathname, lastY);
    };
  }, [pathname, navigationType, lenis]);

  return null;
}
