import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const indexHtml = readFileSync(resolve(distDir, 'index.html'), 'utf8');

const assetMatch = indexHtml.match(/(?:src|href)="(\/[^"/]+\/)assets\//);
const basePath = assetMatch ? assetMatch[1] : '/';
const pathSegmentsToKeep = basePath === '/' ? 0 : basePath.split('/').filter(Boolean).length;

const redirectScript = `<script>
    (function (l) {
      var segments = ${pathSegmentsToKeep};
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + segments).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(segments).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    }(window.location));
  </script>`;

const html404 = indexHtml.replace('</head>', `  ${redirectScript}\n</head>`);

writeFileSync(resolve(distDir, '404.html'), html404);
writeFileSync(resolve(distDir, '.nojekyll'), '');
