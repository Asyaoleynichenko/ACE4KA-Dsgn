import ProjectCard from '../components/ProjectCard';
import FilterPills from '../components/FilterPills';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { CASE_STUDY_PAGE_GROUPS, projects } from '../data/projects';

function projectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

export default function ProjectsPage() {
  const { t } = useI18n();

  return (
    <div className="page-projects__wrap" data-node-id="89-346" data-name="Все проекты" data-figma-node="89-346">
      <div className="logo-section" data-node-id="1:286">
        <h1 className="projects-title-main" data-node-id="1:289">
          {t('projectsPage.title')}
        </h1>
        <FilterPills />
      </div>

      <div className="projects-page__groups">
        {CASE_STUDY_PAGE_GROUPS.map((group) => (
          <section key={group.id} className="projects-page__group" aria-labelledby={`projects-group-${group.id}`}>
            <h2 id={`projects-group-${group.id}`} className="projects-page__group-title">
              {t(`projectsPage.groups.${group.id}.title`)}
            </h2>
            <p className="projects-page__group-intro">{t(`projectsPage.groups.${group.id}.intro`)}</p>
            <div className="preview-grid" data-node-id="1:297" data-figma-node="1-297">
              {group.slugs.map((slug) => {
                const p = projectBySlug(slug);
                if (!p) return null;
                return (
                  <ProjectCard
                    key={slug}
                    slug={slug}
                    title={tWithFallback(t, `projects.cards.${slug}.title`, p.title)}
                    meta={tWithFallback(t, `projects.cards.${slug}.meta`, p.meta)}
                    desc={tWithFallback(t, `projects.cards.${slug}.desc`, p.desc)}
                    image={p.image}
                    isDemo={false}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
