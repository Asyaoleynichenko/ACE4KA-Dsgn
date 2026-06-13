/** Префикс имени для View Transitions — пара «карточка ↔ герой кейса». */
export const PROJECT_HERO_VT_PREFIX = 'project-hero';

export function projectHeroViewTransitionName(slug) {
  if (!slug || typeof slug !== 'string') return '';
  return `${PROJECT_HERO_VT_PREFIX}-${slug}`;
}

/** Не задаём view-transition-name: морф карточка → hero даёт огромное полупрозрачное фото поверх контента (как persona-морфы). */
export function setProjectHeroVtName(el, slug) {
  if (!el) return;
  el.style.removeProperty('view-transition-name');
}
