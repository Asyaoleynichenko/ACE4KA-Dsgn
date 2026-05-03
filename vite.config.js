import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function productionBase() {
  if (process.env.VITE_BASE === 'root' || process.env.VITE_BASE === '/') return '/';
  const segment = (
    process.env.VITE_BASE ||
    process.env.GITHUB_REPOSITORY?.split('/')[1] ||
    'ACE4KA'
  ).replace(/^\/+|\/+$/g, '');
  return segment ? `/${segment}/` : '/';
}

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : productionBase(),
  plugins: [react()],
}));
