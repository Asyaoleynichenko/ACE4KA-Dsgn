import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import SeamlessProjectsLink from '../components/SeamlessProjectsLink.jsx';
import IconAssembleFromDots from '../components/IconAssembleFromDots.jsx';
import PreviewCardBlock from '../components/PreviewCardBlock';
import ProjectCard from '../components/ProjectCard';
import FilterPills from '../components/FilterPills';
import { projects } from '../data/projects';
import {
  SECTION_HEADER_IMAGES,
  HEADER_FIRST_SCREEN,
  headerItemsFolder,
  headerItemsWell,
} from '../data/sectionHeaderItems';
import { publicUrl } from '../utils/publicUrl.js';

function headerItemPlacementStyle(placement) {
  if (!placement) return undefined;
  return {
    '--hi-left': `${(placement.x / HEADER_FIRST_SCREEN.w) * 100}%`,
    '--hi-top': `${(placement.y / HEADER_FIRST_SCREEN.h) * 100}%`,
  };
}

const heroLinks = [
  { href: 'https://t.me/pnkprty', label: 'Telegram' },
  { href: 'https://behance.net/', label: 'Behance' },
  { href: '/resume', labelKey: 'hero.links.resume' },
  { href: 'mailto:hello@example.com', labelKey: 'hero.links.mail' },
  { href: 'https://pinterest.com/', label: 'Pinterest' },
];

/** Порядок карточек на главной — совпадает с `CASE_STUDY_DISPLAY_ORDER` в `projects.js` (портфолио-текст). */
const HOME_PROJECT_SLUGS = [
  'mail-monetization',
  'mail-nauki',
  'racktables',
  'mail-spetsproekty',
  'neural',
  'biohacking',
  'drop',
  'loochok',
  'retrash',
  'inkz',
];

const homeProjects = HOME_PROJECT_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);

export default function HomePage() {
  const { t, localizedPath } = useI18n();

  return (
    <div className="home-page home-page--chrome" data-node-id="89:347" data-name="Главная">
      <div className="home-page__scroll">
        <section className="hero snap-screen" data-node-id="1-202" data-figma-node="1-202">
        <div className="hero-first-screen" data-node-id="70:343" data-name="First screen">
          <div className="hero__top">
            <div className="hero-vector" aria-hidden="true" data-node-id="1:203">
              <div className="hero-vector__inner">
                <img src={publicUrl('/images/main%20title%20vector.svg')} alt="" />
              </div>
            </div>
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
                    <IconAssembleFromDots className="icon-assemble-dots--folder" ringRadiusPx={44} dotCount={20} dotPx={3}>
                      <img src={SECTION_HEADER_IMAGES[iconKey]} alt="" width={99} height={90} />
                    </IconAssembleFromDots>
                  </div>
                  <span className="header-item__label">{t(labelKey)}</span>
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
                    <IconAssembleFromDots className="icon-assemble-dots--well" ringRadiusPx={16} dotCount={14} dotPx={2.5}>
                      <img src={SECTION_HEADER_IMAGES[iconKey]} alt="" />
                    </IconAssembleFromDots>
                  </div>
                  <span className="header-item__label">{t(labelKey)}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="hero__row" data-node-id="1:232">
          <div className="hero__content">
            <div className="hero-content">
              <p className="hero-role">{t('hero.role')}</p>
              <h1 className="hero-title">{t('hero.title')}</h1>
              <p className="hero-text">{t('hero.text')}</p>
              <Link to={localizedPath('/about')} className="hero-more hero-more--with-icon">
                <span className="hero-more__text">{t('hero.moreAbout')}</span>
                <span className="hero-more__chevron" aria-hidden="true" />
              </Link>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <span className="info-label">{t('hero.info.location')}</span>
                <span className="info-value">{t('hero.info.locationValue')}</span>
              </div>
              <div className="info-card">
                <span className="info-label">{t('hero.info.company')}</span>
                <span className="info-value">{t('hero.info.companyValue')}</span>
              </div>
              <div className="info-card">
                <span className="info-label">{t('hero.info.focus')}</span>
                <span className="info-value">{t('hero.info.focusValue')}</span>
              </div>
              <div className="info-card info-card--wide">
                <span className="info-label">{t('hero.info.education')}</span>
                <span className="info-value">
                  {t('hero.info.educationValueLine1')}
                  <br />
                  {t('hero.info.educationValueLine2')}
                </span>
              </div>
              <div className="info-card">
                <span className="info-label">{t('hero.info.contacts')}</span>
                <span className="info-value">{t('hero.info.contactsValue')}</span>
              </div>
            </div>
            <div className="hero-links">
              {heroLinks.map(({ href, label, labelKey }) =>
                href.startsWith('/') ? (
                  <Link key={href} to={localizedPath(href)}>
                    {labelKey ? t(labelKey) : label}
                  </Link>
                ) : (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                    {labelKey ? t(labelKey) : label}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-projects snap-screen" data-node-id="1:285" data-figma-node="1-285">
        <div className="logo-section" data-node-id="1:286">
          <h2 className="projects-title-main" data-node-id="1:289">{t('hero.projectsSectionTitle')}</h2>
          <FilterPills />
        </div>
        <div className="preview-grid" data-node-id="1:297" data-figma-node="1-297">
          {homeProjects.map((item) => (
            <ProjectCard
              key={item.slug}
              slug={item.slug}
              title={tWithFallback(t, `projects.cards.${item.slug}.title`, item.title)}
              meta={tWithFallback(t, `projects.cards.${item.slug}.meta`, item.meta)}
              desc={tWithFallback(t, `projects.cards.${item.slug}.desc`, item.desc)}
              image={item.image}
              isDemo={false}
            />
          ))}
        </div>
        <div className="show-all-wrap" data-node-id="1:397" data-figma-node="1-397">
          <SeamlessProjectsLink to={localizedPath('/projects')} className="btn-show-all">
            {t('hero.allProjects')}
          </SeamlessProjectsLink>
        </div>
        </section>
      </div>
    </div>
  );
}
