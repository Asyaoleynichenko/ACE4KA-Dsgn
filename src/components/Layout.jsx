import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  const pageClass = pathname === '/' ? 'page-home' : pathname === '/projects' ? 'page-projects' : pathname.startsWith('/project') ? 'page-project' : pathname === '/about' ? 'page-about' : pathname === '/contact' ? 'page-contact' : '';
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
