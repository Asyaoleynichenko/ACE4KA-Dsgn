import React from 'react';
import ru from './dictionaries/ru.json';
import en from './dictionaries/en.json';

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
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            maxWidth: 720,
            color: '#111',
            background: '#fff',
          }}
        >
          <h1 style={{ fontSize: 18, margin: '0 0 12px' }}>{err.rootTitle}</h1>
          <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.5 }}>{err.rootBody}</p>
          <pre
            style={{
              margin: 0,
              padding: 12,
              fontSize: 13,
              lineHeight: 1.45,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#f4f4f5',
              borderRadius: 8,
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
