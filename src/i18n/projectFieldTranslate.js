import { resolveMessage } from './resolveMessage.js';

/** Подписи meta из `projects.js` → ключи `projects.metaLabels.*` */
const META_LABEL_KEY = {
  Команда: 'projects.metaLabels.team',
  Год: 'projects.metaLabels.year',
  Роль: 'projects.metaLabels.role',
};

/** Заголовки карточек overview / кейса (RU или EN из данных) → `common.caseStudy.*` */
const CARD_TITLE_KEY = {
  Задача: 'common.caseStudy.task',
  Challenge: 'common.caseStudy.task',
  Решение: 'common.caseStudy.solution',
  Solution: 'common.caseStudy.solution',
  Влияние: 'common.caseStudy.influence',
  Impact: 'common.caseStudy.influence',
  Метрики: 'common.caseStudy.metrics',
  Metrics: 'common.caseStudy.metrics',
  Проблема: 'common.caseStudy.problem',
  Problem: 'common.caseStudy.problem',
  Контекст: 'common.caseStudy.context',
  Context: 'common.caseStudy.context',
  Результат: 'common.caseStudy.result',
  Outcome: 'common.caseStudy.result',
};

const EXT_LINK_KEY = {
  'Перейти на сайт': 'projects.cta.visitSite',
};

export function translateMetaLabel(label, t) {
  const key = META_LABEL_KEY[label];
  return key ? t(key) : label;
}

export function translateCaseCardTitle(title, t) {
  const key = CARD_TITLE_KEY[title];
  return key ? t(key) : title;
}

export function translateExtLinkLabel(label, t) {
  const key = EXT_LINK_KEY[label];
  return key ? t(key) : label;
}

/** Шаблонные заголовки из `projects.js` («Гипотеза 1» …) — на EN показываем `common.caseStudy.hypothesis`. */
const GENERIC_HYPOTHESIS_TITLE_RU = /^гипотеза\s*\d+$/i;

export function hypothesisCardHeading(hypothesis, index, locale, t) {
  const title = hypothesis?.title;
  const fallback = t('common.caseStudy.hypothesis', { n: index + 1 });
  if (locale === 'en') {
    if (title == null || title === '') return fallback;
    if (GENERIC_HYPOTHESIS_TITLE_RU.test(String(title).trim())) return fallback;
    return title;
  }
  return title ?? fallback;
}

/** Строки в `tools[]` из данных — только для EN через `projects.toolStrings` */
export function translateToolLine(line, locale, messages) {
  if (locale !== 'en' || !messages?.projects?.toolStrings) return line;
  const map = messages.projects.toolStrings;
  return typeof map[line] === 'string' ? map[line] : line;
}

/**
 * Интро кейса: в EN — `projects.cards.<slug>.introParas` в `en.json` (массив строк),
 * иначе `project.intro` или `project.lead`.
 */
export function getLocalizedCaseStudyIntroParas(project, locale, messages) {
  const fallback = project.intro?.length ? project.intro : [project.lead];
  if (locale !== 'en' || !messages) return fallback;
  const slug = project.slug;
  const localized = resolveMessage(messages, `projects.cards.${slug}.introParas`);
  if (!Array.isArray(localized)) return fallback;
  const strings = localized.filter((x) => typeof x === 'string' && x.trim());
  return strings.length ? strings : fallback;
}
