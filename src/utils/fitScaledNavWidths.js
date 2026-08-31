/**
 * Подгоняет ширину .nav-link/.logo/.lang-switch к visible-ширине внутреннего span
 * (т.к. transform: scaleX оставляет layout-бокс на полную unscaled-ширину → визуальные
 * гэпы между пунктами получаются неравные).
 *
 * Алгоритм:
 *   1) Сохраняем natural-ширину span (без transform-влияния — offsetWidth).
 *   2) Читаем актуальное значение --tc-scale-x из computed style span'а.
 *   3) Записываем width = natural * scale на родителя.
 *   4) Пересчитываем на resize, изменение route (active-стейт другой), focus/hover (тоже scale меняется).
 *
 * Возвращает функцию cleanup.
 */
export function fitScaledNavWidths(root = document) {
  if (typeof window === 'undefined' || !root) return () => {};

  const MOBILE_DRAWER_MQ = '(max-width: 56.25rem)';

  const SELECTORS = [
    '.header .nav-list .nav-link',
    '.header .logo',
    '.header .lang-switch',
  ];

  const getSpan = (host) => {
    if (host.matches?.('.header .lang-switch')) {
      return host.querySelector('.lang-switch__toggle-row');
    }
    return host.querySelector(':scope > span');
  };

  const naturalByEl = new WeakMap();

  const measureNatural = (host) => {
    const span = getSpan(host);
    if (!span) return 0;
    /* Временно сбрасываем width родителя и transform span'а, чтобы получить unscaled offsetWidth. */
    const prevHostWidth = host.style.width;
    const prevTransform = span.style.transform;
    host.style.width = 'auto';
    span.style.transform = 'none';
    /* force reflow */
    const natural = span.offsetWidth;
    host.style.width = prevHostWidth;
    span.style.transform = prevTransform;
    naturalByEl.set(host, natural);
    return natural;
  };

  const apply = (host) => {
    const span = getSpan(host);
    if (!span) return;
    host.style.width = 'auto';
    const visual = span.getBoundingClientRect().width;
    if (visual > 0) {
      host.style.width = `${Math.ceil(visual)}px`;
    }
  };

  const applyAll = () => {
    const mobileMenu = window.matchMedia(MOBILE_DRAWER_MQ).matches;
    const menuOpen = root.querySelector?.('.header--menu-open') != null;

    if (mobileMenu || menuOpen) {
      SELECTORS.forEach((sel) => {
        root.querySelectorAll(sel).forEach((host) => {
          host.style.width = '';
        });
      });
      return;
    }
    SELECTORS.forEach((sel) => {
      root.querySelectorAll(sel).forEach((host) => {
        if (!naturalByEl.has(host)) measureNatural(host);
        apply(host);
      });
    });
  };

  /* Двойной rAF: дать браузеру отрисовать первый кадр перед измерением. */
  let rafId = 0;
  const schedule = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        applyAll();
      });
    });
  };

  schedule();

  /* На resize пересчитать (font-size может меняться через clamp/vw). */
  const onResize = () => {
    SELECTORS.forEach((sel) => {
      root.querySelectorAll(sel).forEach((host) => measureNatural(host));
    });
    applyAll();
  };
  window.addEventListener('resize', onResize, { passive: true });

  /* Открытие/закрытие мобильного меню — сброс inline-width у лого. */
  const headerEl = root.querySelector?.('.header') ?? document.querySelector('.header');
  const menuObserver =
    headerEl &&
    new MutationObserver(() => {
      applyAll();
    });
  if (menuObserver && headerEl) {
    menuObserver.observe(headerEl, { attributes: true, attributeFilter: ['class'] });
  }

  /* На hover/focus у элементов меняется --tc-scale-x — перечитать и применить. */
  const allHosts = () =>
    SELECTORS.flatMap((sel) => Array.from(root.querySelectorAll(sel)));
  const interactionHandler = (e) => {
    const target = e.target.closest?.(SELECTORS.join(','));
    if (target) {
      /* После CSS-transition-кадра scaleX-значение в computedStyle обновится — даём 1 тик. */
      requestAnimationFrame(() => apply(target));
    }
  };
  document.addEventListener('mouseover', interactionHandler, { passive: true });
  document.addEventListener('mouseout', interactionHandler, { passive: true });
  document.addEventListener('focusin', interactionHandler, { passive: true });
  document.addEventListener('focusout', interactionHandler, { passive: true });

  /* Mutation Observer — на смену route (active меняется) или замену контента. */
  const mo = new MutationObserver(() => {
    naturalByEl && allHosts().forEach((h) => measureNatural(h));
    applyAll();
  });
  const header = root.querySelector?.('.header') ?? document.querySelector('.header');
  if (header) {
    mo.observe(header, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('mouseover', interactionHandler);
    document.removeEventListener('mouseout', interactionHandler);
    document.removeEventListener('focusin', interactionHandler);
    document.removeEventListener('focusout', interactionHandler);
    mo.disconnect();
    menuObserver?.disconnect();
    allHosts().forEach((h) => {
      h.style.width = '';
    });
  };
}
