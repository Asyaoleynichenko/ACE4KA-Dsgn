import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from './ProjectCard.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { projectMatchesFilter } from '../data/projectFilterTags.js';

/** Сетка проектов (Figma 1:297): две колонки, фильтр через query `?filter=`. */
export default function ProjectsGrid({ slugs, resolveProject, className = '', ...gridProps }) {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') ?? 'vsyo';

  const visibleSlugs = useMemo(
    () => slugs.filter((slug) => projectMatchesFilter(slug, filter)),
    [slugs, filter],
  );

  if (visibleSlugs.length === 0) {
    return (
      <div
        className={`preview-grid preview-grid--empty${className ? ` ${className}` : ''}`}
        role="list"
        aria-live="polite"
        {...gridProps}
      >
        <p className="preview-grid__empty">{t('projectsPage.emptyFilter')}</p>
      </div>
    );
  }

  return (
    <div
      className={`preview-grid${className ? ` ${className}` : ''}`}
      role="list"
      aria-live="polite"
      {...gridProps}
    >
      {visibleSlugs.map((slug) => {
        const p = resolveProject(slug);
        if (!p) return null;
        return (
          <ProjectCard
            key={slug}
            slug={slug}
            title={tWithFallback(t, `projects.cards.${slug}.title`, p.title)}
            meta={tWithFallback(t, `projects.cards.${slug}.meta`, p.meta)}
            desc={tWithFallback(t, `projects.cards.${slug}.desc`, p.desc)}
            image={p.cardImage ?? p.image}
            video={p.video}
            isDemo={false}
          />
        );
      })}
    </div>
  );
}
