import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import {
  getLocalizedCaseStudyIntroParas,
  hypothesisCardHeading,
  translateCaseCardTitle,
  translateExtLinkLabel,
  translateMetaLabel,
  translateToolLine,
} from '../i18n/projectFieldTranslate.js';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { projects } from '../data/projects';
import { applyCaseStudyEnglishOverlay } from '../i18n/mergeCaseStudyEnOverlay.js';
import { CASE_STUDY_EN_OVERLAYS } from '../i18n/caseStudyEnOverlays/index.js';
import { publicUrl } from '../utils/publicUrl.js';
import { caseStudyStripIconKind } from '../utils/caseStudyStripIcons.js';
import { buildCaseStudySpySections } from '../utils/caseStudySpySections.js';
import { setProjectHeroVtName } from '../utils/projectHeroViewTransition.js';
import { useScrollSpy } from '../hooks/useScrollSpy.js';
import ProjectCaseStudySpyNav from '../components/ProjectCaseStudySpyNav.jsx';
import CaseStudyCardCornerIcon from '../components/CaseStudyCardCornerIcon.jsx';
import ScrollScrubRow from '../components/ScrollScrubRow.jsx';
import DotIcon from '../components/DotIcon.jsx';

/** MVP-блок: один слайд на экран, стрелки, точки, свайп, клавиатура (без горизонтального скролла) */
function HorizontalMvpGallery({ slides }) {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const helpId = useId();
  const touchStartX = useRef(null);

  const total = slides.length;
  const slide = slides[activeIndex];
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < total - 1;

  const goTo = useCallback(
    (index) => {
      setActiveIndex(Math.max(0, Math.min(total - 1, index)));
    },
    [total],
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const onViewportKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(total - 1);
    }
  };

  const onTouchStart = (event) => {
    const pt = event.touches[0];
    if (!pt) return;
    touchStartX.current = pt.clientX;
  };

  const onTouchEnd = (event) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const pt = event.changedTouches[0];
    if (!pt) return;
    const dx = pt.clientX - start;
    if (Math.abs(dx) < 48) return;
    setActiveIndex((i) => {
      if (dx < 0) return Math.min(total - 1, i + 1);
      return Math.max(0, i - 1);
    });
  };

  if (!slide) return null;

  return (
    <div className="mvp-slider" data-component="HorizontalMvpGallery">
      <p id={helpId} className="mvp-slider__sr-only">
        {t('projectDetail.mvpHelp')}
      </p>

      <div
        className="mvp-slider__viewport"
        role="region"
        aria-roledescription={t('projectDetail.sliderRole')}
        aria-label={t('projectDetail.mvpRegion')}
        aria-describedby={helpId}
        aria-live="polite"
        tabIndex={0}
        onKeyDown={onViewportKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        data-node-id="363:145168"
      >
        <article className="mvp-slider__slide" data-node-id={slide.nodeId}>
          <div className="mvp-slider__media-row">
            <button
              type="button"
              className="mvp-slider__chev mvp-slider__chev--prev"
              disabled={!canPrev}
              onClick={() => goTo(activeIndex - 1)}
              aria-label={t('projectDetail.prevSlide')}
            >
              <DotIcon name="dot-chevron-left" size={20} animated={false} />
            </button>
            <button
              type="button"
              className="mvp-slider__chev mvp-slider__chev--next"
              disabled={!canNext}
              onClick={() => goTo(activeIndex + 1)}
              aria-label={t('projectDetail.nextSlide')}
            >
              <DotIcon name="dot-chevron-right" size={20} animated={false} />
            </button>
            <div className="mvp-slider__media">
              <button
                type="button"
                className="mvp-slider__media-btn"
                onClick={() => setLightboxIndex(activeIndex)}
                aria-label={t('projectDetail.openLightbox')}
              >
                <img src={publicUrl(slide.image)} alt="" />
              </button>
            </div>
          </div>
          <div className="mvp-slider__copy">
            {slide.heading ? <h3 className="mvp-slider__heading">{slide.heading}</h3> : null}
            <p className="mvp-slider__text">{slide.text}</p>
          </div>
        </article>
      </div>

      <div className="mvp-slider__dots" role="group" aria-label={t('projectDetail.slideDots')}>
        {slides.map((dotSlide, index) => (
          <button
            key={dotSlide.nodeId ?? `${dotSlide.image}-${index}`}
            type="button"
            aria-current={index === activeIndex ? 'true' : undefined}
            aria-label={
              dotSlide.heading
                ? t('projectDetail.slideNamed', { index: index + 1, heading: dotSlide.heading })
                : t('projectDetail.slideOf', { index: index + 1, total })
            }
            className={`mvp-slider__dot${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      {lightboxIndex !== null ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setLightboxIndex(null)}>
          <button
            type="button"
            className="gallery-lightbox__close"
            onClick={() => setLightboxIndex(null)}
            aria-label={t('projectDetail.closeLightbox')}
          >
            ×
          </button>
          <img
            src={publicUrl(slides[lightboxIndex].image)}
            alt=""
            className="gallery-lightbox__image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}

function HorizontalGallery({ images }) {
  const { t } = useI18n();
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
      <div className="gallery gallery--horizontal" role="region" aria-label={t('projectDetail.galleryRegion')} ref={scrollerRef}>
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            className={`gallery--horizontal__item${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => setLightboxIndex(index)}
            aria-label={t('projectDetail.openImageN', { n: index + 1 })}
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
            aria-label={t('projectDetail.closeLightbox')}
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

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { t, locale, messages, localizedPath } = useI18n();
  const rawProject = projects.find((p) => p.slug === slug);
  const project = useMemo(
    () => (rawProject ? applyCaseStudyEnglishOverlay(rawProject, locale, CASE_STUDY_EN_OVERLAYS) : null),
    [rawProject, locale],
  );

  const spySections =
    project?.layout === 'case-study' ? buildCaseStudySpySections(project, { t, locale, messages }) : [];
  const spySectionIds = spySections.map((s) => s.id).filter(Boolean);
  const activeSpyId = useScrollSpy(spySectionIds);

  if (!project) {
    return (
      <div className="project-page-wrap">
        <p>{t('projectDetail.notFound')}</p>
      </div>
    );
  }

  const displayTitle = tWithFallback(t, `projects.cards.${slug}.title`, project.title);
  const ct = (key) => t(`common.caseStudy.${key}`);

  const lead = project.lead ?? project.desc;
  const caseStudyIntroParas = getLocalizedCaseStudyIntroParas(project, locale, messages);
  const metaItems = project.metaItems ?? [{ label: t('common.caseStudy.category'), value: project.meta }];
  const isCaseStudy = project.layout === 'case-study';
  const hasHero = Boolean(project.image);
  const caseStudyTopCards = project.topCards ?? [
    { title: ct('task'), value: project.task },
    { title: ct('solution'), value: project.solution },
    { title: ct('influence'), value: project.influence },
    { title: ct('metrics'), value: project.metrics },
  ];
  const topCards = (isCaseStudy
    ? caseStudyTopCards
    : [
        { title: ct('context'), value: project.context ?? lead },
        { title: ct('problem'), value: project.problem ?? t('common.caseStudy.problemFallback') },
        { title: ct('task'), value: project.task },
        { title: ct('solution'), value: project.solution },
        { title: ct('result'), value: project.influence },
        { title: ct('metrics'), value: project.metrics },
      ]).filter((item) => item.value);
  if (isCaseStudy) {
    const caseImages = project.caseStudyImages || {};
    const heroImages = project.heroImages?.length ? project.heroImages : project.image ? [project.image] : [];
    return (
      <div
        className="project-page-wrap project-page-wrap--case-study project-case-study-mail"
        data-node-id={project.figmaNodeId}
        data-figma-url={project.figmaUrl}
      >
        <div className="container container--case-study">
          <ProjectCaseStudySpyNav sections={spySections} activeId={activeSpyId} />
          <section className="hero" id={`case-${project.slug}-hero`}>
            {heroImages.length ? (
              <div
                className={`hero__media${heroImages.length > 1 ? ' hero__media--carousel' : ''}`}
                aria-label={displayTitle}
              >
                {heroImages.map((src, index) => (
                  <img
                    key={src}
                    ref={(el) => {
                      if (index === 0) setProjectHeroVtName(el, project.slug);
                      else if (el) el.style.removeProperty('view-transition-name');
                    }}
                    src={publicUrl(src)}
                    alt={index === heroImages.length - 1 ? displayTitle : ''}
                    aria-hidden={index === heroImages.length - 1 ? undefined : 'true'}
                  />
                ))}
              </div>
            ) : (
              <div className="hero-placeholder">{t('projectDetail.heroPlaceholder')}</div>
            )}
          </section>

          <section className="project-intro" id={`case-${project.slug}-intro`}>
            <div className="title">
              <h1>{displayTitle}</h1>
              {caseStudyIntroParas.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
              {project.relatedCaseSlugs?.length ? (
                <p className="project-intro__related">
                  <span className="project-intro__related-label">{t('projectDetail.relatedCasesLabel')}: </span>
                  {project.relatedCaseSlugs.map((relatedSlug, idx) => {
                    const rp = projects.find((p) => p.slug === relatedSlug);
                    if (!rp) return null;
                    const label = tWithFallback(t, `projects.cards.${relatedSlug}.navShortTitle`, rp.title);
                    return (
                      <Fragment key={relatedSlug}>
                        {idx > 0 ? ' · ' : null}
                        <Link to={localizedPath(`/projects/${relatedSlug}`)}>{label}</Link>
                      </Fragment>
                    );
                  })}
                </p>
              ) : null}
            </div>
            <div className="project-info">
              {metaItems.map((item) => (
                <div key={item.label} className="project-info__row">
                  <span className="project-info__label">{translateMetaLabel(item.label, t)}</span>
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
                  {translateExtLinkLabel(project.extLink.label, t)}
                </a>
              ) : null}
            </div>
          </section>

          <section className="cards-section" id={`case-${project.slug}-overview`}>
            <ScrollScrubRow variant="cards" ariaLabel={t('projectDetail.cardsStripAria')}>
              {topCards.map((item, cardIdx) => {
                const iconKind = caseStudyStripIconKind(item.title);
                const cardTitle = translateCaseCardTitle(item.title, t);
                return (
                  <div key={`${cardIdx}-${item.title}`} className="card" data-strip-kind={iconKind ?? undefined}>
                    <h3>{cardTitle}</h3>
                    <p>{item.value}</p>
                    {iconKind ? <CaseStudyCardCornerIcon kind={iconKind} staggerIndex={cardIdx} /> : null}
                  </div>
                );
              })}
            </ScrollScrubRow>
          </section>

          {project.showNarrative && (project.context || project.problem) ? (
            <section className="case-study-narrative" id={`case-${project.slug}-narrative`}>
              {project.context ? <p className="case-study-narrative__p">{project.context}</p> : null}
              {project.problem ? <p className="case-study-narrative__p">{project.problem}</p> : null}
            </section>
          ) : null}

          {project.caseSections?.map((section, i) => {
            const isTitleInfoSection = section.layout === 'title-info' && section.galleryImage;
            const isDualOutcomes = section.layout === 'dual-outcomes' && section.columns?.length;
            return (
            <Fragment key={i}>
              <section
                id={`case-${project.slug}-body-${i}`}
                className={`section${section.mediaOnly ? ' section--media-only' : ''}${isTitleInfoSection ? ' section--title-info' : ''}${isDualOutcomes ? ' section--dual-outcomes' : ''}${section.mvpSlides?.length ? ' section--mvp-horizontal' : ''}`}
              >
                {isDualOutcomes ? (
                  <div className="dual-outcomes" data-node-id="328:24122">
                    {section.columns.map((col, ci) => (
                      <div
                        key={col.title ?? ci}
                        className={`dual-outcomes__col${col.titleSize === 'medium' ? ' dual-outcomes__col--title-md' : ''}`}
                      >
                        <h2 className="dual-outcomes__title">{col.title}</h2>
                        {col.tasks?.length ? (
                          <ul className="section__pills dual-outcomes__pills" aria-label={col.title}>
                            {col.tasks.map((line, j) => (
                              <li key={j}>{line}</li>
                            ))}
                          </ul>
                        ) : null}
                        {col.footnote ? <p className="dual-outcomes__footnote">{col.footnote}</p> : null}
                      </div>
                    ))}
                  </div>
                ) : isTitleInfoSection ? (
                  <article className="title-info-card" data-node-id={section.nodeId ?? '300:107826'} data-name="Title info">
                    <div className="title-info-card__content" data-node-id="300:107827">
                      <div className="title-info-card__text-group" data-node-id="300:107828">
                        <h2 data-node-id="300:107830">{section.title}</h2>
                        {section.description ? <p data-node-id="300:107832">{section.description}</p> : null}
                      </div>
                      {section.ctaLabel ? (
                        <a
                          href={section.ctaHref ?? publicUrl(section.galleryImage)}
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
                ) : section.mvpSlides?.length > 0 ? (
                  <HorizontalMvpGallery slides={section.mvpSlides} />
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
                {section.ctaLink?.href ? (
                  <a
                    href={section.ctaLink.href}
                    className="project-info__cta project-info__cta--section"
                    target={section.ctaLink.external === false ? undefined : '_blank'}
                    rel={section.ctaLink.external === false ? undefined : 'noopener noreferrer'}
                  >
                    {section.ctaLink.label}
                  </a>
                ) : null}
                {section.tasksHeading ? (
                  <p className="section__tasks-heading">{section.tasksHeading}</p>
                ) : null}
                {section.tasks?.length > 0 && (
                  section.taskLayout === 'pills' ? (
                    <ul className="section__pills" aria-label={section.pillsLabel ?? t('projectDetail.pillsDefaultAria')}>
                      {section.tasks.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul>
                      {section.tasks.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )
                )}
                {section.pillsFootnote ? (
                  <p className="section-footnote">{section.pillsFootnote}</p>
                ) : null}
                {section.nestedAfterPills ? (
                  <div className="section__nested-after-pills">
                    {section.nestedAfterPills.subtitle ? (
                      <h3 className="section__subheading">{section.nestedAfterPills.subtitle}</h3>
                    ) : null}
                    {section.nestedAfterPills.description ? (
                      <p>{section.nestedAfterPills.description}</p>
                    ) : null}
                    {section.nestedAfterPills.tasks?.length > 0 ? (
                      section.nestedAfterPills.taskLayout === 'pills' ? (
                      <ul
                        className="section__pills section__pills--nested"
                        aria-label={section.nestedAfterPills.subtitle ?? t('projectDetail.nestedSubtitle')}
                      >
                        {section.nestedAfterPills.tasks.map((line, j) => (
                          <li key={j}>{line}</li>
                        ))}
                      </ul>
                      ) : (
                      <ul>
                        {section.nestedAfterPills.tasks.map((line, j) => (
                          <li key={j}>{line}</li>
                        ))}
                      </ul>
                      )
                    ) : null}
                  </div>
                ) : null}
                {section.descriptionFooter ? (
                  <p className="section-desc section-desc--footer">{section.descriptionFooter}</p>
                ) : null}
                {section.galleryBeforeHypotheses ? (
                  <div className="gallery gallery--before-hypotheses">
                    <img src={publicUrl(section.galleryBeforeHypotheses)} alt="" />
                  </div>
                ) : null}
                {section.hypotheses?.length > 0 ? (
                  <div
                    className="case-study-subanchor"
                    id={`case-${project.slug}-body-${i}-hyp`}
                    aria-hidden="true"
                  />
                ) : null}
                {section.hypotheses?.length > 0 && (
                  <ScrollScrubRow variant="hypothesis" ariaLabel={t('projectDetail.hypothesisStripAria')}>
                    {section.hypotheses.map((h, j) => (
                      <div key={j} className="hyp-card">
                        <h4>{hypothesisCardHeading(h, j, locale, t)}</h4>
                        <p>{h.text}</p>
                        {h.outcome ? (
                          <div className="hyp-card__outcome">
                            <span>{h.outcome}</span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </ScrollScrubRow>
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
                      { title: ct('context'), value: section.blockCards.context },
                      { title: ct('problem'), value: section.blockCards.problem },
                      { title: ct('task'), value: section.blockCards.task },
                      { title: ct('solution'), value: section.blockCards.solution },
                      { title: ct('influence'), value: section.blockCards.influence },
                      { title: ct('metrics'), value: section.blockCards.metrics },
                    ].filter((item) => item.value);
                    return (
                      <ScrollScrubRow variant="cards" ariaLabel={t('projectDetail.cardsStripAria')}>
                        {sectionCards.map((item, cardIdx) => {
                          const iconKind = caseStudyStripIconKind(item.title);
                          return (
                            <div key={item.title} className="card" data-strip-kind={iconKind ?? undefined}>
                              <h3>{item.title}</h3>
                              <p>{item.value}</p>
                              {iconKind ? <CaseStudyCardCornerIcon kind={iconKind} staggerIndex={cardIdx} /> : null}
                            </div>
                          );
                        })}
                      </ScrollScrubRow>
                    );
                  })()
                ) : null}
                  </>
                )}
              </section>
              {i === 0 && (caseImages.before || caseImages.after) && (
                <section className="images" id={`case-${project.slug}-compare`}>
                  {caseImages.before && <img src={publicUrl(caseImages.before)} alt={t('common.altBefore')} />}
                  {caseImages.after && <img src={publicUrl(caseImages.after)} alt={t('common.altAfter')} />}
                </section>
              )}
            </Fragment>
          );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`project-page-wrap project-page-wrap--layout-89${!hasHero ? ' project-page-wrap--no-hero' : ''}`}>
      {hasHero && (
        <div className="project-hero">
          <img
            ref={(el) => setProjectHeroVtName(el, project.slug)}
            src={publicUrl(project.image)}
            alt={displayTitle}
          />
        </div>
      )}
      <div className="page-contact__wrap page-contact__wrap--project" data-node-id="89-756">
        <header className="page-header">
          <h1>{displayTitle}</h1>
          <p>{lead}</p>
        </header>
        <ScrollScrubRow
          variant="contact"
          className="contact-grid-wrap"
          ariaLabel={t('projectDetail.projectMetaStripAria')}
        >
          {metaItems.map((item) => (
            <div key={item.label} className="contact-item">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>{translateMetaLabel(item.label, t)}</strong>
                <span>{item.value}</span>
              </div>
            </div>
          ))}
          {topCards.map((item, idx) => (
            <div key={`${idx}-${item.title}`} className="contact-item contact-item--text">
              <span className="contact-item__icon" aria-hidden="true">•</span>
              <div>
                <strong>{translateCaseCardTitle(item.title, t)}</strong>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </ScrollScrubRow>
        {(project.tools?.length || project.extLink) ? (
          <footer className="project-detail-footer project-detail-footer--centered">
            {project.tools?.length ? (
              <div>
                <h3 className="project-detail-footer__label">{t('projectDetail.toolsHeading')}</h3>
                <ul className="tools-list" aria-label={t('projectDetail.toolsListAria')}>
                  {project.tools.map((tool) => (
                    <li key={tool}>
                      <span className="tools-list__pill">{translateToolLine(tool, locale, messages)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.extLink ? (
              <div>
                <h3 className="project-detail-footer__label">{t('projectDetail.linksHeading')}</h3>
                <a href={project.extLink.href} className="ext-link" target="_blank" rel="noopener noreferrer">
                  {translateExtLinkLabel(project.extLink.label, t)}
                </a>
              </div>
            ) : null}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
