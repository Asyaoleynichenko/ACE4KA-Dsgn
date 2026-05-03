import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import { publicUrl } from '../utils/publicUrl.js';

function CaseStudyProjectNav({ slug }) {
  const i = projects.findIndex((p) => p.slug === slug);
  const next = i >= 0 && i < projects.length - 1 ? projects[i + 1] : null;
  return (
    <nav className="case-study-nav" aria-label="Навигация по проектам" data-node-id="300:104228">
      <div className="case-study-nav__inner">
        <Link to="/projects" className="case-study-nav__link case-study-nav__link--back">
          <span className="case-study-nav__icon" aria-hidden="true">←</span>
          Назад к&nbsp;портфолио
        </Link>
        {next ? (
          <Link to={`/project/${next.slug}`} className="case-study-nav__link case-study-nav__link--next">
            Следующий проект
            <span className="case-study-nav__icon case-study-nav__icon--flip" aria-hidden="true">←</span>
          </Link>
        ) : (
          <span className="case-study-nav__spacer" aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}

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
      <div
        className="project-page-wrap project-page-wrap--case-study project-case-study-mail"
        data-node-id={project.figmaNodeId}
        data-figma-url={project.figmaUrl}
      >
        <CaseStudyProjectNav slug={slug} />
        <div className="container container--case-study">
          <section className="hero">
            {project.image ? (
              <img src={publicUrl(project.image)} alt={project.title} />
            ) : (
              <div className="hero-placeholder">Превью проекта</div>
            )}
          </section>

          <section className="project-intro">
            <div className="title">
              <h1>{project.title}</h1>
              {(project.intro?.length ? project.intro : [project.lead]).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <div className="project-info">
              {metaItems.map((item) => (
                <div key={item.label} className="project-info__row">
                  <span className="project-info__label">{item.label}</span>
                  <span className="project-info__value">{item.value}</span>
                </div>
              ))}
              {project.extLink ? (
                <a
                  href={project.extLink.href}
                  className="project-info__cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.extLink.label}
                </a>
              ) : null}
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
                <h3>Результат</h3>
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
              <section className={`section${section.mediaOnly ? ' section--media-only' : ''}`}>
                {section.galleryAboveTitle ? (
                  <div className="gallery">
                    <img src={publicUrl(section.galleryAboveTitle)} alt="" />
                  </div>
                ) : null}
                {!section.hideTitle && section.title ? <h2>{section.title}</h2> : null}
                {section.description && (
                  <p className={section.hypotheses?.length ? 'section-desc' : ''}>
                    {section.description}
                  </p>
                )}
                {section.tasksHeading ? (
                  <p className="section__tasks-heading">{section.tasksHeading}</p>
                ) : null}
                {section.tasks?.length > 0 && (
                  section.taskLayout === 'pills' ? (
                    <ul className="section__pills" aria-label={section.pillsLabel ?? 'Ключевые пункты'}>
                      {section.tasks.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul>
                      {section.tasks.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  )
                )}
                {section.galleryBeforeHypotheses ? (
                  <div className="gallery gallery--before-hypotheses">
                    <img src={publicUrl(section.galleryBeforeHypotheses)} alt="" />
                  </div>
                ) : null}
                {section.hypotheses?.length > 0 && (
                  <div className="hypothesis">
                    {section.hypotheses.map((h, j) => (
                      <div key={j} className="hyp-card">
                        <h4>{h.title ?? `Гипотеза ${j + 1}`}</h4>
                        <p>{h.text}</p>
                        {h.outcome ? (
                          <div className="hyp-card__outcome">
                            <span>{h.outcome}</span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
                {section.galleryImage ? (
                  <div className="gallery">
                    <img src={publicUrl(section.galleryImage)} alt="" />
                  </div>
                ) : null}
                {section.galleryImages?.length > 0
                  ? section.galleryImages.map((src, gi) => (
                      <div key={gi} className="gallery">
                        <img src={publicUrl(src)} alt="" />
                      </div>
                    ))
                  : null}
                {section.blockCards &&
                (section.blockCards.task ||
                  section.blockCards.solution ||
                  section.blockCards.influence ||
                  section.blockCards.metrics) ? (
                  <div className="cards">
                    {section.blockCards.task ? (
                      <div className="card">
                        <h3>Задача</h3>
                        <p>{section.blockCards.task}</p>
                      </div>
                    ) : null}
                    {section.blockCards.solution ? (
                      <div className="card">
                        <h3>Решение</h3>
                        <p>{section.blockCards.solution}</p>
                      </div>
                    ) : null}
                    {section.blockCards.influence ? (
                      <div className="card">
                        <h3>Результат</h3>
                        <p>{section.blockCards.influence}</p>
                      </div>
                    ) : null}
                    {section.blockCards.metrics ? (
                      <div className="card">
                        <h3>Метрики</h3>
                        <p>{section.blockCards.metrics}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
              {i === 0 && (caseImages.before || caseImages.after) && (
                <section className="images">
                  {caseImages.before && <img src={publicUrl(caseImages.before)} alt="До" />}
                  {caseImages.after && <img src={publicUrl(caseImages.after)} alt="После" />}
                </section>
              )}
            </Fragment>
          ))}
          <CaseStudyProjectNav slug={slug} />
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
          <img src={publicUrl(project.image)} alt={project.title} />
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
          {project.influence ? (
            <div className="contact-item contact-item--text">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>Результат</strong>
                <p>{project.influence}</p>
              </div>
            </div>
          ) : null}
          {project.metrics ? (
            <div className="contact-item contact-item--text">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>Метрики</strong>
                <p>{project.metrics}</p>
              </div>
            </div>
          ) : null}
        </div>
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
