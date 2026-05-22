import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';
import { useLenisScroll } from '../hooks/useLenisScroll.js';
import { getScrollY } from '../utils/scrollRoot.js';

/**
 * Шапка — Figma 573:18422: имя | навигация | язык.
 * Поведение: при скролле вниз — прячется (translateY -100%), при остановке/скролле вверх — появляется.
 */
export default function Header() {
  const { localizedPath, t } = useI18n();
  const [hidden, setHidden] = useState(false);

  const lastYRef = useRef(0);
  const stopTimerRef = useRef(null);

  useEffect(() => {
    lastYRef.current = getScrollY();
  }, []);

  useLenisScroll(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const y = getScrollY();
    const dy = y - lastYRef.current;
    /** Малые движения и top-зону не трогаем — иначе моргает на трекпаде. */
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
