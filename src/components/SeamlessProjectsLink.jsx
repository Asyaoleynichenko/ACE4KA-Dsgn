import { forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { withViewTransition } from '../utils/withViewTransition.js';
import { stripLocaleFromPathname } from '../i18n/localePath.js';

/** Строка или объект `to` ведёт на страницу `/projects`. Утилита оставлена для обратной совместимости. */
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
 * Универсальный SmartLink: любой router-переход упаковывается в
 * `document.startViewTransition` через `withViewTransition` — парные элементы
 * с одинаковым `view-transition-name` морфят (Figma «smart animate» для веба).
 *
 * Cmd/Ctrl/Shift/Alt-клик, middle-click, prevent-defaulted onClick — пропускаем
 * штатно через Link, чтобы работало открытие в новой вкладке и т.п.
 *
 * Имя файла/экспорта оставлено `SeamlessProjectsLink` для совместимости с
 * прошлыми импортами (FilterPills); ниже алиас `SmartLink` для нового кода.
 */
const SeamlessProjectsLink = forwardRef(function SeamlessProjectsLink(
  { to, replace, state, onClick, ...rest },
  ref,
) {
  const navigate = useNavigate();

  return (
    <Link
      ref={ref}
      to={to}
      replace={replace}
      state={state}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        withViewTransition(() => {
          navigate(to, { replace, state });
        });
      }}
    />
  );
});

export default SeamlessProjectsLink;

/** Универсальное имя — используем в новом коде. */
export const SmartLink = SeamlessProjectsLink;
