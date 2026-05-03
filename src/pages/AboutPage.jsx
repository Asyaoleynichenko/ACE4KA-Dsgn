export default function AboutPage() {
  return (
    <div className="page-about__wrap layout-89-765" data-node-id="89-765">
      <header className="page-header">
        <h1>О себе</h1>
        <p>I’m a product designer focused on monetization, growth, and 0→1 products.</p>
      </header>

      <div className="contact-grid">
        <div className="contact-item contact-item--text">
          <div>
            <strong>Опыт</strong>
            <p>
              I design and launch product solutions that directly impact business metrics — from subscription conversion
              and LTV growth to engagement and retention.
            </p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>Сейчас</strong>
            <p>
              I work on monetization and personalization in the Mail ecosystem (Mail, Cloud, Mail Space): upsell
              flows, product experiments, and close collaboration with analytics and research.
            </p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>До этого</strong>
            <p>
              I led special projects direction, scaling production from scratch and launching 20+ concepts and 23
              projects in 3 months by integrating AI into the content pipeline.
            </p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>Интересы</strong>
            <p>
              Monetization systems and growth design, AI-driven features, community-based products, and new interaction
              models (social, spatial, media).
            </p>
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
