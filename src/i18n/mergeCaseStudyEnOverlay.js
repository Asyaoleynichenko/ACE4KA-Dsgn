/**
 * Сливает частичный EN-оверлей с проектом из `projects.js` (только `layout: 'case-study'`).
 * Массивы объектов (caseSections, hypotheses, columns, mvpSlides) — по индексу;
 * массивы строк (tasks и т.п.) — целиком заменяются значением из оверлея.
 */

function mergeTopCards(base, patch) {
  if (!Array.isArray(base) || !Array.isArray(patch)) return base;
  return base.map((c, i) => (patch[i] && typeof patch[i] === 'object' ? { ...c, ...patch[i] } : c));
}

function mergeMetaItems(base, patch) {
  if (!Array.isArray(base) || !Array.isArray(patch)) return base;
  return base.map((c, i) => (patch[i] && typeof patch[i] === 'object' ? { ...c, ...patch[i] } : c));
}

function mergeSection(base, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return base;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    const p = patch[k];
    const b = base[k];
    if (p === undefined) continue;
    if (k === 'hypotheses' && Array.isArray(p) && Array.isArray(b)) {
      out[k] = b.map((h, i) => (p[i] && typeof p[i] === 'object' ? { ...h, ...p[i] } : h));
    } else if (k === 'columns' && Array.isArray(p) && Array.isArray(b)) {
      out[k] = b.map((col, i) => (p[i] && typeof p[i] === 'object' ? mergeSection(col, p[i]) : col));
    } else if (k === 'mvpSlides' && Array.isArray(p) && Array.isArray(b)) {
      out[k] = b.map((slide, i) => (p[i] && typeof p[i] === 'object' ? { ...slide, ...p[i] } : slide));
    } else if (k === 'nestedAfterPills' && p && typeof p === 'object' && !Array.isArray(p)) {
      out[k] = { ...b, ...p };
    } else if (k === 'blockCards' && p && typeof p === 'object' && !Array.isArray(p)) {
      out[k] = { ...b, ...p };
    } else if (k === 'ctaLink' && p && typeof p === 'object' && !Array.isArray(p)) {
      out[k] = { ...b, ...p };
    } else if (Array.isArray(p) && (typeof p[0] === 'string' || p.length === 0)) {
      out[k] = p;
    } else if (p && typeof p === 'object' && !Array.isArray(p) && b && typeof b === 'object' && !Array.isArray(b)) {
      out[k] = mergeSection(b, p);
    } else {
      out[k] = p;
    }
  }
  return out;
}

function mergeCaseSections(baseSections, patchSections) {
  if (!Array.isArray(baseSections) || !Array.isArray(patchSections)) return baseSections;
  return baseSections.map((sec, i) => mergeSection(sec, patchSections[i]));
}

function deepMergeCaseStudyProject(base, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return base;
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    const pv = patch[key];
    const bv = base[key];
    if (pv === undefined) continue;
    if (key === 'caseSections' && Array.isArray(pv) && Array.isArray(bv)) {
      out[key] = mergeCaseSections(bv, pv);
    } else if (key === 'topCards' && Array.isArray(pv) && Array.isArray(bv)) {
      out[key] = mergeTopCards(bv, pv);
    } else if (key === 'metaItems' && Array.isArray(pv) && Array.isArray(bv)) {
      out[key] = mergeMetaItems(bv, pv);
    } else if (Array.isArray(pv)) {
      out[key] = pv;
    } else if (pv && typeof pv === 'object' && !Array.isArray(pv) && bv && typeof bv === 'object' && !Array.isArray(bv)) {
      out[key] = deepMergeCaseStudyProject(bv, pv);
    } else {
      out[key] = pv;
    }
  }
  return out;
}

/**
 * @param {import('../data/projects.js').projects[number]} project
 * @param {string} locale
 * @param {Record<string, object>} overlaysBySlug
 */
export function applyCaseStudyEnglishOverlay(project, locale, overlaysBySlug) {
  if (locale !== 'en' || !overlaysBySlug || project?.layout !== 'case-study') return project;
  const overlay = overlaysBySlug[project.slug];
  if (!overlay || typeof overlay !== 'object') return project;
  return deepMergeCaseStudyProject(project, overlay);
}
