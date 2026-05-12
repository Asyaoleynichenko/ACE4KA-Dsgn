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

function sectionLabel(section, index, tr) {
  const t = typeof tr === 'function' ? tr : (k) => k;
  if (section.title && !section.hideTitle) {
    return truncateSpyLabel(section.title.replace(/:\s*$/, ''));
  }
  if (section.layout === 'dual-outcomes' && section.columns?.length) {
    const colTitle = section.columns.map((c) => c.title).filter(Boolean)[0];
    if (colTitle) return truncateSpyLabel(colTitle);
  }
  if (section.hypotheses?.length) return t('projects.spy.hypotheses');
  if (section.mvpSlides?.length > 0) return t('projects.spy.slides');
  if (section.layout === 'title-info') {
    return truncateSpyLabel(section.title ?? t('projects.spy.unnamedSection'));
  }
  return t('projects.spy.section', { n: index + 1 });
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
 * Для EN подставляется `messages.projects.outlines` (см. `en.caseStudyOutlines.json`).
 */
export function buildCaseStudySpySections(project, i18n = {}) {
  const { t = (k) => k, locale, messages } = i18n;
  const slug = project.slug;
  const outlineEn = locale === 'en' && messages?.projects?.outlines?.[slug];
  const outline = outlineEn || CASE_STUDY_NAV_OUTLINES[slug];
  if (outline) {
    return buildFromOutline(slug, outline);
  }

  const prefix = `case-${slug}`;
  const items = [];

  items.push({ id: `${prefix}-hero`, label: t('projects.spy.cover'), level: 1 });
  items.push({ id: `${prefix}-intro`, label: t('projects.spy.about'), level: 1 });
  items.push({ id: `${prefix}-overview`, label: t('projects.spy.inCase'), level: 1 });

  if (project.showNarrative && (project.context || project.problem)) {
    items.push({ id: `${prefix}-narrative`, label: t('projects.spy.narrative'), level: 1 });
  }

  const caseImages = project.caseStudyImages || {};
  const hasCompare = Boolean(caseImages.before || caseImages.after);
  const sections = project.caseSections ?? [];

  sections.forEach((section, i) => {
    items.push({
      id: `${prefix}-body-${i}`,
      label: sectionLabel(section, i, t),
      level: 2,
    });
    if (i === 0 && hasCompare) {
      items.push({ id: `${prefix}-compare`, label: t('projects.spy.compare'), level: 2 });
    }
  });

  return items;
}
