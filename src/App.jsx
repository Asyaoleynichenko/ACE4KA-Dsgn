import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ResumePage from './pages/ResumePage';
import EducationPage from './pages/EducationPage';
import Page89_811 from './pages/Page89_811';
import Page89_772 from './pages/Page89_772';
import Page89_909 from './pages/Page89_909';
import Page89_915 from './pages/Page89_915';
import Page89_920 from './pages/Page89_920';
import ProjectDetailPage from './pages/ProjectDetailPage';

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
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
      </Routes>
    </BrowserRouter>
  );
}
