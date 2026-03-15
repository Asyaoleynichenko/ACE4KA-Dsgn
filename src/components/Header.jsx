import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/projects', label: 'Проекты' },
  { to: '/about', label: 'О себе' },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`} data-node-id="1-230">
      <nav className="nav">
        <Link to="/" className="logo" data-node-id="1-230-logo">
          <span className="blend-text">Ася Олейниченко</span>
        </Link>
        <ul className={`nav-list${menuOpen ? ' open' : ''}`} data-node-id="1-230-nav">
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
        <span className="lang-switch" data-node-id="1-230-lang">
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
