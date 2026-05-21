import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { scrollToTop } from '../utils/scrollRoot.js';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { lenis } = useLenisInstance();

  /** До отрисовки новой страницы — без «вспышки» старого скролла */
  useLayoutEffect(() => {
    scrollToTop({ lenis, immediate: true });
    requestAnimationFrame(refreshScrollTrigger);
  }, [pathname, lenis]);

  return null;
}
