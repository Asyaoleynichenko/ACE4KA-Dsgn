/**
 * Проверка путей к изображениям в src/data/projects.js:
 * файл должен существовать в public/ и не быть «пустышкой» (минимальный размер).
 * Запрещённые хеши — известные битые/заглушки экспорта.
 */
import { readFileSync, statSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsFile = join(root, 'src', 'data', 'projects.js');
const publicDir = join(root, 'public');

const MIN_BYTES = 400;
const BLOCKED_SUBSTRINGS = ['7f12ea1300756f144a0fb5daaf68dbfc01103a46'];

const re = /['"`](\/images\/[^'"`]+\.(?:png|jpe?g|webp|gif|svg))['"`]/gi;

function main() {
  if (!existsSync(projectsFile)) {
    console.error('Не найден файл:', projectsFile);
    process.exit(1);
  }
  const text = readFileSync(projectsFile, 'utf8');
  const paths = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    paths.add(m[1]);
  }

  const errors = [];
  for (const webPath of paths) {
    for (const bad of BLOCKED_SUBSTRINGS) {
      if (webPath.includes(bad)) {
        errors.push(`Запрещённый ассет (заглушка): ${webPath}`);
      }
    }
    const abs = join(publicDir, webPath.replace(/^\//, ''));
    if (!existsSync(abs)) {
      errors.push(`Нет файла в public: ${webPath}`);
      continue;
    }
    let size = 0;
    try {
      size = statSync(abs).size;
    } catch (e) {
      errors.push(`Не удалось прочитать: ${webPath} (${e.message})`);
      continue;
    }
    if (size < MIN_BYTES) {
      errors.push(
        `Подозрительно маленький файл (${size} B < ${MIN_BYTES} B): ${webPath} — возможно пустой экспорт из Figma`,
      );
    }
  }

  if (errors.length) {
    console.error('\n  check-project-assets: ошибки\n');
    for (const line of errors) console.error('  ·', line);
    console.error('\n  Исправьте пути в src/data/projects.js или положите реальные файлы в public/images/.\n');
    process.exit(1);
  }
  console.log(`check-project-assets: OK (${paths.size} путей /images/... в projects.js)`);
}

main();
