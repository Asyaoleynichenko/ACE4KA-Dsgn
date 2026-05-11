import { projects } from '../data/projects.js';

/** RU-копии карточек берём из `projects.js`, чтобы не дублировать длинные тексты; в `ru.json` можно точечно переопределить slug. */
export function mergeProjectCardsIntoRu(ruJson) {
  const fromData = Object.fromEntries(
    projects.map((p) => [p.slug, { title: p.title, meta: p.meta, desc: p.desc }]),
  );
  return {
    ...ruJson,
    projects: {
      ...(ruJson.projects || {}),
      cards: { ...fromData, ...(ruJson.projects?.cards || {}) },
    },
  };
}
