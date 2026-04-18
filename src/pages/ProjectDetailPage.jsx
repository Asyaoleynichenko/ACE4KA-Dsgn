import { Fragment } from 'react';
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
  const isCaseStudy = project.layout === 'case-study';
  const hasHero = Boolean(project.image);

  if (isCaseStudy) {
    const caseImages = project.caseStudyImages || {};
    return (
      <div className="project-page-wrap project-page-wrap--case-study project-case-study-mail">
        <div className="container container--case-study">
          <Link to="/projects" className="back">
            ← НАЗАД К ПОРТФОЛИО
          </Link>

          <section className="hero">
            {project.image ? (
              <img src={project.image} alt={project.title} />
            ) : (
              <div className="hero-placeholder">Превью проекта</div>
            )}
          </section>

          <section className="project-intro">
            <div className="title">
              <h1>{project.title}</h1>
              <p>
                {project.intro?.[0] ?? project.lead}
              </p>
            </div>
            <div className="project-info">
              {metaItems.map((item) => (
                <div key={item.label}>
                  {item.label}<br /><b>{item.value}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="cards">
            {project.task && (
              <div className="card">
                <h3>Задача</h3>
                <p>{project.task}</p>
              </div>
            )}
            {project.solution && (
              <div className="card">
                <h3>Решение</h3>
                <p>{project.solution}</p>
              </div>
            )}
            {project.influence && (
              <div className="card">
                <h3>Влияние</h3>
                <p>{project.influence}</p>
              </div>
            )}
            {project.metrics && (
              <div className="card">
                <h3>Метрики</h3>
                <p>{project.metrics}</p>
              </div>
            )}
          </section>

          {project.caseSections?.map((section, i) => (
            <Fragment key={i}>
              <section className="section">
                <h2>{section.title}</h2>
                {section.description && (
                  <p className={section.hypotheses?.length ? 'section-desc' : ''}>
                    {section.description}
                  </p>
                )}
                {section.hypotheses?.length > 0 && (
                  <div className="hypothesis">
                    {section.hypotheses.map((h, j) => (
                      <div key={j} className="hyp-card">
                        <h4>{h.title ?? `Гипотеза ${j + 1}`}</h4>
                        <p>{h.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {section.galleryImage && (
                  <div className="gallery">
                    <img src={section.galleryImage} alt="" />
                  </div>
                )}
                {section.tasks?.length > 0 && (
                  <ul>
                    {section.tasks.map((t, j) => (
                      <li key={j}>{t}</li>
                    ))}
                  </ul>
                )}
              </section>
              {i === 0 && (caseImages.before || caseImages.after) && (
                <section className="images">
                  {caseImages.before && <img src={caseImages.before} alt="До" />}
                  {caseImages.after && <img src={caseImages.after} alt="После" />}
                </section>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`project-page-wrap project-page-wrap--layout-89${!hasHero ? ' project-page-wrap--no-hero' : ''}`}>
      <div className="project-back-wrap">
        <Link to="/projects" className="back-link">
          <span className="back-link__icon" aria-hidden="true">←</span>
          Назад к портфолио
        </Link>
      </div>
      {hasHero && (
        <div className="project-hero">
          <img src={project.image} alt={project.title} />
        </div>
      )}
      <div className="page-contact__wrap page-contact__wrap--project" data-node-id="89-756">
        <header className="page-header">
          <h1>{project.title}</h1>
          <p>{lead}</p>
        </header>
        <div className="contact-grid">
          {metaItems.map((item) => (
            <div key={item.label} className="contact-item">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </div>
            </div>
          ))}
          {project.task ? (
            <div className="contact-item contact-item--text">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>Задача</strong>
                <p>{project.task}</p>
              </div>
            </div>
          ) : null}
          {project.solution ? (
            <div className="contact-item contact-item--text">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>Решение</strong>
                <p>{project.solution}</p>
              </div>
            </div>
          ) : null}
        </div>
        {slug === 'marginals' && (
          <section className="project-problem-solution-impact">
            <div className="project-case-grid">
              {project.task && (
                <div className="project-case-card">
                  <h2 className="project-case-card__title">Задача</h2>
                  <p className="project-case-card__text">{project.task}</p>
                </div>
              )}
              {project.solution && (
                <div className="project-case-card">
                  <h2 className="project-case-card__title">Решение</h2>
                  <p className="project-case-card__text">{project.solution}</p>
                </div>
              )}
              <div className="project-case-card">
                <h2 className="project-case-card__title">Влияние</h2>
                <p className="project-case-card__text">
                  {project.lead}
                </p>
              </div>
              <div className="project-case-card">
                <h2 className="project-case-card__title">Метрики</h2>
                <p className="project-case-card__text">
                  {project.lead}
                </p>
              </div>
            </div>
          </section>
        )}
        {(project.tools?.length || project.extLink) ? (
          <footer className="project-detail-footer project-detail-footer--centered">
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
                <a href={project.extLink.href} className="ext-link" target="_blank" rel="noopener noreferrer">
                  {project.extLink.label}
                </a>
              </div>
            ) : null}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
