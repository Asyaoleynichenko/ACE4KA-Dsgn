import { useI18n } from '../i18n/I18nProvider.jsx';

/** Заглушки страниц по макетам Figma 89-xxx. */
export default function DraftFigmaPlaceholderPage({ figmaId }) {
  const { t } = useI18n();

  return (
    <div className={`page-${figmaId}__wrap layout-${figmaId} snap-screen`} data-node-id={figmaId}>
      <header className="page-header">
        <h1>{t('draftPage.title', { id: figmaId })}</h1>
        <p>{t('draftPage.subtitle', { id: figmaId })}</p>
      </header>
      <div className="contact-grid">
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('draftPage.blockTitle', { n: 1 })}</strong>
            <p>{t('draftPage.blockText')}</p>
          </div>
        </div>
        <div className="contact-item contact-item--text">
          <div>
            <strong>{t('draftPage.blockTitle', { n: 2 })}</strong>
            <p>{t('draftPage.blockText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
