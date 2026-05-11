/**
 * @param {Record<string, unknown>} tree
 * @param {string} dottedKey e.g. "header.about"
 * @returns {unknown}
 */
export function resolveMessage(tree, dottedKey) {
  if (!tree || typeof dottedKey !== 'string') return undefined;
  const parts = dottedKey.split('.');
  let cur = tree;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object' || !(p in cur)) return undefined;
    cur = cur[p];
  }
  return cur;
}
