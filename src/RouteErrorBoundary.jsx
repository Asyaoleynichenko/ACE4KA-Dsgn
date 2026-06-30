import React from 'react';
import ru from './dictionaries/ru.json';
import en from './dictionaries/en.json';
import { rem } from './utils/cssRem.js';

function pickErrors() {
  if (typeof navigator === 'undefined' || !navigator.language) return ru.errors;
  return navigator.language.toLowerCase().startsWith('en') ? en.errors : ru.errors;
}

function isChunkLoadError(error) {
  const msg = String(error?.message ?? error ?? '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk/i.test(msg);
}

/** Локальный boundary вокруг Outlet: сбрасывается при смене маршрута (key=pathname). */
export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  retry = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (error) {
      const err = pickErrors();
      const chunk = isChunkLoadError(error);
      return (
        <div
          className="route-error-boundary"
          style={{
            padding: rem(24),
            fontFamily: 'system-ui, sans-serif',
            maxWidth: rem(720),
            color: '#111',
            background: '#fff',
          }}
        >
          <h1 style={{ fontSize: rem(18), margin: '0 0 0.75rem' }}>{err.routeTitle ?? err.rootTitle}</h1>
          <p style={{ margin: '0 0 0.75rem', fontSize: rem(14), lineHeight: 1.5 }}>
            {chunk ? (err.routeChunkBody ?? err.rootBody) : (err.routeBody ?? err.rootBody)}
          </p>
          <pre
            style={{
              margin: '0 0 1rem',
              padding: rem(12),
              fontSize: rem(13),
              lineHeight: 1.45,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#f4f4f5',
              borderRadius: rem(8),
            }}
          >
            {String(error?.message ?? error)}
          </pre>
          <button
            type="button"
            onClick={this.retry}
            style={{
              padding: `${rem(10)} ${rem(16)}`,
              fontSize: rem(14),
              borderRadius: rem(8),
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {err.retry ?? 'Retry'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
