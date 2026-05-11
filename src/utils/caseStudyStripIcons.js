/**
 * Соответствие заголовков карточек кейса типу LED-иконки (`CaseStudyCardCornerIcon` + `caseStudyLedPatterns.js`).
 */

function norm(title) {
  return String(title ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Все варианты заголовков из `common.caseStudy.*`, датасета и старых строк */
const STRIP_KIND_BY_TITLE = (() => {
  const e = (pairs) => pairs.flatMap(([labels, kind]) => labels.map((l) => [norm(l), kind]));
  return Object.fromEntries(
    e([
      [['Задача', 'Challenge'], 'task'],
      [['Решение', 'Solution'], 'solution'],
      [['Влияние', 'Impact'], 'influence'],
      [['Метрики', 'Metrics'], 'metrics'],
      [['Проблема', 'Problem'], 'problem'],
      [['Контекст', 'Context'], 'context'],
      [['Результат', 'Outcome'], 'influence'],
    ]),
  );
})();

/**
 * Тип кодовой LED-иконки для заголовка карточки.
 * @returns {'task' | 'solution' | 'influence' | 'metrics' | 'problem' | 'context' | null}
 */
export function caseStudyStripIconKind(title) {
  return STRIP_KIND_BY_TITLE[norm(title)] ?? null;
}
