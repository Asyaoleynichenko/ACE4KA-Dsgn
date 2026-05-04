import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Navigation } from './Navigation';

export default function Header({ mode = 'default' }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const headerClass =
    mode === 'in-hero' ? 'header header--in-hero' : 'header';

  return (
    <header
      className={headerClass}
      data-node-id="300:104227"
      data-name="Header"
    >
      <nav className="nav">
        <Link to="/" className="logo" data-node-id="300:107467-logo">
          <span className="blend-text">{'Ася\u00a0Олейниченко'}</span>
        </Link>
        <Navigation menuOpen={menuOpen} onItemClick={closeMenu} />
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
