import ProjectCard from '../components/ProjectCard';
import FilterPills from '../components/FilterPills';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { projects } from '../data/projects';

export default function ProjectsPage() {
  const { t } = useI18n();

  return (
    <div className="page-projects__wrap" data-node-id="89-346" data-name="Все проекты" data-figma-node="89-346">
      <div className="logo-section" data-node-id="1:286">
        <h1 className="projects-title-main" data-node-id="1:289">{t('projectsPage.title')}</h1>
        <FilterPills />
      </div>

      <div className="preview-grid" data-node-id="1:297" data-figma-node="1-297">
        {projects.map((p) => (
          <ProjectCard
            key={p.slug}
            slug={p.slug}
            title={tWithFallback(t, `projects.cards.${p.slug}.title`, p.title)}
            meta={tWithFallback(t, `projects.cards.${p.slug}.meta`, p.meta)}
            desc={tWithFallback(t, `projects.cards.${p.slug}.desc`, p.desc)}
            image={p.image}
            isDemo={false}
          />
        ))}
      </div>
    </div>
  );
}
