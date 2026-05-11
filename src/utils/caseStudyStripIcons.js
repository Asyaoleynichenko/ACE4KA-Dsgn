import { publicUrl } from './publicUrl.js';

const SRC = {
  task: publicUrl('/images/icons/card-task.png'),
  solution: publicUrl('/images/icons/card-solution.png'),
  influence: publicUrl('/images/icons/card-influence.png'),
  metrics: publicUrl('/images/icons/card-metrics.png'),
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
      // В макетах четвёртая иконка из того же набора; отдельного экспорта «Проблема» пока нет — визуально ближе «Влияние»
      [['Проблема', 'Problem'], SRC.influence],
      [['Контекст', 'Context'], SRC.influence],
      [['Результат', 'Outcome'], SRC.influence],
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
