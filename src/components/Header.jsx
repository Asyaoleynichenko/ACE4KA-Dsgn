import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const lastYRef = useRef(0);
  const stopTimerRef = useRef(null);

  useEffect(() => {
    lastYRef.current = getScrollY();
  }, []);

  /* JS-фикс: подгоняем layout-ширину пунктов шапки к visible (scaleX) ширине,
     чтобы пункты с разной длиной выравнивались равномерно. */
  useEffect(() => {
    const cleanup = fitScaledNavWidths(document);
    return cleanup;
  }, [pathname, locale]);

  useLenisScroll(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      className={`header${hidden ? ' header--hidden' : ''}`}
      data-name="Header"
      data-node-id="573-18422"
      data-figma-node="573-18422"
    >
      <nav className="nav" aria-label={t('header.navListAria')}>
        <Link to={localizedPath('/')} className="logo" data-node-id="573-20950">
          <span className="text-condensed--single-line">{t('common.brandName')}</span>
        </Link>
        <Navigation />
        <span className="lang-switch" data-node-id="573-20952">
          <LanguageSwitcher />
        </span>
      </nav>
    </header>
  );
}
