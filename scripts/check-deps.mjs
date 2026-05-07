import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vitePkg = join(root, 'node_modules', 'vite', 'package.json');

if (!existsSync(vitePkg)) {
  console.error('\n  Нет зависимостей. Из корня репозитория выполните:\n  npm install\n');
  process.exit(1);
}
