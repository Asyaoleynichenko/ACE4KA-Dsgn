import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Base для production-сборки:
 * - `VITE_BASE` / `vite build --base` — явно (приоритет);
 * - в GitHub Actions без VITE_BASE — из `GITHUB_REPOSITORY` (…/repo → /repo/);
 * - локально без env — `/` (npm run preview и статика с корня; нет жёстко зашитого имени репо → меньше белых экранов из‑за 404 на /wrong-repo/assets).
 * Для Pages вручную: `VITE_BASE=<имя-репо> npm run build` или только CI.
 */
function productionBase() {
  const raw = process.env.VITE_BASE;
  if (raw === 'root' || raw === '/') return '/';
  if (raw != null && String(raw).trim() !== '') {
    const s = String(raw).replace(/^\/+|\/+$/g, '');
    return s ? `/${s}/` : '/';
  }
  if (process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY) {
    const seg = process.env.GITHUB_REPOSITORY.split('/')[1]?.replace(/^\/+|\/+$/g, '') || '';
    return seg ? `/${seg}/` : '/';
  }
  return '/';
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
