/** Повторяющийся паттерн ячеек bento (4-колоночная сетка на desktop). */
const BENTO_PATTERN = [
  'preview-bento__cell--feature',
  'preview-bento__cell--default',
  'preview-bento__cell--default',
  'preview-bento__cell--wide',
  'preview-bento__cell--default',
  'preview-bento__cell--tall',
];

/**
 * Класс размера ячейки по индексу в отфильтрованном списке.
 * При малом числе карточек — упрощённые раскладки.
 */
export function getBentoCellClass(index, total) {
  if (total <= 0) return 'preview-bento__cell--default';
  if (total === 1) return 'preview-bento__cell--solo';
  if (total === 2) {
    return index === 0 ? 'preview-bento__cell--duo-primary' : 'preview-bento__cell--duo-secondary';
  }
  if (total === 3) {
    return ['preview-bento__cell--feature', 'preview-bento__cell--default', 'preview-bento__cell--default'][
      index
    ];
  }
  return BENTO_PATTERN[index % BENTO_PATTERN.length];
}
