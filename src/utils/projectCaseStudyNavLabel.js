import { getProjectBySlug } from '../data/projects.js';
import { tWithFallback } from '../i18n/tWithFallback.js';

/** Короткая подпись проекта для шапки кейса: `navShortTitle` → `title` в словаре → meta/title из данных. */
export function projectCaseStudyNavLabel(t, slug) {
  const p = getProjectBySlug(slug);
  const fb = p?.meta ?? p?.title ?? slug;
  return tWithFallback(
    t,
    `projects.cards.${slug}.navShortTitle`,
    tWithFallback(t, `projects.cards.${slug}.title`, fb),
  );
}
