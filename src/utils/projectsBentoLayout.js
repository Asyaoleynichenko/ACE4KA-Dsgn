/**
 * Раскладка bento под макет портфолио (4 колонки на desktop).
 * На tablet/mobile классы переопределяются в CSS.
 */
export const BENTO_CELL_BY_SLUG = {
  'mail-monetization': 'hero',
  'mail-nauki': 'stack-a',
  'mail-spetsproekty': 'stack-b',
  racktables: 'banner',
  neural: 'mid-a',
  biohacking: 'mid-b',
  drop: 'tile-1',
  loochok: 'tile-2',
  retrash: 'tile-3',
  inkz: 'tile-4',
};

/** Упрощённые раскладки при фильтре (мало карточек). */
function fallbackClass(index, total) {
  if (total <= 0) return 'default';
  if (total === 1) return 'solo';
  if (total === 2) return index === 0 ? 'duo-a' : 'duo-b';
  if (total === 3) return ['hero', 'stack-a', 'stack-b'][index] ?? 'tile-2';
  if (total === 4) return ['hero', 'stack-a', 'stack-b', 'banner'][index] ?? 'tile-2';
  return 'tile-2';
}

export function getBentoCellClass(index, total, slug) {
  if (BENTO_CELL_BY_SLUG[slug]) {
    return `preview-bento__cell--${BENTO_CELL_BY_SLUG[slug]}`;
  }
  return `preview-bento__cell--${fallbackClass(index, total)}`;
}
