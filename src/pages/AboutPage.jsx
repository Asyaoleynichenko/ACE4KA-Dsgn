export default function AboutPage() {
  return (
    <div className="page-about__wrap layout-89-765" data-node-id="89-765">
      <header className="page-header">
        <h1>О себе</h1>
        <p>Продуктовый дизайнер в Mail: монетизация, медиа, спецпроекты, 0→1.</p>
      </header>

      <div className="contact-grid">
        <div className="contact-item contact-item--text">
          <div>
            <strong>Опыт</strong>
            <p>Почта, облако, тарифы, A/B; медиа и лидерство спецпроектов.</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>Образование</strong>
            <p>ВШЭ, «Дизайн и программирование».</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>Команда</strong>
            <p>Кросс-функциональные команды: от гипотезы до релиза с метриками.</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>Интересы</strong>
            <p>AI в дизайне, поведение пользователей, дизайн-системы.</p>
          </div>
        </div>
        <div className="contact-item">
          <div>
            <strong>Контакты</strong>
            <p>
              <a href="https://t.me/pnkprty" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>
              {' '}или{' '}
              <a href="mailto:hello@example.com">на почту</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
