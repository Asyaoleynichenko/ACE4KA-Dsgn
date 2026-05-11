# Иконки в `public/images/icons/`

## Шапка (навигация, Figma 89-156 / инстанс 300:107467)

| Файл | Использование |
|------|----------------|
| `nav-icon-430-29004.svg` | Пункты «Главная» и «О себе» — `Navigation.jsx` |
| `projects.svg` | Пункт «Проекты» |
| `home.svg` / `about.svg` | Оставлены как запасные / старые экспорт-версии |

При смене макета в Figma замените соответствующие SVG здесь (viewBox 32×32, стиль как у соседних файлов).

## Секция «Папки» на главной (Figma 1-206 … 1-227)

| Файл | Использование |
|------|----------------|
| `folder.svg` | Опыт (1-206), Связь (1-209), Образование (1-227) — folder 99×90 |
| `projects.svg` | Краткий обзор на проекты (1-224) — folder 99×90 |
| `contact.svg` | Связь (1-212, 1-215) — image well 44×44 |
| `team.svg` | Команда (1-218) — image well 44×44 |
| `habitat.svg` | Я в естественной среде обитания (1-221) — image well 44×44 |

Пути для папок подключены в `src/data/sectionHeaderItems.js` (`SECTION_HEADER_IMAGES`).

## Иконки карточек кейса (ScrollScrubRow, блоки “Задача/Решение/…”)

Используются в `src/pages/ProjectDetailPage.jsx` для `topCards` и `blockCards` в `scroll-scrub-row--cards`.

| Файл | Название в карточке |
|------|-----------------------|
| `card-task.png` | `Задача` / Challenge (`common.caseStudy.task`) |
| `card-solution.png` | `Решение` / Solution |
| `card-influence.png` | `Влияние` / Impact; также временно для **Проблема**/**Контекст**/**Результат**, пока нет отдельных экспортов из Figma |
| `card-metrics.png` | `Метрики` / Metrics |

Сопоставление заголовков с файлами — `src/utils/caseStudyStripIcons.js` (`caseStudyStripIconSrc`).
