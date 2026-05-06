import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Base для production: /&lt;имя-репозитория&gt;/. Задать вручную: VITE_BASE=имя-репо или `vite build --base /имя/` */
function productionBase() {
  if (process.env.VITE_BASE === 'root' || process.env.VITE_BASE === '/') return '/';
  const segment = (
    process.env.VITE_BASE ||
    process.env.GITHUB_REPOSITORY?.split('/')[1] ||
    'ACE4KA'
  ).replace(/^\/+|\/+$/g, '');
  return segment ? `/${segment}/` : '/';
}

function prefixPublicUrlsInCssPlugin(baseRoot) {
  return {
    name: 'prefix-absolute-public-urls-in-css',
    apply: 'build',
    generateBundle(_, bundle) {
      if (!baseRoot) return;
      for (const chunk of Object.values(bundle)) {
        if (
          chunk.type === 'asset' &&
          chunk.fileName?.endsWith('.css') &&
          typeof chunk.source === 'string'
        ) {
          chunk.source = chunk.source.replace(
            /url\((['"]?)\/(fonts|images)\//g,
            (_, quote, dir) => `url(${quote}${baseRoot}/${dir}/`,
          );
        }
      }
    },
  };
}

export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : productionBase();
  const baseRoot = base === '/' ? '' : base.replace(/\/$/, '');
  return {
    base,
    plugins: [react(), prefixPublicUrlsInCssPlugin(baseRoot)],
  };
});
