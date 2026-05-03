import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import FilterPills from '../components/FilterPills';
import { projects } from '../data/projects';

export default function ProjectsPage() {
  return (
    <div className="page-projects__wrap" data-node-id="1-399" data-figma-node="1-399">
      <div className="logo-section" data-node-id="1:286">
        <h1 className="projects-title-main" data-node-id="1:289">Все проекты</h1>
        <FilterPills />
      </div>

      <div className="preview-grid" data-node-id="1:297" data-figma-node="1-297">
        {projects.map((p) => (
          <ProjectCard
            key={p.slug}
            slug={p.slug}
            title={p.title}
            meta={p.meta}
            desc={p.desc}
            image={p.image}
            isDemo={false}
          />
        ))}
      </div>
    </div>
  );
}
