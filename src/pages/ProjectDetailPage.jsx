import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SmartLink from '../components/SeamlessProjectsLink.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import {
  getLocalizedCaseStudyIntroParas,
  hypothesisCardHeading,
  translateCaseCardTitle,
  translateExtLinkLabel,
  translateMetaLabel,
} from '../i18n/projectFieldTranslate.js';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { projects } from '../data/projects';
import { applyCaseStudyEnglishOverlay } from '../i18n/mergeCaseStudyEnOverlay.js';
import { CASE_STUDY_EN_OVERLAYS } from '../i18n/caseStudyEnOverlays/index.js';
import { publicUrl } from '../utils/publicUrl.js';
import { caseStudyStripIconKind } from '../utils/caseStudyStripIcons.js';
import { buildCaseStudySpySections } from '../utils/caseStudySpySections.js';
import { useScrollSpy } from '../hooks/useScrollSpy.js';
import ProjectCaseStudySpyNav from '../components/ProjectCaseStudySpyNav.jsx';
import CaseStudyCardCornerIcon from '../components/CaseStudyCardCornerIcon.jsx';
import ScrollScrubRow from '../components/ScrollScrubRow.jsx';
import DotIcon from '../components/DotIcon.jsx';
import HalftoneButton from '../components/HalftoneButton.jsx';
import ProjectsListNavigation from '../components/ProjectsListNavigation.jsx';
import { pillArrowReplace } from '../utils/pillArrowKeywords.js';
import {
  collectCaseHeroImages,
  getCaseStudyEditorial,
  partitionCaseSections,
} from '../utils/caseStudyFrame.js';
import CaseStudyHeroMosaic from '../components/CaseStudyHeroMosaic.jsx';
import CaseStudyEditorialFrame from '../components/CaseStudyEditorialFrame.jsx';

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
                <img src={publicUrl(slide.image)} alt="" loading="lazy" decoding="async" />
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
            decoding="async"
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
            <img src={publicUrl(src)} alt="" loading="lazy" decoding="async" />
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
            decoding="async"
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

  const spySections = project ? buildCaseStudySpySections(project, { t, locale, messages }) : [];
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

  const caseStudyIntroParas = getLocalizedCaseStudyIntroParas(project, locale, messages);
  const metaItems = project.metaItems ?? [{ label: t('common.caseStudy.category'), value: project.meta }];
  const editorial = getCaseStudyEditorial(project);
  const heroImages = collectCaseHeroImages(project);
  const { kept: bodySections, skipped: skippedSections } = partitionCaseSections(project);
  const caseImages = project.caseStudyImages || {};
  return (
      <div
        className="project-page-wrap project-page-wrap--case-study project-case-study-mail"
        data-node-id={project.figmaNodeId}
        data-figma-url={project.figmaUrl}
      >
        <div className="container container--case-study">
          <ProjectCaseStudySpyNav sections={spySections} activeId={activeSpyId} />
          <section className="hero" id={`case-${project.slug}-hero`}>
            <CaseStudyHeroMosaic
              images={heroImages}
              slug={project.slug}
              alt={displayTitle}
              placeholder={t('projectDetail.heroPlaceholder')}
            />
          </section>

          <section className="project-intro" id={`case-${project.slug}-intro`}>
            <div className="project-intro__main">
              <div className="project-intro__heading">
                <h1
                  data-type-reveal="cinematic"
                  data-type-reveal-trigger="scroll"
                  data-type-reveal-split="lines"
                  data-type-reveal-stagger="0.085"
                  data-type-reveal-delay="0.05"
                >
                  <span className="text-condensed">{displayTitle}</span>
                </h1>
              </div>
              <div className="project-intro__lead">
                {caseStudyIntroParas.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
                {project.relatedCaseSlugs?.length ? (
                  <p className="project-intro__related">
                    <span className="project-intro__related-label"><span className="text-condensed">{t('projectDetail.relatedCasesLabel')}</span>: </span>
                    {project.relatedCaseSlugs.map((relatedSlug, idx) => {
                      const rp = projects.find((p) => p.slug === relatedSlug);
                      if (!rp) return null;
                      const label = tWithFallback(t, `projects.cards.${relatedSlug}.navShortTitle`, rp.title);
                      return (
                        <Fragment key={relatedSlug}>
                          {idx > 0 ? ' · ' : null}
                          <SmartLink to={localizedPath(`/project/${relatedSlug}`)}>{label}</SmartLink>
                        </Fragment>
                      );
                    })}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="project-info">
              {metaItems.map((item) => (
                <div key={item.label} className="project-info__row">
                  <span className="project-info__label"><span className="text-condensed">{translateMetaLabel(item.label, t)}</span></span>
                  <span className="project-info__value">{item.value}</span>
                </div>
              ))}
              {project.extLink ? (
                <HalftoneButton href={project.extLink.href}>
                  {translateExtLinkLabel(project.extLink.label, t)}
                </HalftoneButton>
              ) : null}
            </div>
          </section>

          <CaseStudyEditorialFrame
            slug={project.slug}
            editorial={editorial}
            skipped={skippedSections}
            ct={ct}
            t={t}
            locale={locale}
          />

          {project.showNarrative && (project.context || project.problem) ? (
            <section className="case-study-narrative" id={`case-${project.slug}-narrative`}>
              {project.context ? <p className="case-study-narrative__p">{project.context}</p> : null}
              {project.problem ? <p className="case-study-narrative__p">{project.problem}</p> : null}
            </section>
          ) : null}

          {bodySections.map(({ section, index: i }) => {
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
                        <h2 className="dual-outcomes__title"><span className="text-condensed">{col.title}</span></h2>
                        {col.tasks?.length ? (
                          <ul className="section__pills dual-outcomes__pills" aria-label={col.title}>
                            {col.tasks.map((line, j) => (
                              <li key={j}>{pillArrowReplace(line)}</li>
                            ))}
                          </ul>
                        ) : null}
                        {col.footnote ? <p className="dual-outcomes__footnote">{col.footnote}</p> : null}
                      </div>
                    ))}
                  </div>
                ) : isTitleInfoSection ? (
                  <article
                    className="title-info-article"
                    data-node-id={section.nodeId ?? '300:107826'}
                    data-name="Title info"
                  >
                    <div className="title-info-card">
                      <div className="title-info-card__content" data-node-id="300:107827">
                        <div className="title-info-card__text-group" data-node-id="300:107828">
                          <h2 data-node-id="300:107830"><span className="text-condensed">{section.title}</span></h2>
                          {section.description ? <p data-node-id="300:107832">{section.description}</p> : null}
                        </div>
                        {section.ctaLabel ? (
                          <HalftoneButton
                            href={section.ctaHref ?? publicUrl(section.galleryImage)}
                            className="title-info-card__cta"
                            data-node-id="300:107833"
                          >
                            {section.ctaLabel}
                          </HalftoneButton>
                        ) : null}
                      </div>
                    </div>
                    <figure className="title-info-card__media" data-node-id="300:107834">
                      <img src={publicUrl(section.galleryImage)} alt={section.title} loading="lazy" decoding="async" />
                    </figure>
                  </article>
                ) : section.mvpSlides?.length > 0 ? (
                  <HorizontalMvpGallery slides={section.mvpSlides} />
                ) : (
                  <>
                {section.galleryAboveTitle ? (
                  <div className="gallery">
                    <img src={publicUrl(section.galleryAboveTitle)} alt="" loading="lazy" decoding="async" />
                  </div>
                ) : null}
                {!section.hideTitle && section.title ? <h2><span className="text-condensed">{section.title}</span></h2> : null}
                {section.description && (
                  <p className={section.hypotheses?.length ? 'section-desc' : ''}>
                    {section.description}
                  </p>
                )}
                {section.ctaLink?.href ? (
                  section.ctaLink.external === false ? (
                    <HalftoneButton to={section.ctaLink.href} className="btn-show-all--section">
                      {section.ctaLink.label}
                    </HalftoneButton>
                  ) : (
                    <HalftoneButton href={section.ctaLink.href} className="btn-show-all--section">
                      {section.ctaLink.label}
                    </HalftoneButton>
                  )
                ) : null}
                {section.tasksHeading ? (
                  <p className="section__tasks-heading">{section.tasksHeading}</p>
                ) : null}
                {section.tasks?.length > 0 && (
                  section.taskLayout === 'pills' ? (
                    <ul className="section__pills" aria-label={section.pillsLabel ?? t('projectDetail.pillsDefaultAria')}>
                      {section.tasks.map((line, j) => (
                        <li key={j}>{pillArrowReplace(line)}</li>
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
                          <li key={j}>{pillArrowReplace(line)}</li>
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
                    <img src={publicUrl(section.galleryBeforeHypotheses)} alt="" loading="lazy" decoding="async" />
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
                  <ul className="hyp-list" aria-label={t('projectDetail.hypothesisStripAria')}>
                    {section.hypotheses.map((h, j) => (
                      <li key={j} className="hyp-list__item">
                        <details className="hyp-list__row" open={j === 0}>
                          <summary className="hyp-list__summary">
                            <span className="hyp-list__title">
                              <span className="text-condensed text-condensed--single-line">
                                {hypothesisCardHeading(h, j, locale, t)}
                              </span>
                            </span>
                            <span className="hyp-list__icon" aria-hidden="true" />
                          </summary>
                          <div className="hyp-list__body">
                            <div className="hyp-list__body-inner">
                              <p className="hyp-list__text">{h.text}</p>
                              {h.outcome ? (
                                <span className="hyp-list__outcome">{pillArrowReplace(h.outcome)}</span>
                              ) : null}
                            </div>
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                )}
                {section.galleryImage ? (
                  <div className="gallery">
                    <img src={publicUrl(section.galleryImage)} alt="" loading="lazy" decoding="async" />
                  </div>
                ) : null}
                {section.galleryImages?.length > 0 ? (
                  section.horizontalGallery ? (
                    <HorizontalGallery images={section.galleryImages} />
                  ) : (
                    section.galleryImages.map((src, gi) => (
                      <div key={gi} className="gallery">
                        <img src={publicUrl(src)} alt="" loading="lazy" decoding="async" />
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
                            <div
                              key={item.title}
                              className="card"
                              data-strip-kind={iconKind ?? undefined}
                            >
                              <h3>
                                <span className="text-condensed text-condensed--single-line">
                                  {translateCaseCardTitle(item.title, t)}
                                </span>
                              </h3>
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
                  {caseImages.before && <img src={publicUrl(caseImages.before)} alt={t('common.altBefore')} loading="lazy" decoding="async" />}
                  {caseImages.after && <img src={publicUrl(caseImages.after)} alt={t('common.altAfter')} loading="lazy" decoding="async" />}
                </section>
              )}
            </Fragment>
          );
          })}
          <ProjectsListNavigation currentSlug={project.slug} />
        </div>
      </div>
    );
}
