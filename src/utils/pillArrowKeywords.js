/**
 * Стрелки ↑ / ↓ в pill-тегах ЗАМЕНЯЮТ ведущее ключевое слово (рост/повышение/снижение/спад …),
 * а не добавляются ко всем pills как универсальный префикс.
 *
 * Используется в `.section__pills li`, `.hyp-list__outcome`, dual-outcomes.
 */

const UP_KEYWORDS = [
  'повышение', 'повышения', 'повышено', 'повышен', 'повышена', 'повышены',
  'повысила', 'повысил', 'повысили', 'повысить',
  'рост', 'роста', 'росту',
  'выросло', 'вырос', 'выросла', 'выросли',
  'увеличение', 'увеличения', 'увеличила', 'увеличил', 'увеличили', 'увеличить',
  'прирост', 'прироста',
  'улучшение', 'улучшила', 'улучшил', 'улучшили',
  'increase', 'increased', 'growth', 'grow', 'grew', 'raised', 'raises', 'lift',
];

const DOWN_KEYWORDS = [
  'снижение', 'снижения', 'снижено', 'снижен', 'снижена', 'снижены',
  'снизила', 'снизил', 'снизили', 'снизить',
  'спад', 'спада',
  'падение', 'падения',
  'уменьшение', 'уменьшения', 'уменьшила', 'уменьшил', 'уменьшили', 'уменьшить',
  'сокращение', 'сокращения', 'сократила', 'сократил', 'сократили', 'сократить',
  'decrease', 'decreased', 'drop', 'dropped', 'reduced', 'reduce', 'declined', 'decline',
];

const buildLeadingRe = (words) =>
  new RegExp(`^\\s*(?:${words.join('|')})(?:\\s+(?:на|для|по|of|in|by))?\\s+`, 'iu');

const UP_RE = buildLeadingRe(UP_KEYWORDS);
const DOWN_RE = buildLeadingRe(DOWN_KEYWORDS);

/**
 * Заменяет ведущее ключевое слово на ↑ / ↓. Если ключевого слова нет — текст не меняется.
 *
 * @param {string} text исходный текст pill
 * @returns {string} текст с заменой или исходный
 */
export function pillArrowReplace(text) {
  if (typeof text !== 'string' || !text) return text;
  if (UP_RE.test(text)) return '↑ ' + text.replace(UP_RE, '');
  if (DOWN_RE.test(text)) return '↓ ' + text.replace(DOWN_RE, '');
  return text;
}
