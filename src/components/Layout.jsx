import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import Header from './Header';
import Footer from './Footer';
import ParallaxBackdrop from './ParallaxBackdrop';
import PageTransition from './PageTransition';
import RouteErrorBoundary from '../RouteErrorBoundary.jsx';
import AmbientLightProvider from '../context/AmbientLightProvider.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  const basePath = stripLocaleFromPathname(pathname);
  const isProjectsListing = basePath === '/projects';
  const isProjectRoute = basePath.startsWith('/project/');
  const isAbout = basePath === '/about';
  const isHome = basePath === '/';
  /** Snap отключён на главной — scroll = camera, одна непрерывная сцена (HomeCameraScroll). */
  const snapScreens = !isHome && !isProjectsListing && !isProjectRoute && !isAbout;

  useLayoutEffect(() => {
    const appRoot = document.getElementById('root');
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 48rem)');
    /** На flex-body snap по html часто не работает — скролл и snap переносим на #root */
    const sync = () => {
      const enabled = snapScreens && !mqReduced.matches && !mqMobile.matches;
      document.documentElement.classList.toggle('snap-pages', enabled);
      appRoot?.classList.toggle('snap-pages-root', enabled);
      /** На главной между hero и projects блок компетенций — при y mandatory браузер часто «перескакивал» его. */
      appRoot?.classList.toggle('snap-pages-root--home', enabled && isHome);
    };
    sync();
    mqReduced.addEventListener('change', sync);
    mqMobile.addEventListener('change', sync);
    return () => {
      mqReduced.removeEventListener('change', sync);
      mqMobile.removeEventListener('change', sync);
      document.documentElement.classList.remove('snap-pages');
      appRoot?.classList.remove('snap-pages-root');
      appRoot?.classList.remove('snap-pages-root--home');
    };
  }, [snapScreens, isHome]);
  const figmaPages = {
    '/page-811': 'page-811',
    '/page-772': 'page-772',
    '/page-909': 'page-909',
    '/page-915': 'page-915',
    '/page-920': 'page-920',
  };
  const knownPaths = new Set([
    '/',
    '/projects',
    '/about',
    '/contact',
    '/resume',
    '/education',
    ...Object.keys(figmaPages),
  ]);
  const isNotFound =
    !knownPaths.has(basePath) && !basePath.startsWith('/project/');
  const pageClass = isNotFound
    ? 'page-not-found'
    : basePath === '/'
      ? 'page-home'
      : basePath === '/projects'
        ? 'page-projects'
        : basePath.startsWith('/project')
          ? 'page-project'
          : basePath === '/about'
            ? 'page-about'
            : basePath === '/contact'
              ? 'page-contact'
              : basePath === '/resume'
                ? 'page-resume'
                : basePath === '/education'
                  ? 'page-education'
                  : figmaPages[basePath] || '';
  const isProjectDetail = basePath.startsWith('/project/');
  const mainClass = isProjectDetail ? 'main main--project' : 'main';
  const pageSnapClass = snapScreens ? 'page--snap' : '';
  const mainWithHomeShell = isHome ? `${mainClass} page-home__main` : mainClass;

  return (
    <AmbientLightProvider>
      <div className={`page site-exhibition ${pageClass} ${pageSnapClass}`.trim()}>
        {isHome ? <ParallaxBackdrop /> : null}
        <Header />
        <main className={mainWithHomeShell}>
          {isProjectDetail ? (
            <div key={pathname} className="page-transition page-transition--case-study">
              <RouteErrorBoundary key={pathname}>
                <Outlet />
              </RouteErrorBoundary>
            </div>
          ) : (
            <PageTransition />
          )}
        </main>
        <Footer snapScreen={snapScreens} />
      </div>
    </AmbientLightProvider>
  );
}
