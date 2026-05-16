import { useI18n } from '../i18n/I18nProvider.jsx';

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="page-contact__wrap snap-screen" data-node-id="89-756">
      <header className="page-header">
        <h1>{t('contact.title')}</h1>
        <p>
          <a href="https://t.me/pnkprty" target="_blank" rel="noopener noreferrer">
            {t('contact.telegram')}
          </a>{' '}
          {t('contact.or')}{' '}
          <a href="mailto:hello@example.com">{t('contact.mailTo')}</a>
        </p>
      </header>

      <div className="contact-grid">
        <div className="contact-item">
          <span aria-hidden="true">✉</span>
          <div>
            <strong><span className="text-condensed">{t('contact.labels.mail')}</span></strong>
            <a href="mailto:hello@example.com">hello@example.com</a>
          </div>
        </div>
        <div className="contact-item">
          <span aria-hidden="true">📱</span>
          <div>
            <strong><span className="text-condensed">{t('contact.labels.telegram')}</span></strong>
            <a href="https://t.me/pnkprty" target="_blank" rel="noopener noreferrer">
              @pnkprty
            </a>
          </div>
        </div>
        <div className="contact-item">
          <span aria-hidden="true">💼</span>
          <div>
            <strong><span className="text-condensed">{t('contact.labels.behance')}</span></strong>
            <a href="https://behance.net/" target="_blank" rel="noopener noreferrer">
              behance.net
            </a>
          </div>
        </div>
        <div className="contact-item">
          <span aria-hidden="true">📌</span>
          <div>
            <strong><span className="text-condensed">{t('contact.labels.pinterest')}</span></strong>
            <a href="https://pinterest.com/" target="_blank" rel="noopener noreferrer">
              pinterest.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
