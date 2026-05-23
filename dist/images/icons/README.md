# Иконки в `public/images/icons/`

## Шапка (навигация, Figma 89-156 / инстанс 300:107467)

| Файл | Использование |
|------|----------------|
| `nav-icon-430-29004.svg` | Пункты «Главная» и «О себе» — `Navigation.jsx` |
| `projects.svg` | Пункт «Проекты» |
| `home.svg` / `about.svg` | Оставлены как запасные / старые экспорт-версии |

При смене макета в Figma замените соответствующие SVG здесь (viewBox 32×32, стиль как у соседних файлов).

## Секция «Папки» на главной (Figma 1-206 … 1-227)

Пути задаются в `src/data/sectionHeaderItems.js` (`SECTION_HEADER_IMAGES`).

| Слой в макете | Реализация |
|---------------|------------|
| **Folder** (1-206, 1-209, **1-224**, 1-227) | Растр `src/assets/header/folder-1-210.png` → ключ `folder` |
| **Image Well** «Связь» (1-212, 1-215) | PNG из `public/images/figma-impl-89-347/` (то же превью, что в карточке окна) |
| **Image Well** «Команда» (1-218) | PNG из `figma-impl-89-347/` |
| **Image Well** «Среда обитания» (1-221) | Пока `habitat.svg`; после экспорта из Figma — заменить на PNG в `SECTION_HEADER_IMAGES.habitat` |

Запасные SVG в этой папке: `contact.svg`, `team.svg`, `projects.svg` — не используются для колодцев, пока не переключите импорты в `sectionHeaderItems.js`.

## Иконки карточек кейса (ScrollScrubRow, блоки “Задача/Решение/…”)

Используются в `src/pages/ProjectDetailPage.jsx` для `topCards` и `blockCards` в `scroll-scrub-row--cards`.

| Файл | Название в карточке |
|------|-----------------------|
| `card-task.png` | `Задача` / Challenge (`common.caseStudy.task`) |
| `card-solution.png` | `Решение` / Solution |
| `card-influence.png` | `Влияние` / Impact; также временно для **Проблема**/**Контекст**/**Результат**, пока нет отдельных экспортов из Figma |
| `card-metrics.png` | `Метрики` / Metrics |

Сопоставление заголовков с файлами — `src/utils/caseStudyStripIcons.js` (`caseStudyStripIconSrc`).
