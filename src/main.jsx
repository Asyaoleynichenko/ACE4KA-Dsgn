import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* Шрифты проекта подключены self-hosted в css/style.css (public/fonts/suisse-intl-*.woff2). */

import 'lenis/dist/lenis.css';
import '../css/style.css';
import RootErrorBoundary from './RootErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
);
