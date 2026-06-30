import { lazy } from 'react';

function isChunkLoadError(error) {
  const msg = String(error?.message ?? error ?? '');
  return (
    /Failed to fetch dynamically imported module/i.test(msg)
    || /Importing a module script failed/i.test(msg)
    || /error loading dynamically imported module/i.test(msg)
    || /Loading chunk [\d]+ failed/i.test(msg)
  );
}

function retryImport(importFn, retriesLeft, intervalMs) {
  return importFn().catch((error) => {
    if (retriesLeft <= 0 || !isChunkLoadError(error)) throw error;
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        retryImport(importFn, retriesLeft - 1, intervalMs).then(resolve, reject);
      }, intervalMs);
    });
  });
}

/** lazy() с повтором при 404/HMR — типичная причина «Не удалось отрисовать приложение». */
export function lazyWithRetry(importFn, { retries = 3, intervalMs = 600 } = {}) {
  return lazy(() => retryImport(importFn, retries, intervalMs));
}
