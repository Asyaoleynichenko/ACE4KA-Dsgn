import { lazy, Suspense } from 'react';
import HomeCameraScroll from '../components/HomeCameraScroll.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from '../components/SeamlessProjectsLink.jsx';
import IconAssembleFromDots from '../components/IconAssembleFromDots.jsx';
import PreviewCardBlock from '../components/PreviewCardBlock';
import HalftoneButton from '../components/HalftoneButton.jsx';
import DotIcon from '../components/DotIcon.jsx';
import { asArray } from '../utils/asArray.js';
import {
  SECTION_HEADER_IMAGES,
  HEADER_FIRST_SCREEN,
  headerItemsFolder,
  headerItemsWell,
} from '../data/sectionHeaderItems';
const HomeCompetenciesScrub = lazy(() => import('../components/HomeCompetenciesScrub.jsx'));
const HomeProjectsSection = lazy(() => import('../components/HomeProjectsSection.jsx'));

function headerItemPlacementStyle(placement) {
  if (!placement) return undefined;
  return {
    '--hi-left': `${(placement.x / HEADER_FIRST_SCREEN.w) * 100}%`,
    '--hi-top': `${(placement.y / HEADER_FIRST_SCREEN.h) * 100}%`,
  };
}

/** Индивидуальный «вес» mouse-follow для каждой папки — чтобы они двигались по-разному (parallax-depth). */
const FOLDER_FLOAT_VARIATIONS = [
  { strength: 1.6, range: 24 },
  { strength: 0.8, range: 16 },
  { strength: 2.0, range: 30 },
  { strength: 1.1, range: 20 },
  { strength: 0.6, range: 12 },
  { strength: 1.8, range: 26 },
  { strength: 1.3, range: 18 },
  { strength: 0.9, range: 14 },
];

function folderFloatProps(index) {
  return FOLDER_FLOAT_VARIATIONS[index % FOLDER_FLOAT_VARIATIONS.length];
}

function heroTitleLines(title) {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  return parts.length > 0 ? parts : [title.trim()];
}

const heroLinks = [
  { href: 'https://t.me/pnkprty', label: 'Telegram' },
  { href: 'https://behance.net/', label: 'Behance' },
  { href: '/resume', labelKey: 'hero.links.resume' },
  { href: 'mailto:hello@example.com', labelKey: 'hero.links.mail' },
  { href: 'https://pinterest.com/', label: 'Pinterest' },
];

function SectionFallback({ minHeight = '50vh' }) {
  return <div className="home-section-fallback" style={{ minHeight }} aria-hidden="true" />;
}

export default function HomePage() {
  const { t, localizedPath, messages } = useI18n();
  const competencyLines = asArray(messages.hero?.competencies?.lines);
  const competencyLineProjectSlugs = messages.hero?.competencies?.lineProjectSlugs;

  return (
    <HomeCameraScroll bridgeLabel={t('hero.projectsSectionTitle')}>
      <div
        className="home-page__scroll"
        data-camera-rail=""
        data-node-id="416-12975"
        data-figma-node="416-12975"
        data-name="Главная"
      >
        <section
          className="hero home-scene home-scene--hero"
          data-scene="hero"
          data-node-id="416-12975"
          data-figma-node="416-12975"
        >
          <div
            className="hero-first-screen"
            data-node-id="416-12977"
            data-figma-node="416-12977"
            data-name="First screen"
          >
            <div className="hero__top">
              <div className="hero__card">
                <PreviewCardBlock />
              </div>
            </div>
            <nav className="section-nav section-nav--home section-nav--overlay" aria-label={t('hero.sectionNavAria')}>
              <div className="header-items header-items--figma">
                {headerItemsFolder.map(({ nodeId, labelKey, iconKey, to, placement }, fi) => {
                  const { strength, range } = folderFloatProps(fi);
                  return (
                    <SeamlessProjectsLink
                      key={nodeId}
                      to={localizedPath(to)}
                      className="header-item header-item--folder"
                      data-node-id={nodeId}
                      data-float={strength}
                      data-float-range={range}
                      style={headerItemPlacementStyle(placement)}
                    >
                      <div className="header-item__icon-wrap">
                        <IconAssembleFromDots
                          className="icon-assemble-dots--folder"
                          ringRadiusPx={44}
                          dotCount={20}
                          dotPx={3}
                        >
                          <img src={SECTION_HEADER_IMAGES[iconKey]} alt="" width={99} height={90} loading="lazy" />
                        </IconAssembleFromDots>
                      </div>
                      <span className="header-item__label">
                        <span className="text-condensed">{t(labelKey)}</span>
                      </span>
                    </SeamlessProjectsLink>
                  );
                })}
                {headerItemsWell.map(({ nodeId, labelKey, iconKey, to, placement }, wi) => {
                  /* image-well индексируем со сдвигом, чтобы их вариации НЕ совпадали с фолдерами */
                  const { strength, range } = folderFloatProps(wi + 3);
                  return (
                  <SeamlessProjectsLink
                    key={nodeId}
                    to={localizedPath(to)}
                    className="header-item header-item--image-well"
                    data-node-id={nodeId}
                    data-float={strength}
                    data-float-range={range}
                    style={headerItemPlacementStyle(placement)}
                  >
                    <div className="header-item__well">
                      <IconAssembleFromDots
                        className="icon-assemble-dots--well"
                        ringRadiusPx={16}
                        dotCount={14}
                        dotPx={2.5}
                      >
                        <img src={SECTION_HEADER_IMAGES[iconKey]} alt="" loading="lazy" />
                      </IconAssembleFromDots>
                    </div>
                    <span className="header-item__label">
                      <span className="text-condensed">{t(labelKey)}</span>
                    </span>
                  </SeamlessProjectsLink>
                  );
                })}
              </div>
            </nav>
          </div>

          <div
            className="hero-about hero__intro"
            data-node-id="416-13006"
            data-figma-node="416-13006"
            data-name="About Section"
            data-float="off"
          >
            <div className="hero-content">
              <p
                className="hero-role"
                data-type-reveal="mask"
                data-type-reveal-trigger="load"
                data-type-reveal-split="block"
              >
                <span className="text-condensed">{t('hero.role')}</span>
              </p>
              <h1
                className="hero-title"
                data-scale="hero-name"
                data-type-reveal="cinematic"
                data-type-reveal-trigger="load"
                data-type-reveal-split="children"
                data-type-reveal-delay="0.12"
              >
                {heroTitleLines(t('hero.title')).map((part) => (
                  <span key={part} className="hero-title__line">
                    {part}
                  </span>
                ))}
              </h1>
              <p
                className="hero-text"
                data-type-reveal="mask"
                data-type-reveal-trigger="load"
                data-type-reveal-delay="0.3"
                data-type-reveal-stagger="0.07"
              >
                {t('hero.text')}
              </p>
              <SeamlessProjectsLink
                to={localizedPath('/about')}
                className="hero-more hero-more--with-icon"
                data-reveal=""
              >
                <span className="hero-more__text">
                  <span className="text-condensed">{t('hero.moreAbout')}</span>
                </span>
                <DotIcon name="dot-chevron-right" size={24} className="hero-more__chevron-icon" />
              </SeamlessProjectsLink>
            </div>
            <div className="hero-about__meta">
              <div className="info-grid" data-reveal-group="">
                <div className="info-card">
                  <span className="info-label">
                    <span className="text-condensed">{t('hero.info.location')}</span>
                  </span>
                  <span className="info-value">{t('hero.info.locationValue')}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">
                    <span className="text-condensed">{t('hero.info.company')}</span>
                  </span>
                  <span className="info-value">{t('hero.info.companyValue')}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">
                    <span className="text-condensed">{t('hero.info.focus')}</span>
                  </span>
                  <span className="info-value">{t('hero.info.focusValue')}</span>
                </div>
                <div className="info-card info-card--wide">
                  <span className="info-label">
                    <span className="text-condensed">{t('hero.info.education')}</span>
                  </span>
                  <span className="info-value">{t('hero.info.educationValue')}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">
                    <span className="text-condensed">{t('hero.info.contacts')}</span>
                  </span>
                  <span className="info-value">{t('hero.info.contactsValue')}</span>
                </div>
              </div>
              <div className="hero-links" data-reveal="">
                {heroLinks.map(({ href, label, labelKey }, index) => {
                  const linkLabel = labelKey ? t(labelKey) : label;
                  const linkEl = href.startsWith('/') ? (
                    <SeamlessProjectsLink key={href} to={localizedPath(href)}>
                      <span className="text-condensed">{linkLabel}</span>
                    </SeamlessProjectsLink>
                  ) : (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                      <span className="text-condensed">{linkLabel}</span>
                    </a>
                  );
                  return index === 0 ? (
                    linkEl
                  ) : (
                    <span key={`wrap-${href}`} className="hero-links__item">
                      <span className="hero-links__sep" aria-hidden="true" />
                      {linkEl}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {competencyLines.length ? (
          <section
            className="home-competencies home-scene home-scene--competencies"
            data-scene="competencies"
            data-node-id="592-38775"
            data-figma-node="592-38775"
            data-name="Work Section"
          >
            <Suspense fallback={<SectionFallback minHeight="40vh" />}>
              <HomeCompetenciesScrub
                lines={competencyLines}
                lineProjectSlugs={competencyLineProjectSlugs}
                ariaLabel={t('hero.competencies.aria')}
              >
                <div className="home-competencies__cta" data-reveal="">
                  <HalftoneButton to={localizedPath('/projects')}>{t('hero.allProjects')}</HalftoneButton>
                </div>
              </HomeCompetenciesScrub>
            </Suspense>
          </section>
        ) : null}

        {/* Сцена-обёртка снаружи Suspense: ScrollTrigger камеры находит её сразу,
            до того как lazy-секция домаунтится */}
        <div className="home-scene home-scene--projects" data-scene="projects">
          <Suspense fallback={<SectionFallback minHeight="40vh" />}>
            <HomeProjectsSection />
          </Suspense>
        </div>
      </div>
    </HomeCameraScroll>
  );
}
