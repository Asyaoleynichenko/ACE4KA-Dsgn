import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';

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
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const appRoot = document.getElementById('root');
    const getY = () => appRoot?.scrollTop ?? window.scrollY ?? 0;
    lastYRef.current = getY();

    const onScroll = () => {
      const y = getY();
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
    };

    const passive = { passive: true };
    const capture = { passive: true, capture: true };
    window.addEventListener('scroll', onScroll, passive);
    document.addEventListener('scroll', onScroll, capture);
    appRoot?.addEventListener('scroll', onScroll, passive);

    return () => {
      window.removeEventListener('scroll', onScroll, passive);
      document.removeEventListener('scroll', onScroll, capture);
      appRoot?.removeEventListener('scroll', onScroll, passive);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  }, []);

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
