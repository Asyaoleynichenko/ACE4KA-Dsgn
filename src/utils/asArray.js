/**
 * Безопасно приводит значение из словаря к массиву для рендера через `.map`.
 * Если перевод отсутствует или имеет неверный тип (строка, объект, null),
 * возвращает `[]`, чтобы не уронить страницу `TypeError`-ом.
 * @template T
 * @param {unknown} value
 * @returns {T[]}
 */
export function asArray(value) {
  return Array.isArray(value) ? value : [];
}
