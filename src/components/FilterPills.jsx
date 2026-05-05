import { NavLink } from 'react-router-dom';

const pills = [
  { to: '/projects', filter: 'uxui', label: 'UX/UI', variant: 'uxui' },
  { to: '/projects', filter: 'grafika', label: 'Графика', variant: 'grafika' },
  { to: '/projects', filter: 'issledovaniya', label: 'Исследования', variant: 'research' },
  { to: '/projects', filter: 'inprogress', label: 'In progress', variant: 'inprogress' },
  { to: '/projects', filter: 'shtuki', label: 'Things', variant: 'things' },
  { to: '/projects', filter: 'vsyo', label: 'Всё', variant: 'all' },
];

export default function FilterPills() {
  return (
    <nav className="filter-pills" data-node-id="1:290" aria-label="Фильтр проектов">
      {pills.map(({ to, label, variant }) => (
        <NavLink key={label} to={to} className={`filter-pill filter-pill--${variant}`} end>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
