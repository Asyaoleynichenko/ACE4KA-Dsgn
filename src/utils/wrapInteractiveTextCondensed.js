const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  '[role="button"]:not([disabled])',
  'summary',
].join(',');

/** Не трогаем узлы со своей разметкой condensed / спец. анимацией. */
const SKIP_CLOSEST = [
  '[data-no-text-condensed]',
  '.text-condensed',
  '.text-condensed--single-line',
  '.filter-pill',
  '.btn-show-all',
  '.header .nav-list .nav-link',
  '.case-study-rail__dash-hit',
  '.lang-switch',
  '.projects-list-nav',
].join(',');

function shouldSkip(el) {
  if (!(el instanceof HTMLElement)) return true;
  if (el.dataset.noTextCondensed === 'true') return true;
  if (el.matches('.filter-pill, .btn-show-all, .case-study-rail__dash-hit')) return true;
  if (el.closest('.header .nav-list .nav-link, .lang-switch, .projects-list-nav, [data-no-text-condensed]')) {
    return true;
  }
  if (el.closest('.text-condensed, .text-condensed--single-line')) return true;
  if (el.querySelector(':scope > .text-condensed, :scope > .text-condensed--single-line')) {
    return true;
  }
  return false;
}

function wrapDirectTextNodes(el) {
  const textNodes = [...el.childNodes].filter(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );
  if (!textNodes.length) return false;

  textNodes.forEach((node) => {
    const span = document.createElement('span');
    span.className = 'text-condensed';
    node.parentNode?.insertBefore(span, node);
    span.appendChild(node);
  });

  el.dataset.textCondensedWrapped = '1';
  return true;
}

/**
 * Оборачивает прямой текст интерактивных элементов в `.text-condensed`
 * для единой hover/focus-анимации scaleX.
 */
export function wrapInteractiveTextCondensed(root = document) {
  if (typeof document === 'undefined') return () => {};

  const scope = root instanceof Document ? root.body : root;
  if (!scope?.querySelectorAll) return () => {};

  scope.querySelectorAll(INTERACTIVE_SELECTOR).forEach((el) => {
    if (shouldSkip(el)) return;
    wrapDirectTextNodes(el);
  });

  return () => {};
}
