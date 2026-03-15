import { Link } from 'react-router-dom';

const headerItemsFolder = [
  { nodeId: '1-206', label: 'Опыт', icon: '/images/icons/folder.svg', to: '#experience' },
  { nodeId: '1-209', label: 'Связь', icon: '/images/icons/folder.svg', to: '/contact' },
  { nodeId: '1-224', label: 'Краткий обзор на проекты', icon: '/images/icons/projects.svg', to: '/projects' },
  { nodeId: '1-227', label: 'Образование', icon: '/images/icons/folder.svg', to: '#education' },
];

const headerItemsWell = [
  { nodeId: '1-212', label: 'Связь', icon: '/images/icons/contact.svg', to: '/contact' },
  { nodeId: '1-215', label: 'Связь', icon: '/images/icons/contact.svg', to: '/contact' },
  { nodeId: '1-218', label: 'Команда', icon: '/images/icons/team.svg', to: '#team' },
  { nodeId: '1-221', label: 'Я в естественной среде обитания', icon: '/images/icons/habitat.svg', to: '#habitat' },
];

export default function AboutPage() {
  return (
    <div className="page-about-wrap">
      <header className="page-header">
        <h1>О себе</h1>
        <p>Продуктовый дизайнер с опытом в Mail, Облако и других продуктах.</p>
      </header>

      <nav className="section-nav" aria-label="Разделы">
        <div className="header-items">
          {headerItemsFolder.map(({ nodeId, label, icon, to }) => (
            <Link
              key={nodeId}
              to={to}
              className="header-item header-item--folder"
              data-node-id={nodeId}
            >
              <div className="header-item__icon-wrap">
                <img src={icon} alt="" width={99} height={90} />
              </div>
              <span className="header-item__label">{label}</span>
            </Link>
          ))}
          {headerItemsWell.map(({ nodeId, label, icon, to }) => (
            <Link
              key={nodeId}
              to={to}
              className="header-item header-item--image-well"
              data-node-id={nodeId}
            >
              <div className="header-item__well">
                <img src={icon} alt="" />
              </div>
              <span className="header-item__label">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <section id="experience" className="about-content">
        <h2 className="about-content__title">Опыт</h2>
        <p className="description">Продуктовый дизайнер в Mail, Облако и других продуктах.</p>
      </section>
      <section id="education" className="about-content">
        <h2 className="about-content__title">Образование</h2>
        <p className="description">ВШЭ, направление «Дизайн и программирование».</p>
      </section>
      <section id="team" className="about-content">
        <h2 className="about-content__title">Команда</h2>
        <p className="description">Опыт работы в кросс-функциональных командах.</p>
      </section>
      <section id="habitat" className="about-content">
        <h2 className="about-content__title">Я в естественной среде обитания</h2>
        <p className="description">Люблю исследовать новые инструменты, читаю о психологии пользователей и дизайн-системах.</p>
      </section>
      <section className="about-content">
        <p className="description">Напишите мне в <a href="https://t.me/pnkprty">Telegram</a> или на <a href="mailto:hello@example.com">email</a>.</p>
      </section>
    </div>
  );
}
