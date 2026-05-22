import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from '../components/SeamlessProjectsLink.jsx';
import IconAssembleFromDots from '../components/IconAssembleFromDots.jsx';
import PreviewCardBlock from '../components/PreviewCardBlock';
import HalftoneButton from '../components/HalftoneButton.jsx';
import {
  SECTION_HEADER_IMAGES,
  HEADER_FIRST_SCREEN,
  headerItemsFolder,
  headerItemsWell,
} from '../data/sectionHeaderItems';
import { HOME_PROJECT_SLUGS } from '../data/homeProjectsCatalog.js';

const HomeCompetenciesScrub = lazy(() => import('../components/HomeCompetenciesScrub.jsx'));
const HomeProjectsSection = lazy(() => import('../components/HomeProjectsSection.jsx'));

function headerItemPlacementStyle(placement) {
  if (!placement) return undefined;
  return {
    '--hi-left': `${(placement.x / HEADER_FIRST_SCREEN.w) * 100}%`,
    '--hi-top': `${(placement.y / HEADER_FIRST_SCREEN.h) * 100}%`,
  };
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
  const competencyLines = messages.hero?.competencies?.lines ?? [];
  const competencyLineProjectSlugs = messages.hero?.competencies?.lineProjectSlugs;

  return (
    <div className="home-page home-page--chrome">
      <div
        className="home-page__scroll"
        data-node-id="416-12975"
        data-figma-node="416-12975"
        data-name="Главная"
      >
        <section
          className="hero"
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
                {headerItemsFolder.map(({ nodeId, labelKey, iconKey, to, placement }) => {
                  const FolderLink = to === '/projects' ? SeamlessProjectsLink : Link;
                  return (
                    <FolderLink
                      key={nodeId}
                      to={localizedPath(to)}
                      className="header-item header-item--folder"
                      data-node-id={nodeId}
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
                    </FolderLink>
                  );
                })}
                {headerItemsWell.map(({ nodeId, labelKey, iconKey, to, placement }) => (
                  <Link
                    key={nodeId}
                    to={localizedPath(to)}
                    className="header-item header-item--image-well"
                    data-node-id={nodeId}
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
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div
            className="hero-about hero__intro"
            data-node-id="416-13006"
            data-figma-node="416-13006"
            data-name="About Section"
          >
            <div className="hero-content">
              <p className="hero-role" data-float="0.5" data-float-range="10">
                <span className="text-condensed">{t('hero.role')}</span>
              </p>
              <h1 className="hero-title" data-scale="hero-name" data-float="0.85" data-float-range="16">
                {heroTitleLines(t('hero.title')).map((part) => (
                  <span key={part} className="hero-title__line">
                    {part}
                  </span>
                ))}
              </h1>
              <p className="hero-text" data-float="0.6" data-float-range="12">
                {t('hero.text')}
              </p>
              <Link to={localizedPath('/about')} className="hero-more hero-more--with-icon">
                <span className="hero-more__text">
                  <span className="text-condensed">{t('hero.moreAbout')}</span>
                </span>
                <span className="hero-more__chevron" aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-about__meta">
              <div className="info-grid">
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
              <div className="hero-links">
                {heroLinks.map(({ href, label, labelKey }, index) => {
                  const linkLabel = labelKey ? t(labelKey) : label;
                  const linkEl = href.startsWith('/') ? (
                    <Link key={href} to={localizedPath(href)}>
                      <span className="text-condensed">{linkLabel}</span>
                    </Link>
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
            className="home-competencies"
            data-node-id="592-38775"
            data-figma-node="592-38775"
            data-name="Work Section"
          >
            <Suspense fallback={<SectionFallback minHeight="40vh" />}>
              <HomeCompetenciesScrub
                lines={competencyLines}
                lineProjectSlugs={competencyLineProjectSlugs}
                homeProjectSlugs={HOME_PROJECT_SLUGS}
                ariaLabel={t('hero.competencies.aria')}
              >
                <div className="home-competencies__cta">
                  <HalftoneButton to={localizedPath('/projects')}>{t('hero.allProjects')}</HalftoneButton>
                </div>
              </HomeCompetenciesScrub>
            </Suspense>
          </section>
        ) : null}

        <Suspense fallback={<SectionFallback minHeight="40vh" />}>
          <HomeProjectsSection />
        </Suspense>
      </div>
    </div>
  );
}
