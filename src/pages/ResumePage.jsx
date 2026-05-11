import { useI18n } from '../i18n/I18nProvider.jsx';

export default function ResumePage() {
  const { t } = useI18n();

  return (
    <div className="page-89-766__wrap layout-89-766 snap-screen" data-node-id="89-766">
      <header className="page-header">
        <h1>{t('resume.title')}</h1>
        <p>{t('resume.subtitle')}</p>
      </header>

      <div className="contact-grid">
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('resume.experienceTitle')}</strong>
            <p>{t('resume.experienceText')}</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('resume.skillsTitle')}</strong>
            <p>{t('resume.skillsText')}</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('resume.educationTitle')}</strong>
            <p>{t('resume.educationText')}</p>
          </div>
        </div>
        <div className="contact-item">
          <div>
            <strong>{t('resume.downloadTitle')}</strong>
            <a href="#">{t('resume.downloadLink')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
