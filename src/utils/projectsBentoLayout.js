/**
 * Bento-раскладка страницы проектов.
 * Приоритет: Mail монетизация, медиапроекты Mail, Drop — крупные ячейки.
 */

/** Полный макет (10 карточек, фильтр «Всё»). */
export const BENTO_CELL_BY_SLUG = {
  'mail-monetization': 'hero',
  'mail-nauki': 'stack-a',
  'mail-spetsproekty': 'stack-b',
  drop: 'feature',
  racktables: 'banner',
  neural: 'mid-a',
  biohacking: 'mid-b',
  loochok: 'tile-1',
  retrash: 'tile-2',
  inkz: 'tile-3',
};

/** Порядок важности при фильтрации и упаковке compact-сетки. */
export const BENTO_PRIORITY_SLUGS = [
  'mail-monetization',
  'mail-nauki',
  'mail-spetsproekty',
  'drop',
];

const FULL_LAYOUT_ROLES = Object.values(BENTO_CELL_BY_SLUG);

const ROLE_POOL_BY_COUNT = {
  1: ['hero'],
  2: ['hero', 'feature'],
  3: ['hero', 'stack-a', 'stack-b'],
  4: ['hero', 'stack-a', 'stack-b', 'feature'],
  5: ['hero', 'stack-a', 'stack-b', 'feature', 'banner'],
  6: ['hero', 'stack-a', 'stack-b', 'feature', 'banner', 'mid-a'],
  7: ['hero', 'stack-a', 'stack-b', 'feature', 'banner', 'mid-a', 'mid-b'],
  8: ['hero', 'stack-a', 'stack-b', 'feature', 'banner', 'mid-a', 'mid-b', 'tile-1'],
  9: ['hero', 'stack-a', 'stack-b', 'feature', 'banner', 'mid-a', 'mid-b', 'tile-1', 'tile-2'],
  10: FULL_LAYOUT_ROLES,
};

function sortByPriority(slugs, originalOrder) {
  return [...slugs].sort((a, b) => {
    const pa = BENTO_PRIORITY_SLUGS.indexOf(a);
    const pb = BENTO_PRIORITY_SLUGS.indexOf(b);
    const rankA = pa === -1 ? Number.MAX_SAFE_INTEGER : pa;
    const rankB = pb === -1 ? Number.MAX_SAFE_INTEGER : pb;
    if (rankA !== rankB) return rankA - rankB;
    return originalOrder.indexOf(a) - originalOrder.indexOf(b);
  });
}

function getRolePool(count) {
  return ROLE_POOL_BY_COUNT[count] ?? FULL_LAYOUT_ROLES.slice(0, count);
}

/**
 * Карта slug → CSS-класс ячейки для текущего набора видимых проектов.
 */
export function getBentoLayoutClassMap(visibleSlugs) {
  const total = visibleSlugs.length;
  if (total === 0) return new Map();

  if (total === 10) {
    return new Map(
      visibleSlugs.map((slug) => [
        slug,
        `preview-bento__cell--${BENTO_CELL_BY_SLUG[slug] ?? 'tile-2'}`,
      ]),
    );
  }

  const ordered = sortByPriority(visibleSlugs, visibleSlugs);
  const roles = getRolePool(total);

  return new Map(
    ordered.map((slug, index) => [
      slug,
      `preview-bento__cell--${roles[index] ?? 'tile-2'}`,
    ]),
  );
}

/**
 * Совместимость со старым API (HMR/кэш могли оставить вызов).
 * Для новой логики используйте getBentoLayoutClassMap.
 */
export function getBentoCellClass(index, total, slug) {
  if (total === 10 && BENTO_CELL_BY_SLUG[slug]) {
    return `preview-bento__cell--${BENTO_CELL_BY_SLUG[slug]}`;
  }

  const roles = getRolePool(total);
  const priorityIndex = BENTO_PRIORITY_SLUGS.indexOf(slug);
  if (priorityIndex !== -1 && priorityIndex < roles.length) {
    return `preview-bento__cell--${roles[priorityIndex]}`;
  }

  return `preview-bento__cell--${roles[index] ?? 'tile-2'}`;
}
