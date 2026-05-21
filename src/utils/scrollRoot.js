/** Корневой скролл-контейнер: window или #root при snap-pages. */
export function getScrollWrapper() {
  if (typeof document === 'undefined') return window;
  const root = document.getElementById('root');
  if (
    root?.classList.contains('snap-pages-root') &&
    root.scrollHeight > root.clientHeight + 2
  ) {
    return root;
  }
  return window;
}

/** Текущая позиция вертикального скролла (px). */
export function getScrollY(wrapper = getScrollWrapper()) {
  if (typeof window === 'undefined') return 0;
  if (wrapper === window) {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  return wrapper.scrollTop || 0;
}

/**
 * Подписка на скролл: Lenis `scroll` или нативные события на window / #root.
 * @returns {() => void} cleanup
 */
export function bindScroll(handler, { lenis } = {}) {
  if (lenis) {
    lenis.on('scroll', handler);
    return () => lenis.off('scroll', handler);
  }

  const wrapper = getScrollWrapper();
  const passive = { passive: true };
  const capture = { passive: true, capture: true };
  window.addEventListener('scroll', handler, passive);
  document.addEventListener('scroll', handler, capture);
  if (wrapper !== window) wrapper.addEventListener('scroll', handler, passive);

  return () => {
    window.removeEventListener('scroll', handler, passive);
    document.removeEventListener('scroll', handler, capture);
    if (wrapper !== window) wrapper.removeEventListener('scroll', handler, passive);
  };
}

/** Сброс скролла в начало (Lenis или нативно). */
export function scrollToTop({ lenis, immediate = true } = {}) {
  if (lenis) {
    lenis.scrollTo(0, { immediate });
    return;
  }
  const wrapper = getScrollWrapper();
  if (wrapper === window) window.scrollTo(0, 0);
  else wrapper.scrollTo(0, 0);
}

/** Скролл + resize (параллакс, scrub, scrollspy). */
export function bindScrollResize(onTick, { lenis } = {}) {
  const unbind = bindScroll(onTick, { lenis });
  const passive = { passive: true };
  onTick();
  window.addEventListener('resize', onTick, passive);
  return () => {
    unbind();
    window.removeEventListener('resize', onTick, passive);
  };
}

/** Якорь / секция — через Lenis inertia или нативный scrollIntoView. */
export function scrollToElement(el, { lenis, immediate = false, block = 'start' } = {}) {
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { immediate });
    return;
  }
  el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block });
}

/** Вертикальный сдвиг на delta px. */
export function scrollByPx(delta, behavior = 'auto', { lenis } = {}) {
  const current = lenis ? lenis.scroll : getScrollY();
  if (lenis) {
    lenis.scrollTo(current + delta, { immediate: behavior === 'auto' });
    return;
  }
  const wrapper = getScrollWrapper();
  if (wrapper === window) window.scrollBy({ top: delta, behavior });
  else wrapper.scrollBy({ top: delta, behavior });
}
