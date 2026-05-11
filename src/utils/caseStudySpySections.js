/** Короткая подпись для оглавления spy-scroll (кейсы). */
export function truncateSpyLabel(text, maxLen = 38) {
  const t = String(text ?? '').trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
}

function sectionLabel(section, index) {
  if (section.title && !section.hideTitle) {
    return truncateSpyLabel(section.title.replace(/:\s*$/, ''));
  }
  if (section.layout === 'dual-outcomes' && section.columns?.length) {
    const t = section.columns.map((c) => c.title).filter(Boolean)[0];
    if (t) return truncateSpyLabel(t);
  }
  if (section.hypotheses?.length) return 'Гипотезы';
  if (section.mvpSlides?.length > 0) return 'Слайды';
  if (section.layout === 'title-info') return truncateSpyLabel(section.title ?? 'Раздел');
  return `Раздел ${index + 1}`;
}

/**
 * Пункты оглавления в порядке следования в DOM (совпадает с разметкой ProjectDetailPage).
 */
export function buildCaseStudySpySections(project) {
  const slug = project.slug;
  const prefix = `case-${slug}`;
  const items = [];

  items.push({ id: `${prefix}-hero`, label: 'Обложка' });
  items.push({ id: `${prefix}-intro`, label: 'О проекте' });
  items.push({ id: `${prefix}-overview`, label: 'В кейсе' });

  if (project.showNarrative && (project.context || project.problem)) {
    items.push({ id: `${prefix}-narrative`, label: 'Контекст' });
  }

  const caseImages = project.caseStudyImages || {};
  const hasCompare = Boolean(caseImages.before || caseImages.after);
  const sections = project.caseSections ?? [];

  sections.forEach((section, i) => {
    items.push({
      id: `${prefix}-body-${i}`,
      label: sectionLabel(section, i),
    });
    if (i === 0 && hasCompare) {
      items.push({ id: `${prefix}-compare`, label: 'До / после' });
    }
  });

  return items;
}
