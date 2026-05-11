/** Если ключа нет в словаре, `t` возвращает сам ключ — тогда показываем запасной текст (например из данных). */
export function tWithFallback(t, key, fallback) {
  const r = t(key);
  return r === key ? fallback : r;
}
