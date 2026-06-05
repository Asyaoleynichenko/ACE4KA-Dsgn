import FilterPills from '../components/FilterPills';
import ProjectsGrid from '../components/ProjectsGrid';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { CASE_STUDY_PAGE_GROUPS, projects } from '../data/projects';

const PROJECTS_PAGE_SLUGS = CASE_STUDY_PAGE_GROUPS.flatMap((group) => group.slugs);

function projectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

export default function ProjectsPage() {
  const { t } = useI18n();

  return (
    <div className="page-projects__wrap" data-node-id="89-346" data-name="Все проекты" data-figma-node="89-346">
      <div className="logo-section" data-node-id="1:286">
        <h1
          className="projects-title-main"
          data-node-id="1:289"
          data-type-reveal="cinematic"
          data-type-reveal-trigger="scroll"
          data-type-reveal-split="lines"
          data-type-reveal-stagger="0.08"
        >
          {t('projectsPage.title')}
        </h1>
        <FilterPills />
      </div>

      <ProjectsGrid
        slugs={PROJECTS_PAGE_SLUGS}
        resolveProject={projectBySlug}
        data-node-id="1:297"
        data-figma-node="1-297"
      />
    </div>
  );
}
