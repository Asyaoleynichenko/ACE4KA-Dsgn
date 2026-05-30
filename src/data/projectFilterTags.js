/** Теги фильтров (`FilterPills` → `?filter=`) для кейсов портфолио. */
export const PROJECT_FILTER_TAGS = {
  'mail-monetization': ['uxui'],
  'mail-nauki': ['uxui'],
  racktables: ['uxui', 'inprogress'],
  'mail-spetsproekty': ['grafika', 'uxui'],
  neural: ['grafika'],
  biohacking: ['grafika'],
  drop: ['uxui', 'issledovaniya'],
  loochok: ['uxui'],
  retrash: ['grafika', 'shtuki'],
  inkz: ['uxui', 'issledovaniya'],
};

export function projectMatchesFilter(slug, filter) {
  if (!filter || filter === 'vsyo') return true;
  const tags = PROJECT_FILTER_TAGS[slug];
  return Array.isArray(tags) && tags.includes(filter);
}
