export default function ContactPage() {
  return (
    <div className="page-contact__wrap" data-node-id="89-756">
      <header className="page-header">
        <h1>Контакты</h1>
        <p>
          <a href="https://t.me/pnkprty" target="_blank" rel="noopener noreferrer">
            Написать в Telegram
          </a>
          {' '}
          или{' '}
          <a href="mailto:hello@example.com">на почту</a>
        </p>
      </header>

      <div className="contact-grid">
        <div className="contact-item">
          <span aria-hidden="true">✉</span>
          <div>
            <strong>Mail</strong>
            <a href="mailto:hello@example.com">hello@example.com</a>
          </div>
        </div>
        <div className="contact-item">
          <span aria-hidden="true">📱</span>
          <div>
            <strong>Telegram</strong>
            <a href="https://t.me/pnkprty" target="_blank" rel="noopener noreferrer">
              @pnkprty
            </a>
          </div>
        </div>
        <div className="contact-item">
          <span aria-hidden="true">💼</span>
          <div>
            <strong>Behance</strong>
            <a href="https://behance.net/" target="_blank" rel="noopener noreferrer">
              behance.net
            </a>
          </div>
        </div>
        <div className="contact-item">
          <span aria-hidden="true">📌</span>
          <div>
            <strong>Pinterest</strong>
            <a href="https://pinterest.com/" target="_blank" rel="noopener noreferrer">
              pinterest.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
