import React from 'react';
import ru from './dictionaries/ru.json';
import en from './dictionaries/en.json';
import { rem } from './utils/cssRem.js';

function pickErrors() {
  if (typeof navigator === 'undefined' || !navigator.language) return ru.errors;
  return navigator.language.toLowerCase().startsWith('en') ? en.errors : ru.errors;
}

/** Показывает текст ошибки вместо пустого экрана, если React упал при первом рендере */
export default class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      const err = pickErrors();
      return (
        <div
          style={{
            padding: rem(24),
            fontFamily: 'system-ui, sans-serif',
            maxWidth: rem(720),
            color: '#111',
            background: '#fff',
          }}
        >
          <h1 style={{ fontSize: rem(18), margin: '0 0 0.75rem' }}>{err.rootTitle}</h1>
          <p style={{ margin: '0 0 0.75rem', fontSize: rem(14), lineHeight: 1.5 }}>{err.rootBody}</p>
          <pre
            style={{
              margin: 0,
              padding: rem(12),
              fontSize: rem(13),
              lineHeight: 1.45,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#f4f4f5',
              borderRadius: rem(8),
            }}
          >
            {String(error && error.message ? error.message : error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
