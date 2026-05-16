import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import SeamlessProjectsLink from '../components/SeamlessProjectsLink.jsx';
import IconAssembleFromDots from '../components/IconAssembleFromDots.jsx';
import PreviewCardBlock from '../components/PreviewCardBlock';
import ProjectCard from '../components/ProjectCard';
import DotIcon from '../components/DotIcon.jsx';
import HomeCompetenciesScrub from '../components/HomeCompetenciesScrub.jsx';
import HalftoneButton from '../components/HalftoneButton.jsx';
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

/** Путь для плавающего img: пустой / null / undefined из данных не считаем за картинку. */
function competencyCardImageSrc(raw) {
  const s = String(raw ?? '').trim();
  if (!s || /^null$/i.test(s) || /^undefined$/i.test(s)) return '';
  return s;
}

/** Текст для aria / screen reader из словаря `cards.tl` | `cards.br`. */
function competencyCardAriaLabel(card) {
  if (!card) return '';
  return [card.title, card.subtitle].filter(Boolean).join('. ');
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

const HOME_COMPETENCIES_FIGMA_URL =
  'https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=418-21263&m=dev';

export default function HomePage() {
  const { t, localizedPath, messages } = useI18n();
  const competencyLines = messages.hero?.competencies?.lines ?? [];
  const competencyLineProjectSlugs = messages.hero?.competencies?.lineProjectSlugs;
  const competencyBadge = messages.hero?.competencies?.badge ?? '';
  const competencyCardTl = messages.hero?.competencies?.cards?.tl;
  const competencyCardBr = messages.hero?.competencies?.cards?.br;
  const cardImgTl = competencyCardImageSrc(messages.hero?.competencies?.cardImages?.tl);
  const cardImgBr = competencyCardImageSrc(messages.hero?.competencies?.cardImages?.br);
  const showCompetencyTextCards = !cardImgTl || !cardImgBr;

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
                  <span className="header-item__label"><span className="text-condensed">{t(labelKey)}</span></span>
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
                  <span className="header-item__label"><span className="text-condensed">{t(labelKey)}</span></span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="hero__row" data-node-id="1:232">
          <div className="hero__content">
            <div className="hero-content">
              <p className="hero-role"><span className="text-condensed">{t('hero.role')}</span></p>
              <h1 className="hero-title" data-scale="hero-name">{t('hero.title')}</h1>
              <p className="hero-text">{t('hero.text')}</p>
              <Link to={localizedPath('/about')} className="hero-more">
                <span className="hero-more__text"><span className="text-condensed">{t('hero.moreAbout')}</span></span>
              </Link>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <span className="info-label"><span className="text-condensed">{t('hero.info.location')}</span></span>
                <span className="info-value">{t('hero.info.locationValue')}</span>
              </div>
              <div className="info-card">
                <span className="info-label"><span className="text-condensed">{t('hero.info.company')}</span></span>
                <span className="info-value">{t('hero.info.companyValue')}</span>
              </div>
              <div className="info-card">
                <span className="info-label"><span className="text-condensed">{t('hero.info.focus')}</span></span>
                <span className="info-value">{t('hero.info.focusValue')}</span>
              </div>
              <div className="info-card info-card--wide">
                <span className="info-label"><span className="text-condensed">{t('hero.info.education')}</span></span>
                <span className="info-value">{t('hero.info.educationValue')}</span>
              </div>
              <div className="info-card">
                <span className="info-label"><span className="text-condensed">{t('hero.info.contacts')}</span></span>
                <span className="info-value">{t('hero.info.contactsValue')}</span>
              </div>
            </div>
            <div className="hero-links">
              {heroLinks.map(({ href, label, labelKey }) =>
                href.startsWith('/') ? (
                  <Link key={href} to={localizedPath(href)}>
                    <span className="text-condensed">{labelKey ? t(labelKey) : label}</span>
                  </Link>
                ) : (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                    <span className="text-condensed">{labelKey ? t(labelKey) : label}</span>
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {competencyLines.length ? (
        <section
          className="home-competencies"
          data-node-id="418:21263"
          data-figma-url={HOME_COMPETENCIES_FIGMA_URL}
          aria-label={t('hero.competencies.aria')}
        >
          <HomeCompetenciesScrub
            lines={competencyLines}
            lineProjectSlugs={competencyLineProjectSlugs}
            homeProjectSlugs={HOME_PROJECT_SLUGS}
            projects={projects}
            ariaLabel={t('hero.competencies.aria')}
          >
            {cardImgTl || cardImgBr ? (
              <div className="home-competencies__floats">
                {cardImgTl ? (
                  <a
                    className="home-competencies__float home-competencies__float--tl"
                    href="https://t.me/pnkprty"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={publicUrl(cardImgTl)}
                      alt=""
                      width={338}
                      height={199}
                      className="home-competencies__float-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                ) : null}
                {cardImgBr ? (
                  <img
                    src={publicUrl(cardImgBr)}
                    alt=""
                    width={338}
                    height={199}
                    className="home-competencies__float home-competencies__float-img home-competencies__float--br"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
            ) : null}
            {showCompetencyTextCards ? (
              <div className="home-competencies__cards">
                {!cardImgTl ? (
                  <a
                    className="home-competencies__card home-competencies__card--tl home-competencies__card--figma418"
                    href="https://t.me/pnkprty"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={competencyCardAriaLabel(competencyCardTl) || t('hero.competencies.cards.tl.title')}
                  >
                    {competencyBadge ? (
                      <span className="home-competencies__badge"><span className="text-condensed">{competencyBadge}</span></span>
                    ) : null}
                    <div className="home-competencies__card-bg" aria-hidden="true" />
                    <div className="home-competencies__card-mesh" aria-hidden="true" />
                    <div className="home-competencies__card-glow" aria-hidden="true" />
                    <div className="home-competencies__glyph-stage" aria-hidden="true">
                      <span className="home-competencies__glyph-slab">
                        <span className="home-competencies__glyph">@</span>
                      </span>
                    </div>
                    <span className="home-competencies__spark home-competencies__spark--a" aria-hidden="true" />
                    <span className="home-competencies__spark home-competencies__spark--b" aria-hidden="true" />
                    <span className="home-competencies__spark home-competencies__spark--c" aria-hidden="true" />
                    <span className="home-competencies__spark home-competencies__spark--d" aria-hidden="true" />
                  </a>
                ) : null}
                {!cardImgBr ? (
                  <div
                    className="home-competencies__card home-competencies__card--br home-competencies__card--figma418"
                    role="img"
                    aria-label={competencyCardAriaLabel(competencyCardBr) || t('hero.competencies.decorCardAria')}
                  >
                    {competencyBadge ? (
                      <span className="home-competencies__badge"><span className="text-condensed">{competencyBadge}</span></span>
                    ) : null}
                    <div className="home-competencies__card-bg" aria-hidden="true" />
                    <div className="home-competencies__card-mesh" aria-hidden="true" />
                    <div className="home-competencies__card-glow" aria-hidden="true" />
                    <div className="home-competencies__glyph-stage" aria-hidden="true">
                      <span className="home-competencies__glyph-slab">
                        <span className="home-competencies__glyph">@</span>
                      </span>
                    </div>
                    <span className="home-competencies__spark home-competencies__spark--a" aria-hidden="true" />
                    <span className="home-competencies__spark home-competencies__spark--b" aria-hidden="true" />
                    <span className="home-competencies__spark home-competencies__spark--c" aria-hidden="true" />
                    <span className="home-competencies__spark home-competencies__spark--d" aria-hidden="true" />
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="home-competencies__cta">
              <HalftoneButton to={localizedPath('/projects')}>{t('hero.allProjects')}</HalftoneButton>
            </div>
          </HomeCompetenciesScrub>
        </section>
      ) : null}

      <section className="section section-projects snap-screen" data-node-id="1:285" data-figma-node="1-285">
        <div className="logo-section" data-node-id="1:286">
          <h2 className="projects-title-main" data-node-id="1:289" data-scale="section-title">{t('hero.projectsSectionTitle')}</h2>
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
        </section>
      </div>
    </div>
  );
}
