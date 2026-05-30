import { flushSync } from 'react-dom';

/**
 * Оборачивает синхронное обновление состояния (роутер-навигацию, setState и т.п.)
 * в `document.startViewTransition(...)`, чтобы браузер смог сыграть native
 * View Transitions между парами элементов с одинаковым `view-transition-name`
 * (например, обложка карточки в `.preview-bento` и hero на `ProjectDetailPage`).
 *
 * Если API недоступен или пользователь предпочитает reduced motion — просто
 * выполняем обновление без анимации.
 */
export function withViewTransition(updateFn) {
  if (typeof updateFn !== 'function') return null;

  const supported =
    typeof document !== 'undefined' && typeof document.startViewTransition === 'function';

  const reducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supported || reducedMotion) {
    updateFn();
    return null;
  }

  return document.startViewTransition(() => {
    flushSync(() => {
      updateFn();
    });
  });
}
