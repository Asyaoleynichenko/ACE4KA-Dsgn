import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nProvider.jsx';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import LocaleGate from './components/LocaleGate.jsx';
import { LegacyLocaleRedirect, RootLocaleRedirect } from './components/LegacyLocaleRedirect.jsx';
import LenisProvider from './context/LenisProvider.jsx';
import MotionEffects from './components/MotionEffects.jsx';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const Page89_811 = lazy(() => import('./pages/Page89_811'));
const Page89_772 = lazy(() => import('./pages/Page89_772'));
const Page89_909 = lazy(() => import('./pages/Page89_909'));
const Page89_915 = lazy(() => import('./pages/Page89_915'));
const Page89_920 = lazy(() => import('./pages/Page89_920'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

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
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </LenisProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
