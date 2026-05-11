/** Префикс имени для View Transitions — пара «карточка ↔ герой кейса». */
export const PROJECT_HERO_VT_PREFIX = 'project-hero';

export function projectHeroViewTransitionName(slug) {
  if (!slug || typeof slug !== 'string') return '';
  return `${PROJECT_HERO_VT_PREFIX}-${slug}`;
}

export function setProjectHeroVtName(el, slug) {
  if (!el) return;
  const name = projectHeroViewTransitionName(slug);
  if (name) {
    el.style.setProperty('view-transition-name', name);
  } else {
    el.style.removeProperty('view-transition-name');
  }
}
