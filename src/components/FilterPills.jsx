import { useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

const pills = [
  { filter: 'uxui', labelKey: 'filters.uxui' },
  { filter: 'grafika', labelKey: 'filters.grafika' },
  { filter: 'issledovaniya', labelKey: 'filters.issledovaniya' },
  { filter: 'inprogress', labelKey: 'filters.inprogress' },
  { filter: 'shtuki', labelKey: 'filters.shtuki' },
  { filter: 'vsyo', labelKey: 'filters.vsyo' },
];

export default function FilterPills() {
  const { pathname, search } = useLocation();
  const { localizedPath, t } = useI18n();
  const params = new URLSearchParams(search);
  const basePath = stripLocaleFromPathname(pathname);
  const currentFilter = basePath === '/projects' ? params.get('filter') ?? 'vsyo' : null;

  return (
    <nav className="filter-pills" data-node-id="1:290" aria-label={t('filters.aria')}>
      {pills.map(({ filter, labelKey }) => {
        const isActive = currentFilter !== null && currentFilter === filter;
        const to =
          filter === 'vsyo'
            ? localizedPath('/projects')
            : localizedPath(`/projects?filter=${encodeURIComponent(filter)}`);
        return (
          <SeamlessProjectsLink
            key={filter}
            to={to}
            className={`filter-pill${isActive ? ' filter-pill--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {t(labelKey)}
          </SeamlessProjectsLink>
        );
      })}
    </nav>
  );
}
