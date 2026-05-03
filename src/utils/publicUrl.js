/** Пути к файлам из `public/` (с ведущим `/`) — с учётом `base` для GitHub Pages */
export function publicUrl(path) {
  if (path == null || typeof path !== 'string') return path;
  if (/^https?:\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  const p = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${p}`;
}
