import { publicUrl } from './publicUrl.js';

const SRC = {
  task: publicUrl('/images/icons/card-task.png'),
  solution: publicUrl('/images/icons/card-solution.png'),
  influence: publicUrl('/images/icons/card-influence.png'),
  metrics: publicUrl('/images/icons/card-metrics.png'),
};

/** Кодовые LED-иконки в карточках кейса — см. `CaseStudyCardCornerIcon` + `caseStudyLedPatterns.js` */
const KIND = {
  task: 'task',
  solution: 'solution',
  influence: 'influence',
  metrics: 'metrics',
  /** Figma `430:27691` — «Проблема» в блоке 300:107895 */
  problem: 'problem',
  /** Figma `430:29004` — тот же SVG, что `nav-icon-430-29004.svg` */
  context: 'context',
};

function norm(title) {
  return String(title ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Все варианты заголовков из `common.caseStudy.*`, датасета и старых строк */
const STRIP_ICON_BY_TITLE = (() => {
  const e = (pairs) => pairs.flatMap(([labels, src]) => labels.map((l) => [norm(l), src]));
  return Object.fromEntries(
    e([
      [['Задача', 'Challenge'], SRC.task],
      [['Решение', 'Solution'], SRC.solution],
      [['Влияние', 'Impact'], SRC.influence],
      [['Метрики', 'Metrics'], SRC.metrics],
      [['Проблема', 'Problem'], SRC.solution],
      [['Контекст', 'Context'], publicUrl('/images/icons/nav-icon-430-29004.svg')],
      [['Результат', 'Outcome'], SRC.influence],
    ]),
  );
})();

const STRIP_KIND_BY_TITLE = (() => {
  const e = (pairs) => pairs.flatMap(([labels, kind]) => labels.map((l) => [norm(l), kind]));
  return Object.fromEntries(
    e([
      [['Задача', 'Challenge'], KIND.task],
      [['Решение', 'Solution'], KIND.solution],
      [['Влияние', 'Impact'], KIND.influence],
      [['Метрики', 'Metrics'], KIND.metrics],
      [['Проблема', 'Problem'], KIND.influence],
      [['Контекст', 'Context'], KIND.influence],
      [['Результат', 'Outcome'], KIND.influence],
    ]),
  );
})();

/**
 * Декоративная иконка угла карточки в ленте ScrollScrubRow (кейс).
 * @param {string | undefined} title — как в `h3`
 * @returns {string | null}
 */
export function caseStudyStripIconSrc(title) {
  return STRIP_ICON_BY_TITLE[norm(title)] ?? null;
}

/**
 * Тип кодовой LED-иконки для заголовка карточки.
 * @returns {'task' | 'solution' | 'influence' | 'metrics' | 'problem' | 'context' | null}
 */
export function caseStudyStripIconKind(title) {
  return STRIP_KIND_BY_TITLE[norm(title)] ?? null;
}
