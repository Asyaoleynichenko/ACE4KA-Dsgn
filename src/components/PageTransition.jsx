import { Outlet, useLocation } from 'react-router-dom';

/** Обёртка над Outlet: при смене маршрута контент мягко появляется (CSS, уважает prefers-reduced-motion). */
export default function PageTransition() {
  const { pathname, search, hash } = useLocation();
  const key = `${pathname}${search}${hash}`;
  return (
    <div key={key} className="page-transition">
      <Outlet />
    </div>
  );
}
