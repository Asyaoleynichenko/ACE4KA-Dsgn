import { Link, useLocation } from 'react-router-dom';

export const NAV_ITEMS = [
  { to: '/', label: 'Главная' },
  { to: '/projects', label: 'Проекты' },
  { to: '/about', label: 'О\u00a0себе' },
];

function itemIsActive(pathname, to) {
  if (to === '/projects') {
    return pathname === '/projects' || pathname.startsWith('/project');
  }
  return pathname === to;
}

/**
 * Навигация: внешнее стекло + вложенная активная капсула (макет).
 */
export function Navigation({ menuOpen, onItemClick }) {
  const { pathname } = useLocation();
  const navListBlur = {
    backdropFilter: 'blur(50px) saturate(1.85)',
    WebkitBackdropFilter: 'blur(50px) saturate(1.85)',
  };

  return (
    <ul
      className={`nav-list${menuOpen ? ' open' : ''}`}
      data-node-id="I300:104227;10:1530"
      aria-label="Основное меню"
      style={navListBlur}
    >
      {NAV_ITEMS.map(({ to, label }) => {
        const active = itemIsActive(pathname, to);
        return (
          <li key={to}>
            <Link
              to={to}
              className={`nav-link${active ? ' active' : ''}`}
              onClick={onItemClick}
            >
              <span className="blend-text">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
