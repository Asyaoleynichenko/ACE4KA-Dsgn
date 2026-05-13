import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const checks = [
  ['vite', join(root, 'node_modules', 'vite', 'package.json')],
  ['react', join(root, 'node_modules', 'react', 'package.json')],
  ['react-dom', join(root, 'node_modules', 'react-dom', 'package.json')],
  ['@vitejs/plugin-react', join(root, 'node_modules', '@vitejs', 'plugin-react', 'package.json')],
];

const missing = checks.filter(([, path]) => !existsSync(path));

if (missing.length > 0) {
  const node = process.version;
  console.error(`\n  Node ${node} — зависимости не установлены или node_modules неполный.`);
  console.error(`  Не найдено: ${missing.map(([name]) => name).join(', ')}`);
  console.error('\n  Из корня репозитория (где лежит package.json) выполните:\n');
  console.error('    npm install\n');
  console.error('  Если ошибка повторяется:\n');
  console.error('    rm -rf node_modules && npm install\n');
  console.error('  Затем: npm run dev  →  в терминале смотрите строку «Local» (порт часто 5174,');
  console.error('  при занятом порту Vite выберет 5175, 5176 и т.д.).\n');
  console.error(
    '  Обход проверки (редко): npm run dev --ignore-scripts\n',
  );
  process.exit(1);
}
