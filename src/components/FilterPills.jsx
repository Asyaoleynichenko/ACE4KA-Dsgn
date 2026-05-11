import { useLocation } from 'react-router-dom';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

const pills = [
  { filter: 'uxui', label: 'UX/UI' },
  { filter: 'grafika', label: 'Графика' },
  { filter: 'issledovaniya', label: 'Исследования' },
  { filter: 'inprogress', label: 'In progress' },
  { filter: 'shtuki', label: 'Things' },
  { filter: 'vsyo', label: 'Всё' },
];

export default function FilterPills() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  /** На странице проектов активен таб, совпадающий с ?filter= (по умолчанию «Всё»). На главной ни один не активен. */
  const currentFilter = pathname === '/projects' ? params.get('filter') ?? 'vsyo' : null;

  return (
    <nav className="filter-pills" data-node-id="1:290" aria-label="Фильтр проектов">
      {pills.map(({ filter, label }) => {
        const isActive = currentFilter !== null && currentFilter === filter;
        const to = filter === 'vsyo' ? '/projects' : `/projects?filter=${encodeURIComponent(filter)}`;
        return (
          <SeamlessProjectsLink
            key={filter}
            to={to}
            className={`filter-pill${isActive ? ' filter-pill--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </SeamlessProjectsLink>
        );
      })}
    </nav>
  );
}
