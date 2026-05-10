import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vitePkg = join(root, 'node_modules', 'vite', 'package.json');

if (!existsSync(vitePkg)) {
  console.error('\n  Не найден node_modules/vite — зависимости не установлены или папка node_modules неполная.');
  console.error('  Из корня репозитория (где лежит package.json) выполните:\n');
  console.error('    npm install\n');
  console.error('  Если ошибка повторяется, переустановите зависимости:\n');
  console.error('    rm -rf node_modules && npm install\n');
  console.error('  Затем: npm run dev  →  обычно http://localhost:5173/');
  console.error(
    '  Проверку можно обойти (если зависимости точно есть, но путь нестандартный): npm run dev --ignore-scripts\n',
  );
  process.exit(1);
}
