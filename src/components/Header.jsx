import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SmartLink from './SeamlessProjectsLink.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';
import { useLenisScroll } from '../hooks/useLenisScroll.js';
import { getScrollY } from '../utils/scrollRoot.js';
import { fitScaledNavWidths } from '../utils/fitScaledNavWidths.js';

/**
 * Шапка — Figma 573:18422: имя | навигация | язык.
 * Видна на верху; при скролле вниз — прячется, при скролле вверх / остановке — появляется.
 */
export default function Header() {
  const { localizedPath, t, locale } = useI18n();
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const lastYRef = useRef(0);
  const stopTimerRef = useRef(null);

  useEffect(() => {
    lastYRef.current = getScrollY();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 56.25rem)');
    const sync = () => setMobileNav(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-drawer-open', menuOpen);
    return () => document.body.classList.remove('nav-drawer-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  /* JS-фикс: подгоняем layout-ширину пунктов шапки к visible (scaleX) ширине,
     чтобы пункты с разной длиной выравнивались равномерно. */
  useEffect(() => {
    const cleanup = fitScaledNavWidths(document);
    return cleanup;
  }, [pathname, locale]);

  useLenisScroll(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (menuOpen) return;
    /* Десктоп: шапка всегда видна — быстрый переход между разделами. */
    if (!window.matchMedia('(max-width: 56.25rem)').matches) {
      setHidden(false);
      lastYRef.current = getScrollY();
      return;
    }
    const y = getScrollY();
    const dy = y - lastYRef.current;
    if (y < 80) {
      setHidden(false);
    } else if (dy > 6) {
      setHidden(true);
    } else if (dy < -6) {
      setHidden(false);
    }
    lastYRef.current = y;
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(() => setHidden(false), 240);
  });

  return (
    <header
      className={`header${hidden ? ' header--hidden' : ''}${menuOpen ? ' header--menu-open' : ''}`}
      data-name="Header"
      data-node-id="573-18422"
      data-figma-node="573-18422"
    >
      <button
        type="button"
        className={`nav-scrim${menuOpen ? ' nav-scrim--visible' : ''}`}
        aria-label={t('header.closeMenu')}
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />
      <nav className="nav" aria-label={t('header.navListAria')}>
        <SmartLink
          to={localizedPath('/')}
          className="logo"
          data-node-id="573-20950"
          style={{ viewTransitionName: 'site-logo' }}
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-condensed text-condensed--single-line">{t('common.brandName')}</span>
        </SmartLink>
        <div
          className={`header-mobile-menu${menuOpen ? ' header-mobile-menu--open' : ''}`}
          inert={!menuOpen && mobileNav ? '' : undefined}
        >
          <Navigation menuOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
        </div>
        <div className="header-bar-actions">
          <span className="lang-switch" data-node-id="573-20952">
            <LanguageSwitcher />
          </span>
          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' active' : ''}`}
            aria-label={menuOpen ? t('header.closeMenu') : t('header.menuAria')}
            aria-expanded={menuOpen}
            aria-controls="site-nav-list"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
