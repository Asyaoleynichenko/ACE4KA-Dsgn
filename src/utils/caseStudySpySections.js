import { CASE_STUDY_NAV_OUTLINES } from '../data/caseStudyNavigationOutlines.js';

/** Короткая подпись для оглавления spy-scroll (кейсы). */
export function truncateSpyLabel(text, maxLen = 38) {
  const t = String(text ?? '').trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
}

/** Якорь по слагу и цели: body:2, body:2:hyp, intro, … */
export function resolveCaseSpyTargetId(slug, target) {
  const prefix = `case-${slug}`;
  if (target === 'hero') return `${prefix}-hero`;
  if (target === 'intro') return `${prefix}-intro`;
  if (target === 'overview') return `${prefix}-overview`;
  if (target === 'narrative') return `${prefix}-narrative`;
  if (target === 'compare') return `${prefix}-compare`;
  const hyp = /^body:(\d+):hyp$/.exec(target);
  if (hyp) return `${prefix}-body-${hyp[1]}-hyp`;
  const body = /^body:(\d+)$/.exec(target);
  if (body) return `${prefix}-body-${body[1]}`;
  if (typeof target === 'string' && target.startsWith(`${prefix}-`)) return target;
  return `${prefix}-intro`;
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

function buildFromOutline(slug, outline) {
  const rows = [];
  if (outline.chapterTitle) {
    rows.push({
      id: null,
      chapterTitle: outline.chapterTitle,
      level: 1,
    });
  }
  for (const item of outline.items ?? []) {
    rows.push({
      id: resolveCaseSpyTargetId(slug, item.target),
      keyword: item.keyword,
      caption: item.caption,
      level: item.level ?? 2,
    });
  }
  return rows;
}

/**
 * Пункты оглавления в порядке следования в DOM (совпадает с разметкой ProjectDetailPage).
 * Для кейсов из CASE_STUDY_NAV_OUTLINES — структура «глава + ключ — пояснение».
 */
export function buildCaseStudySpySections(project) {
  const slug = project.slug;
  const outline = CASE_STUDY_NAV_OUTLINES[slug];
  if (outline) {
    return buildFromOutline(slug, outline);
  }

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
