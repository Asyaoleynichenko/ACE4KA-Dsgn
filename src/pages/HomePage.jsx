import { Link } from 'react-router-dom';
import PreviewCardBlock from '../components/PreviewCardBlock';
import ProjectCard from '../components/ProjectCard';
import FilterPills from '../components/FilterPills';
import { projects } from '../data/projects';

const heroLinks = [
  { href: 'https://t.me/pnkprty', label: 'Telegram' },
  { href: 'https://behance.net/', label: 'Behance' },
  { href: '#', label: 'Resume' },
  { href: 'mailto:hello@example.com', label: 'Mail' },
  { href: 'https://pinterest.com/', label: 'Pinterest' },
];

const homeProjects = [
  ...projects.slice(0, 5),
  { isDemo: true },
  { isDemo: true },
];

export default function HomePage() {
  return (
    <>
      <section className="hero" data-node-id="1-202" data-figma-node="1-202">
        <div className="hero__top">
          <div className="hero-vector" aria-hidden="true" data-node-id="1:203">
            <div className="hero-vector__inner">
              <img src="/images/main%20title%20vector.svg" alt="" />
            </div>
          </div>
          <div className="hero__card">
            <PreviewCardBlock />
          </div>
        </div>
        <div className="hero__row">
          <div className="hero__content">
            <div className="hero-content">
              <p className="hero-role">Продуктовый дизайнер Mail Почта и Облако</p>
              <h1 className="hero-title">Ася Олейниченко</h1>
              <p className="hero-text">
                5 лет запускаю и развиваю цифровые продукты. Знаю как выстраиваются процессы работает продукт и как просто делать хорошо
              </p>
              <Link to="/about" className="hero-more">Больше обо мне →</Link>
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
                <span className="info-value">ВШЭ Дизайн и программирование</span>
              </div>
              <div className="info-card">
                <span className="info-label">Контакты</span>
                <span className="info-value">@pnkprty</span>
              </div>
            </div>
            <div className="hero-links">
              {heroLinks.map(({ href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-projects" data-figma-node="1-232">
        <div className="logo-section" data-node-id="1:286">
          <h2 className="projects-title-main" data-node-id="1:289">Проекты</h2>
          <FilterPills />
        </div>
        <div className="preview-grid" data-figma-node="1-297">
          {homeProjects.map((item, i) =>
            item.isDemo ? (
              <ProjectCard
                key={`demo-${i}`}
                slug=""
                title="Демо"
                meta="UX/UI · 2024"
                desc="Плейсхолдер проекта"
                image={null}
                isDemo
              />
            ) : (
              <ProjectCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                meta={item.meta}
                desc={item.desc}
                image={item.image}
                isDemo={false}
              />
            )
          )}
        </div>
        <div className="show-all-wrap" data-figma-node="1-398" data-node-id="1:398">
          <Link to="/projects" className="btn-show-all">Смотреть все проекты</Link>
        </div>
      </section>
    </>
  );
}
