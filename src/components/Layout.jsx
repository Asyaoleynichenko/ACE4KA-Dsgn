import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
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
  return (
    <div className={`page ${pageClass}`.trim()}>
      <Header />
      <main className={mainClass}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
