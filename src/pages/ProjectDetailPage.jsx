import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import { publicUrl } from '../utils/publicUrl.js';

function HorizontalGallery({ images }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return undefined;

    const updateActiveSlide = () => {
      const children = Array.from(node.querySelectorAll('.gallery--horizontal__item'));
      if (!children.length) return;
      const center = node.scrollLeft + node.clientWidth / 2;
      let closestIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      children.forEach((child, index) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const distance = Math.abs(center - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    updateActiveSlide();
    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveSlide);
    };

    node.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveSlide);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      node.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveSlide);
    };
  }, [images]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <div className="gallery gallery--horizontal" role="region" aria-label="Галерея проекта" ref={scrollerRef}>
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            className={`gallery--horizontal__item${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => setLightboxIndex(index)}
            aria-label={`Открыть изображение ${index + 1}`}
          >
            <img src={publicUrl(src)} alt="" />
          </button>
        ))}
      </div>

      <div className="gallery--horizontal__indicator" aria-hidden="true">
        {images.map((src, index) => (
          <span key={src} className={`gallery--horizontal__dot${index === activeIndex ? ' is-active' : ''}`} />
        ))}
      </div>

      {lightboxIndex !== null ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setLightboxIndex(null)}>
          <button
            type="button"
            className="gallery-lightbox__close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Закрыть изображение"
          >
            ×
          </button>
          <img
            src={publicUrl(images[lightboxIndex])}
            alt=""
            className="gallery-lightbox__image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}

function CaseStudyProjectNav({ slug }) {
  const i = projects.findIndex((p) => p.slug === slug);
  const next = i >= 0 && i < projects.length - 1 ? projects[i + 1] : null;
  return (
    <nav className="case-study-nav" aria-label="Навигация по проектам" data-node-id="300:104228">
      <div className="case-study-nav__inner">
        <Link to="/projects" className="case-study-nav__link case-study-nav__link--back">
          <span className="case-study-nav__icon" aria-hidden="true">←</span>
          К&nbsp;проектам
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
        <Link to="/projects">К проектам</Link>
      </div>
    );
  }

  const lead = project.lead ?? project.desc;
  const metaItems = project.metaItems ?? [{ label: 'Категория', value: project.meta }];
  const isCaseStudy = project.layout === 'case-study';
  const hasHero = Boolean(project.image);
  const topCards = [
    { title: 'Контекст', value: project.context ?? lead },
    { title: 'Проблема', value: project.problem ?? 'Ключевой барьер и ограничения раскрыты в задаче проекта.' },
    { title: 'Задача', value: project.task },
    { title: 'Решение', value: project.solution },
    { title: 'Результат', value: project.influence },
    { title: 'Метрики', value: project.metrics },
  ];
  const topCardsClassName = `cards${topCards.length >= 6 ? ' cards--bento' : ''}`;

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

          <section className={topCardsClassName}>
            {topCards.map((item) => (
              <div key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.value}</p>
              </div>
            ))}
          </section>

          {project.caseSections?.map((section, i) => {
            const isTitleInfoSection = section.layout === 'title-info' && section.galleryImage;
            return (
            <Fragment key={i}>
              <section className={`section${section.mediaOnly ? ' section--media-only' : ''}${isTitleInfoSection ? ' section--title-info' : ''}`}>
                {isTitleInfoSection ? (
                  <article className="title-info-card" data-node-id={section.nodeId ?? '300:107826'} data-name="Title info">
                    <div className="title-info-card__content" data-node-id="300:107827">
                      <div className="title-info-card__text-group" data-node-id="300:107828">
                        <h2 data-node-id="300:107830">{section.title}</h2>
                        {section.description ? <p data-node-id="300:107832">{section.description}</p> : null}
                      </div>
                      {section.ctaLabel ? (
                        <a
                          href={publicUrl(section.galleryImage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="title-info-card__cta"
                          data-node-id="300:107833"
                        >
                          {section.ctaLabel}
                        </a>
                      ) : null}
                    </div>
                    <div className="title-info-card__media" data-node-id="300:107834">
                      <img src={publicUrl(section.galleryImage)} alt={section.title} />
                    </div>
                  </article>
                ) : (
                  <>
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
                {section.galleryImages?.length > 0 ? (
                  section.horizontalGallery ? (
                    <HorizontalGallery images={section.galleryImages} />
                  ) : (
                    section.galleryImages.map((src, gi) => (
                      <div key={gi} className="gallery">
                        <img src={publicUrl(src)} alt="" />
                      </div>
                    ))
                  )
                ) : null}
                {section.blockCards ? (
                  (() => {
                    const sectionCards = [
                      { title: 'Контекст', value: section.blockCards.context },
                      { title: 'Проблема', value: section.blockCards.problem },
                      { title: 'Задача', value: section.blockCards.task },
                      { title: 'Решение', value: section.blockCards.solution },
                      { title: 'Результат', value: section.blockCards.influence },
                      { title: 'Метрики', value: section.blockCards.metrics },
                    ].filter((item) => item.value);
                    const sectionCardsClassName = `cards${sectionCards.length >= 6 ? ' cards--bento' : ''}`;
                    return (
                      <div className={sectionCardsClassName}>
                        {sectionCards.map((item) => (
                        <div key={item.title} className="card">
                          <h3>{item.title}</h3>
                          <p>{item.value}</p>
                        </div>
                        ))}
                      </div>
                    );
                  })()
                ) : null}
                  </>
                )}
              </section>
              {i === 0 && (caseImages.before || caseImages.after) && (
                <section className="images">
                  {caseImages.before && <img src={publicUrl(caseImages.before)} alt="До" />}
                  {caseImages.after && <img src={publicUrl(caseImages.after)} alt="После" />}
                </section>
              )}
            </Fragment>
          );
          })}
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
          К проектам
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
          {topCards.map((item) => (
            <div key={item.title} className="contact-item contact-item--text">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
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
