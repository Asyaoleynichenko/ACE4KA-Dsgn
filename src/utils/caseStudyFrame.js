/** Заголовки текстовых блоков, которые дублируют editorial-каркас. */
const DUPLICATE_TITLE =
  /^(контекст|задача|проблема|подход|гипотез|context|problem|task|challenge|approach|hypothes)/i;

function hasSectionMedia(section) {
  return Boolean(
    section?.galleryImage ||
      section?.galleryAboveTitle ||
      section?.galleryBeforeHypotheses ||
      section?.galleryImages?.length ||
      section?.mvpSlides?.length ||
      section?.layout === 'title-info' ||
      section?.layout === 'dual-outcomes',
  );
}

/** До 4 уникальных кадров для коллажа обложки. */
export function collectCaseHeroImages(project, max = 4) {
  const out = [];
  const add = (src) => {
    if (typeof src === 'string' && src && !out.includes(src)) out.push(src);
  };
  add(project?.image);
  for (const section of project?.caseSections ?? []) {
    add(section.galleryAboveTitle);
    add(section.galleryImage);
    add(section.galleryBeforeHypotheses);
    for (const src of section.galleryImages ?? []) add(src);
    for (const slide of section.mvpSlides ?? []) add(slide.image);
  }
  return out.slice(0, max);
}

/** Проблема / подход / гипотезы — один каркас на все кейсы. */
export function getCaseStudyEditorial(project) {
  const ed = project?.caseStudyEditorial;
  const firstPills = (project?.caseSections ?? []).find((s) => s.taskLayout === 'pills' && s.tasks?.length);
  const firstHyps = (project?.caseSections ?? []).find((s) => s.hypotheses?.length);

  const hypotheses = ed?.hypotheses?.length
    ? ed.hypotheses.map((h) => ({
        title: h.id || h.subline || '',
        text: h.statement || h.text || '',
        outcome: h.result || h.outcome || '',
      }))
    : firstHyps?.hypotheses ?? [];

  return {
    contextText: ed?.contextText || project?.problem || project?.context || '',
    approachLabel: ed?.approachLabel || firstPills?.pillsLabel || firstPills?.title || '',
    approachItems: ed?.approachItems?.length ? ed.approachItems : firstPills?.tasks ?? [],
    hypotheses,
  };
}

/**
 * Секции тела без дублей editorial.
 * Индекс исходного массива сохраняется — якоря spy (`body:N`) не ломаются.
 */
export function partitionCaseSections(project) {
  const editorial = project?.caseStudyEditorial;
  const kept = [];
  const skipped = [];

  (project?.caseSections ?? []).forEach((section, index) => {
    const media = hasSectionMedia(section);
    const title = section.title || '';
    const hypOnly = Boolean(section.hideTitle && section.hypotheses?.length && !media);
    const introText = Boolean(editorial && DUPLICATE_TITLE.test(title) && !media && !section.tasks?.length);

    if (hypOnly || introText) {
      skipped.push({ index, section, kind: hypOnly ? 'hyp' : 'text' });
      return;
    }
    kept.push({ index, section });
  });

  return { kept, skipped };
}
