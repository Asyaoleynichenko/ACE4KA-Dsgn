import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projects';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="project-page-wrap">
        <p>Проект не найден.</p>
        <Link to="/projects">Назад к проектам</Link>
      </div>
    );
  }

  const lead = project.lead ?? project.desc;
  const metaItems = project.metaItems ?? [{ label: 'Категория', value: project.meta }];

  return (
    <div className="project-page-wrap" data-node-id="1-525">
      <div className="project-back-wrap">
        <Link to="/projects" className="back-link">
          <span className="back-link__icon" aria-hidden="true">←</span>
          Назад к портфолио
        </Link>
      </div>
      {project.image ? (
        <div className="project-hero">
          <img src={project.image} alt={project.title} />
        </div>
      ) : (
        <div
          className="project-hero project-hero--gradient"
          style={{ background: 'linear-gradient(135deg, #2b2b2b 0%, #1d1d1d 100%)' }}
        />
      )}
      <article className="project-detail" data-node-id="1-534">
        <div className="project-detail__top">
          <div className="project-detail__heading">
            <h1>{project.title}</h1>
            <p className="lead">{lead}</p>
          </div>
          <div className="project-meta project-meta--card">
            {metaItems.map((item) => (
              <div key={item.label} className="project-meta-item">
                <div className="label">{item.label}</div>
                <div className="value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        {(project.task || project.solution) ? (
          <div className="project-detail-grid">
            {project.task ? (
              <div className="project-detail-card" data-node-id="1-556">
                <h2 className="project-detail-card__title">Задача</h2>
                <p className="project-detail-card__text">{project.task}</p>
              </div>
            ) : null}
            {project.solution ? (
              <div className="project-detail-card project-detail-card--full" data-node-id="1-557">
                <h2 className="project-detail-card__title">Решение</h2>
                <p className="project-detail-card__text">{project.solution}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        {(project.tools?.length || project.extLink) ? (
          <footer className="project-detail-footer">
            {project.tools?.length ? (
              <div>
                <h3 className="project-detail-footer__label">Инструменты</h3>
                <ul className="tools-list" aria-label="Инструменты">
                  {project.tools.map((tool) => (
                    <li key={tool}>
                      <span className="tools-list__pill">{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.extLink ? (
              <div>
                <h3 className="project-detail-footer__label">Ссылки</h3>
                <a href={project.extLink.href} className="ext-link" target="_blank" rel="noopener noreferrer">{project.extLink.label}</a>
              </div>
            ) : null}
          </footer>
        ) : null}
      </article>
    </div>
  );
}
