import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';
import { useLenisScroll } from '../hooks/useLenisScroll.js';
import { getScrollY } from '../utils/scrollRoot.js';

/**
 * Шапка — Figma: имя | навигация | язык, mix-blend-mode: difference.
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
    <header className={`header${hidden ? ' header--hidden' : ''}`} data-name="Header">
      <nav className="nav">
        <Link to={localizedPath('/')} className="logo">
          <span>{t('common.brandName')}</span>
        </Link>
        <Navigation />
        <span className="lang-switch">
          <LanguageSwitcher />
        </span>
      </nav>
    </header>
  );
}
