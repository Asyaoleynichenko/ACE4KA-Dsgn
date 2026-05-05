import { Link } from 'react-router-dom';

const skills = [
  'UX/UI',
  'Продуктовый дизайн',
  'Дизайн-системы',
  'Исследования',
  'A/B и продуктовые эксперименты',
  'Монетизация',
  'Персонализация',
  'AI в продакшене',
  'Figma',
];

const experience = [
  {
    title: 'Продуктовый дизайнер',
    org: 'VK · Mail Почта и Облако',
    period: '2022 — сейчас',
    text:
      'Монетизация и персонализация в экосистеме Mail: апселлы, подписки, сценарии роста LTV, тесная работа с аналитикой и исследованиями.',
  },
  {
    title: 'Head of Product Design',
    org: 'Bang Bang Education',
    period: '2024 — 2025',
    text:
      'Руководство продуктовым дизайном образовательных продуктов: процессы, качество релизов, связка дизайна с метриками и контентом.',
  },
  {
    title: 'Спецпроекты и контент',
    org: 'Mail',
    period: 'ранее',
    text:
      'Запуск направления спецпроектов с нуля: десятки концепций, интеграция AI в пайплайн, масштабирование производства.',
  },
];

const education = [
  {
    school: 'НИУ ВШЭ',
    years: '2021 — 2025',
    line: 'Факультет коммуникаций, медиа и дизайна',
    detail: 'Дизайн и программирование',
    extra: 'Средний балл 8,82',
  },
  {
    school: 'Bang Bang Education',
    years: '2025',
    line: 'Head of Product Design',
    detail: 'Интенсив по продуктовому дизайну и лидерству',
    extra: null,
  },
  {
    school: 'UI-курс',
    years: '2025',
    line: 'Вика Бреусова',
    detail: 'Лид-дизайнер Яндекс Путешествий',
    extra: null,
  },
  {
    school: 'VK Education',
    years: '2023 — сейчас',
    line: 'Воркшопы и образовательные форматы',
    detail: 'Практика продуктового дизайна и командной работы',
    extra: null,
  },
];

const aboutFooterLinks = [
  { href: 'https://t.me/pnkprty', label: 'Telegram', external: true },
  { href: 'https://pinterest.com/', label: 'Pinterest', external: true },
  { href: 'https://behance.net/', label: 'Behance', external: true },
  { href: '/resume', label: 'Резюме', external: false },
  { href: 'mailto:hello@example.com', label: 'Email', external: true },
  { href: 'https://dribbble.com/', label: 'Dribbble', external: true },
  { href: 'https://linkedin.com/', label: 'LinkedIn', external: true },
  { href: '/projects', label: 'Проекты', external: false },
  { href: '/contact', label: 'Контакты', external: false },
];

export default function AboutPage() {
  return (
    <div className="about-page" data-node-id="140:12528" data-name="Background">
      <header className="about-page__intro">
        <h1 className="about-page__name">Ася Олейниченко</h1>
        <div className="about-page__lead">
          <p>
            Продуктовый дизайнер в Mail (VK): монетизация, персонализация и запуск фич в почте и облаке. Пять лет в
            продукте — от исследований и прототипов до релизов и экспериментов с метриками.
          </p>
          <p>
            Интересуюсь системами роста, AI в интерфейсах и тем, как дизайн помогает бизнесу и людям одновременно.
            Открыта к обсуждению новых ролей и коллабораций.
          </p>
        </div>
      </header>

      <div className="about-page__grid" id="experience">
        <section className="about-page__panel about-page__panel--experience" aria-labelledby="about-exp-heading">
          <h2 className="about-page__panel-title" id="about-exp-heading">
            Опыт работы
          </h2>
          <ul className="about-page__card-list">
            {experience.map((job) => (
              <li key={job.org + job.period} className="about-page__job-card">
                <p className="about-page__job-period">{job.period}</p>
                <h3 className="about-page__job-title">{job.title}</h3>
                <p className="about-page__job-org">{job.org}</p>
                <p className="about-page__job-text">{job.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-page__panel about-page__panel--skills" aria-labelledby="about-skills-heading">
          <h2 className="about-page__panel-title" id="about-skills-heading">
            Навыки
          </h2>
          <ul className="about-page__skills">
            {skills.map((s) => (
              <li key={s} className="about-page__skill-pill">
                {s}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="about-page__section" id="education" aria-labelledby="about-edu-heading">
        <h2 className="about-page__section-title" id="about-edu-heading">
          Образование
        </h2>
        <ul className="about-page__edu-grid">
          {education.map((e) => (
            <li key={e.school + e.years} className="about-page__edu-card">
              <p className="about-page__edu-years">{e.years}</p>
              <h3 className="about-page__edu-school">{e.school}</h3>
              <p className="about-page__edu-line">{e.line}</p>
              <p className="about-page__edu-detail">{e.detail}</p>
              {e.extra ? <p className="about-page__edu-extra">{e.extra}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="about-page__section about-page__section--compact" id="team" aria-labelledby="about-team-heading">
        <h2 className="about-page__section-title" id="about-team-heading">
          Команда
        </h2>
        <p className="about-page__muted">
          Работаю в кросс-функциональных командах с продактами, аналитикой, разработкой и исследователями — от
          гипотезы до пост-анализа эксперимента.
        </p>
      </section>

      <section
        className="about-page__section about-page__section--compact"
        id="habitat"
        aria-labelledby="about-habitat-heading"
      >
        <h2 className="about-page__section-title" id="about-habitat-heading">
          Вне работы
        </h2>
        <p className="about-page__muted">
          Город, музыка, визуальный шум интернета и бесконечный поток референсов — то, откуда черпаю настроение для
          интерфейсов и арт-дирекции.
        </p>
      </section>

      <section className="about-page__section about-page__section--compact" id="memes" aria-labelledby="about-memes-heading">
        <h2 className="about-page__section-title" id="about-memes-heading">
          Любимые мемы воображаемых людей
        </h2>
        <p className="about-page__muted">
          Коллекция абсурдных картинок и цитат без контекста — напоминание, что продукт живёт в культуре, а не только в
          метриках.
        </p>
      </section>

      <footer className="about-page__strip" data-node-id="about-strip">
        <div className="about-page__strip-row">
          <div className="about-page__status">
            <span className="about-page__status-dot" aria-hidden="true" />
            <span>Открыта для работы</span>
          </div>
          <nav className="about-page__strip-links" aria-label="Ссылки">
            {aboutFooterLinks.map(({ href, label, external }) =>
              external ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="about-page__strip-link">
                  {label}
                </a>
              ) : (
                <Link key={label} to={href} className="about-page__strip-link">
                  {label}
                </Link>
              ),
            )}
          </nav>
        </div>
        <p className="about-page__strip-note">
          Сайт в разработке. Часть вёрстки собрана с помощью нейросети и доработана вручную. Что-то сломалось —{' '}
          <a href="mailto:hello@example.com">написать на почту</a>.
        </p>
      </footer>
    </div>
  );
}
