import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* Inter — статические веса + variable для type-reveal (wght/wdth interpolation) */
import '@fontsource-variable/inter/wght.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';

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
