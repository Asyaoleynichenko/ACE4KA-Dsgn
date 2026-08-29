import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
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
 * Router Link без перехвата клика. View Transition раньше вызывал preventDefault
 * и глотал переход, если callback не отрабатывал — кнопка «Все проекты» не вела на список.
 */
const SeamlessProjectsLink = forwardRef(function SeamlessProjectsLink(
  { to, replace, state, onClick, ...rest },
  ref,
) {
  return (
    <Link ref={ref} to={to} replace={replace} state={state} onClick={onClick} {...rest} />
  );
});

export default SeamlessProjectsLink;

/** Универсальное имя — используем в новом коде. */
export const SmartLink = SeamlessProjectsLink;
