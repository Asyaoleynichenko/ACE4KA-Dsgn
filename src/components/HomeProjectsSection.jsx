import ProjectCard from './ProjectCard.jsx';
import FilterPills from './FilterPills';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { homeProjectsCatalog } from '../data/homeProjectsCatalog.js';

export default function HomeProjectsSection() {
  const { t } = useI18n();

  return (
    <section
      className="section section-projects"
      data-node-id="1:285"
      data-figma-node="1-285"
    >
      <div className="logo-section" data-node-id="1:286">
        <h2
          className="projects-title-main"
          data-node-id="1:289"
          data-scale="section-title"
          data-type-reveal="cinematic"
          data-type-reveal-trigger="scroll"
          data-type-reveal-split="lines"
        >
          {t('hero.projectsSectionTitle')}
        </h2>
        <FilterPills />
      </div>
      <div className="preview-grid" data-node-id="1:297" data-figma-node="1-297" data-reveal-group="">
        {homeProjectsCatalog.map((item) => (
          <ProjectCard
            key={item.slug}
            slug={item.slug}
            title={tWithFallback(t, `projects.cards.${item.slug}.title`, item.title)}
            meta={tWithFallback(t, `projects.cards.${item.slug}.meta`, item.meta)}
            desc={tWithFallback(t, `projects.cards.${item.slug}.desc`, item.desc)}
            image={item.image}
            video={item.video}
            isDemo={false}
          />
        ))}
      </div>
    </section>
  );
}
