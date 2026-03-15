import { NavLink } from 'react-router-dom';

const pills = [
  { to: '/projects', filter: 'uxui', label: 'UX/UI' },
  { to: '/projects', filter: 'grafika', label: 'Графика' },
  { to: '/projects', filter: 'issledovaniya', label: 'Исследования' },
  { to: '/projects', filter: 'inprogress', label: 'In progress' },
  { to: '/projects', filter: 'shtuki', label: 'Штуки' },
  { to: '/projects', filter: 'vsyo', label: 'Всё' },
];

export default function FilterPills() {
  return (
    <nav className="filter-pills" data-node-id="1-290" aria-label="Фильтр проектов">
      {pills.map(({ to, label }) => (
        <NavLink key={label} to={to} className="filter-pill" end>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
