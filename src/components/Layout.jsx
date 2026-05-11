import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ParallaxBackdrop from './ParallaxBackdrop';
import PageTransition from './PageTransition';

export default function Layout() {
  const { pathname } = useLocation();
  const isProjectsListing = pathname === '/projects';
  const isProjectRoute = pathname.startsWith('/project/');
  /** Полноэкранный snap-скролл — не на списке проектов и не на страницах кейсов */
  const snapScreens = !isProjectsListing && !isProjectRoute;

  useLayoutEffect(() => {
    const appRoot = document.getElementById('root');
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** На flex-body snap по html часто не работает — скролл и snap переносим на #root */
    const sync = () => {
      const enabled = snapScreens && !mq.matches;
      document.documentElement.classList.toggle('snap-pages', enabled);
      appRoot?.classList.toggle('snap-pages-root', enabled);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      document.documentElement.classList.remove('snap-pages');
      appRoot?.classList.remove('snap-pages-root');
    };
  }, [snapScreens]);
  const figmaPages = {
    '/page-811': 'page-811',
    '/page-772': 'page-772',
    '/page-909': 'page-909',
    '/page-915': 'page-915',
    '/page-920': 'page-920',
  };
  const pageClass = pathname === '/' ? 'page-home' : pathname === '/projects' ? 'page-projects' : pathname.startsWith('/project') ? 'page-project' : pathname === '/about' ? 'page-about' : pathname === '/contact' ? 'page-contact' : pathname === '/resume' ? 'page-resume' : pathname === '/education' ? 'page-education' : figmaPages[pathname] || '';
  const isProjectDetail = pathname.startsWith('/project/');
  const mainClass = isProjectDetail ? 'main main--project' : 'main';
  const isHome = pathname === '/';
  const isAbout = pathname === '/about';

  /* Главная: шапка рендерится внутри HomePage (один родитель с героем) — иначе blur/blend
     часто упираются в body по бокам из-за max-width у .main. */
  const pageSnapClass = snapScreens ? 'page--snap' : '';

  if (isHome) {
    return (
      <div className={`page page-home ${pageSnapClass}`.trim()}>
        <ParallaxBackdrop />
        <main className={`${mainClass} page-home__main`}>
          <PageTransition />
        </main>
        <Footer snapScreen={snapScreens} />
      </div>
    );
  }

  return (
    <div className={`page ${pageClass} ${pageSnapClass}`.trim()}>
      <ParallaxBackdrop />
      <Header />
      <main className={mainClass}>
        <PageTransition />
      </main>
      {!isAbout && <Footer snapScreen={snapScreens} />}
    </div>
  );
}
