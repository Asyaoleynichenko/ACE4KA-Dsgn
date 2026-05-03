import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/projects', label: 'Проекты' },
  { to: '/about', label: 'О\u00a0себе' },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header" data-node-id="300:107467" data-name="Header">
      <nav className="nav">
        <Link to="/" className="logo" data-node-id="300:107467-logo">
          <span className="blend-text">{'Ася\u00a0Олейниченко'}</span>
        </Link>
        <ul className={`nav-list${menuOpen ? ' open' : ''}`} data-node-id="300:107467-nav">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`nav-link${location.pathname === to || (to === '/projects' && location.pathname.startsWith('/project')) ? ' active' : ''}`}
                onClick={closeMenu}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <span className="lang-switch" data-node-id="300:107467-lang">
          <span className="blend-text">[Eng / rus]</span>
        </span>
        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          aria-label="Меню"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
