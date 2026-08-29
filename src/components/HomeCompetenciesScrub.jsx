import { useCallback } from 'react';
import { COMPETENCIES_HEADING_ORDER } from '../data/competenciesHeadingOrder.js';
import { HOME_PROJECT_SLUGS, homeProjectsCatalog } from '../data/homeProjectsCatalog.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { asArray } from '../utils/asArray.js';
import ProjectCard from './ProjectCard.jsx';

function chunkSlugsForLines(lineCount, homeSlugs) {
  if (!lineCount || !homeSlugs?.length) return [];
  const out = [];
  for (let i = 0; i < lineCount; i += 1) {
    const a = homeSlugs[(i * 2) % homeSlugs.length];
    const b = homeSlugs[(i * 2 + 1) % homeSlugs.length];
    out.push([a, b].filter(Boolean));
  }
  return out;
}

/**
 * Главная — один блок компетенций (Figma 592:38775): две карточки, стопка строк, CTA.
 * Без GSAP-pin: pin-spacer рисовал второй такой же блок на полном скрине.
 */
export default function HomeCompetenciesScrub({
  lines: linesProp,
  lineProjectSlugs,
  homeProjectSlugs = HOME_PROJECT_SLUGS,
  ariaLabel,
  children,
}) {
  const { t } = useI18n();
  const lines = asArray(linesProp);
  const slugRows =
    Array.isArray(lineProjectSlugs) && lineProjectSlugs.length === lines.length
      ? lineProjectSlugs
      : chunkSlugsForLines(lines.length, homeProjectSlugs);

  const resolveProject = useCallback(
    (slug) => homeProjectsCatalog.find((p) => p.slug === slug) || null,
    [],
  );

  const activeProjects = (slugRows[0] ?? []).map(resolveProject).filter(Boolean);

  return (
    <div className="home-competencies-scrub home-competencies-scrub--static home-competencies-scrub--static-block">
      <div className="home-competencies__panel">
        <div className="home-competencies__inner home-competencies__inner--scrub">
          <div className="home-competencies-scrub__content">
            <div className="home-competencies-scrub__stack" role="region" aria-label={ariaLabel}>
              <div className="home-competencies-scrub__stage">
                <div
                  className="home-competencies-scrub__floats"
                  aria-hidden={activeProjects.length === 0}
                >
                  {activeProjects.map((item, idx) => (
                    <div
                      key={item.slug}
                      className={`home-competencies-scrub__float${idx === 0 ? ' home-competencies-scrub__float--tl' : ' home-competencies-scrub__float--br'}`}
                    >
                      <div className="home-competencies-scrub__card-wrap">
                        <ProjectCard
                          slug={item.slug}
                          title={tWithFallback(t, `projects.cards.${item.slug}.title`, item.title)}
                          meta={tWithFallback(t, `projects.cards.${item.slug}.meta`, item.meta)}
                          desc={tWithFallback(t, `projects.cards.${item.slug}.desc`, item.desc)}
                          image={item.image}
                          isDemo={false}
                          variant="overlay"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="home-competencies-scrub__center">
                  <div className="home-competencies-scrub__lines">
                    {lines.map((line, i) => (
                      <div
                        key={line}
                        className={`home-competencies-scrub__line-wrap${i === 0 ? ' is-active' : ''}`}
                        data-heading={COMPETENCIES_HEADING_ORDER[i] ?? 3}
                      >
                        <p className="home-competencies__line home-competencies-scrub__line">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
