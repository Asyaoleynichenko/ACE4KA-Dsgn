import SeamlessProjectsLink from '../components/SeamlessProjectsLink.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';

export default function NotFoundPage() {
  const { t, localizedPath } = useI18n();

  return (
    <div className="page-89-788__wrap layout-89-788 snap-screen" data-route="not-found">
      <header className="page-header">
        <h1>{t('errors.notFoundTitle')}</h1>
        <p>{t('errors.notFoundBody')}</p>
      </header>
      <p>
        <SeamlessProjectsLink to={localizedPath('/')} className="nav-link">
          {t('errors.notFoundHome')}
        </SeamlessProjectsLink>
      </p>
    </div>
  );
}
