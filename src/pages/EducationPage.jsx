import { useI18n } from '../i18n/I18nProvider.jsx';

export default function EducationPage() {
  const { t } = useI18n();

  return (
    <div className="page-89-788__wrap layout-89-788 snap-screen" data-node-id="89-788">
      <header className="page-header">
        <h1>{t('education.title')}</h1>
        <p>{t('education.subtitle')}</p>
      </header>

      <div className="contact-grid">
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('education.hseTitle')}</strong>
            <p>{t('education.hseText')}</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('education.coursesTitle')}</strong>
            <p>{t('education.coursesText')}</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('education.languagesTitle')}</strong>
            <p>{t('education.languagesText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
