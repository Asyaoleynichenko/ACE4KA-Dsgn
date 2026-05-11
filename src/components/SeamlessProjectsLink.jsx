import { Link, useNavigate } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';

/** Строка или объект `to` ведёт на список проектов `/projects` (включая query), с префиксом `/ru` или `/en`. */
export function isProjectsListingTarget(to) {
  if (typeof to === 'string') {
    const path = to.split('?')[0].split('#')[0];
    return stripLocaleFromPathname(path) === '/projects';
  }
  if (to && typeof to === 'object' && 'pathname' in to) {
    const p = to.pathname ?? '/';
    return stripLocaleFromPathname(p) === '/projects';
  }
  return false;
}

/**
 * Переход на страницу «Все проекты» через View Transitions API — без резкой смены кадра в поддерживаемых браузерах.
 * При prefers-reduced-motion или отсутствии API — обычный Link.
 */
export default function SeamlessProjectsLink({ to, replace, state, onClick, ...rest }) {
  const navigate = useNavigate();

  return (
    <Link
      to={to}
      replace={replace}
      state={state}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function') {
          return;
        }
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!isProjectsListingTarget(to)) return;

        e.preventDefault();
        document.startViewTransition(() => {
          navigate(to, { replace, state });
        });
      }}
    />
  );
}
