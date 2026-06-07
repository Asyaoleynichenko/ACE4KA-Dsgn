import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nProvider.jsx';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import LocaleGate from './components/LocaleGate.jsx';
import { LegacyLocaleRedirect, RootLocaleRedirect } from './components/LegacyLocaleRedirect.jsx';
import LenisProvider from './context/LenisProvider.jsx';
import MotionEffects from './components/MotionEffects.jsx';

/* Тонки импортов отдельно от lazy(): их же дёргает RoutePrefetcher в idle,
   чтобы переход на любую страницу был мгновенным (без пустого fallback). */
const routeImports = {
  HomePage: () => import('./pages/HomePage'),
  ProjectsPage: () => import('./pages/ProjectsPage'),
  AboutPage: () => import('./pages/AboutPage'),
  ContactPage: () => import('./pages/ContactPage'),
  ResumePage: () => import('./pages/ResumePage'),
  EducationPage: () => import('./pages/EducationPage'),
  Page89_811: () => import('./pages/Page89_811'),
  Page89_772: () => import('./pages/Page89_772'),
  Page89_909: () => import('./pages/Page89_909'),
  Page89_915: () => import('./pages/Page89_915'),
  Page89_920: () => import('./pages/Page89_920'),
  ProjectDetailPage: () => import('./pages/ProjectDetailPage'),
  NotFoundPage: () => import('./pages/NotFoundPage'),
};

const HomePage = lazy(routeImports.HomePage);
const ProjectsPage = lazy(routeImports.ProjectsPage);
const AboutPage = lazy(routeImports.AboutPage);
const ContactPage = lazy(routeImports.ContactPage);
const ResumePage = lazy(routeImports.ResumePage);
const EducationPage = lazy(routeImports.EducationPage);
const Page89_811 = lazy(routeImports.Page89_811);
const Page89_772 = lazy(routeImports.Page89_772);
const Page89_909 = lazy(routeImports.Page89_909);
const Page89_915 = lazy(routeImports.Page89_915);
const Page89_920 = lazy(routeImports.Page89_920);
const ProjectDetailPage = lazy(routeImports.ProjectDetailPage);
const NotFoundPage = lazy(routeImports.NotFoundPage);

/** Idle-prefetch чанков всех страниц: бесшовные переходы без паузы загрузки.
    Пропускаем на save-data и медленных сетях. */
function RoutePrefetcher() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const conn = navigator.connection;
    if (conn?.saveData || /(^|-)2g/.test(conn?.effectiveType ?? '')) return undefined;

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      Object.values(routeImports).forEach((load) => {
        load().catch(() => {});
      });
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const id = window.setTimeout(run, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  return null;
}

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const LEGACY_TOP_PATHS = [
  '/projects',
  '/about',
  '/contact',
  '/resume',
  '/education',
  '/page-811',
  '/page-772',
  '/page-909',
  '/page-915',
  '/page-920',
];

function PageFallback() {
  return <div className="page-route-fallback" aria-hidden="true" />;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <I18nProvider>
        <LenisProvider>
          <ScrollToTop />
          <RoutePrefetcher />
          <MotionEffects />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<RootLocaleRedirect />} />
              <Route path="/project/:slug" element={<LegacyLocaleRedirect />} />
              {LEGACY_TOP_PATHS.map((path) => (
                <Route key={path} path={path} element={<LegacyLocaleRedirect />} />
              ))}
              <Route path="/:locale" element={<LocaleGate />}>
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="resume" element={<ResumePage />} />
                  <Route path="education" element={<EducationPage />} />
                  <Route path="page-811" element={<Page89_811 />} />
                  <Route path="page-772" element={<Page89_772 />} />
                  <Route path="page-909" element={<Page89_909 />} />
                  <Route path="page-915" element={<Page89_915 />} />
                  <Route path="page-920" element={<Page89_920 />} />
                  <Route path="project/:slug" element={<ProjectDetailPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </LenisProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
