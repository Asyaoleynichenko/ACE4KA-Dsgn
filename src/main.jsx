import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* Только нужные веса Inter — быстрее первый рендер */
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

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
