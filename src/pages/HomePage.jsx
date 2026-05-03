import { Link } from 'react-router-dom';
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
  { href: '/resume', label: 'Резюме' },
  { href: 'mailto:hello@example.com', label: 'Mail' },
  { href: 'https://pinterest.com/', label: 'Pinterest' },
];

/** Порядок и число карточек — Figma 1:285 (сетка 2×4, 1290px). */
const HOME_PROJECT_SLUGS = [
  'mail-nauki',
  'mail-spetsproekty',
  'drop',
  'inkz',
  'loochok',
  'neural',
  'retrash',
  'biohacking',
];

const homeProjects = HOME_PROJECT_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);

export default function HomePage() {
  return (
    <div className="home-page" data-node-id="89:347" data-name="Главная">
      <section className="hero" data-node-id="1-202" data-figma-node="1-202">
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
          <nav className="section-nav section-nav--home section-nav--overlay" aria-label="Разделы">
            <div className="header-items header-items--figma">
              {headerItemsFolder.map(({ nodeId, label, iconKey, to, placement }) => (
                <Link
                  key={nodeId}
                  to={to}
                  className="header-item header-item--folder"
                  data-node-id={nodeId}
                  style={headerItemPlacementStyle(placement)}
                >
                  <div className="header-item__icon-wrap">
                    <img src={SECTION_HEADER_IMAGES[iconKey]} alt="" width={99} height={90} />
                  </div>
                  <span className="header-item__label">{label}</span>
                </Link>
              ))}
              {headerItemsWell.map(({ nodeId, label, iconKey, to, placement }) => (
                <Link
                  key={nodeId}
                  to={to}
                  className="header-item header-item--image-well"
                  data-node-id={nodeId}
                  style={headerItemPlacementStyle(placement)}
                >
                  <div className="header-item__well">
                    <img src={SECTION_HEADER_IMAGES[iconKey]} alt="" />
                  </div>
                  <span className="header-item__label">{label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="hero__row" data-node-id="1:232">
          <div className="hero__content">
            <div className="hero-content">
              <p className="hero-role">Продуктовый дизайнер · Mail Почта и Облако</p>
              <h1 className="hero-title">Ася Олейниченко</h1>
              <p className="hero-text">
                5 лет запускаю и развиваю цифровые продукты. Знаю, как выстраиваются процессы, как работает продукт и
                как делать продукт проще и лучше.
              </p>
              <Link to="/about" className="hero-more hero-more--with-icon">
                <span className="hero-more__text">О себе</span>
                <span className="hero-more__chevron" aria-hidden="true" />
              </Link>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <span className="info-label">Локация</span>
                <span className="info-value">Москва</span>
              </div>
              <div className="info-card">
                <span className="info-label">Компания</span>
                <span className="info-value">VK</span>
              </div>
              <div className="info-card">
                <span className="info-label">Направление</span>
                <span className="info-value">Монетизация</span>
              </div>
              <div className="info-card info-card--wide">
                <span className="info-label">Образование</span>
                <span className="info-value">
                  ВШЭ Дизайн
                  <br />
                  и программирование
                </span>
              </div>
              <div className="info-card">
                <span className="info-label">Контакты</span>
                <span className="info-value">@pnkprty</span>
              </div>
            </div>
            <div className="hero-links">
              {heroLinks.map(({ href, label }) =>
                href.startsWith('/') ? (
                  <Link key={label} to={href}>
                    {label}
                  </Link>
                ) : (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-projects" data-node-id="1:285" data-figma-node="1-285">
        <div className="logo-section" data-node-id="1:286">
          <h2 className="projects-title-main" data-node-id="1:289">Проекты</h2>
          <FilterPills />
        </div>
        <div className="preview-grid" data-node-id="1:297" data-figma-node="1-297">
          {homeProjects.map((item) => (
            <ProjectCard
              key={item.slug}
              slug={item.slug}
              title={item.title}
              meta={item.meta}
              desc={item.desc}
              image={item.image}
              isDemo={false}
            />
          ))}
        </div>
        <div className="show-all-wrap" data-node-id="1:397" data-figma-node="1-397">
          <Link to="/projects" className="btn-show-all">Все проекты</Link>
        </div>
      </section>
    </div>
  );
}
