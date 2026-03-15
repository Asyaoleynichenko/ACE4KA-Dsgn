# Соответствие макетам Figma

Файл: [В разработку](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=0-1&m=dev)

**Design system rules** из 6 ключевых нод (1-202, 1-399, 1-522, 16-184, 16-164, 16-170): см. `.cursor/rules/figma-design-system.mdc`.

## Реализованные ноды

| Node ID | Где в коде | Описание |
|---------|------------|----------|
| **1-202** | `HomePage` — `.hero` | Первый экран: контент 896px + карточка, gap 12, section gap 64; **выравнивание по центру** (`.hero__content`, `.hero-content`, `.hero-links`) |
| **1:203** | `HomePage` — `.hero-vector` + `/images/main title vector.svg` | Вектор на главной (Group), пропорции 1275×274, inner inset -6.2% -1.33% |
| **[1-206](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-206&m=dev)** | `AboutPage` — `.header-item--folder` | Header Item: Опыт (folder 99×90), иконка в .header-item__icon-wrap |
| **1:209** | `AboutPage` — `.header-item--folder` | Header Item: Связь (folder) |
| **1:212** | `AboutPage` — `.header-item--image-well` | Header Item: Связь (image well 44×44) |
| **1:215** | `AboutPage` — `.header-item--image-well` | Header Item: Связь (image well) |
| **1:218** | `AboutPage` — `.header-item--image-well` | Header Item: Команда (image well) |
| **1:221** | `AboutPage` — `.header-item--image-well` | Header Item: Я в естественной среде обитания (image well) |
| **1:224** | `AboutPage` — `.header-item--folder` | Header Item: Краткий обзор на проекты (folder) |
| **1:227** | `AboutPage` — `.header-item--folder` | Header Item: Образование (folder) |
| **[1-231](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-231&m=dev)** | `PreviewCardBlock` | Блок-превью (Telegram-style): 369×280, titlebar 38px, radius 10px; title 13px bold rgba(0,0,0,0.5); CTA border 1px #F5F5F5, radius 0.375rem, plus-darker |
| **1-232** | `HomePage` — `.section-projects` | Секция «Проекты», отступ 64px от hero |
| **1-245** | `HomePage` — `.info-grid` | Сетка инфо: колонки 148 147 148 254 184, gap 32 |
| **1-286** | `HomePage` / `ProjectsPage` — `.logo-section` | Logo Section: колонка, gap 12px, заголовок + нав-пилюля |
| **1-289** | `.projects-title-main` | Заголовок «Проекты»: 60px, semibold, -2px, uppercase |
| **1-290** | `FilterPills` — `.filter-pills` | Navigation: одна пилюля blur 27.5px, padding 4px, gap 8px |
| **1-297** | `HomePage` / `ProjectsPage` — `.preview-grid` | Сетка карточек: 1290px, gap 24px 8px |
| **1-361** | `ProjectCard` — `.preview-card` | Карточка проекта (макет): max 639px, gap 8px; image 16:9, radius 16px; title 24px/32px -0.53px, meta 12px/16px 0.6px 40%, desc 14px/22.75px -0.15px 60% |
| **1-298** | `ProjectCard` — `.preview-card` | То же, см. 1-361 |
| **1-362** | `ProjectCard` — `.preview-image` | Контейнер изображения: 16:9, radius 16px |
| **1-397** | `HomePage` — `.btn-show-all` | Кнопка «Смотреть все проекты» (glass pill) |
| **1-398** | `HomePage` — `.show-all-wrap` | Блок «Смотреть все проекты»: 376×57, по центру |
| **1-399** | `ProjectsPage` — `.page-projects__wrap` | Страница «Все проекты»: top 152px, gap 48 |
| **1-525** | `ProjectDetailPage` — `.project-page-wrap` | Страница проекта (макет): back 14px 0.55px uppercase, hero 1310×721 radius 21px, top row title+lead \| meta card 415px #0f0f0f 16px 24px, grid 2 cols gap 24px, cards 33px padding, footer border-top 65px 2 cols gap 48px, tools pills 12px #262626 |
| **1-522** | То же | См. 1-525 |
| **[1-534](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-534&m=dev)** | `ProjectDetailPage` — `.project-detail` | Блок контента под hero: верхний ряд (title+lead \| meta card), сетка карточек, футер |
| **[1-556](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-556&m=dev)** | `ProjectDetailPage` — `.project-detail-card` | Карточка блока «Задача»/«Решение»: #0f0f0f, 16px radius, 33px padding; label 12px 0.6px uppercase 40%; body 18px 29.25px -0.44px 80% |
| **[1-230](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-230&m=dev)** | `Header` — `.header` | Шапка: padding 21px, logo 24px mix-blend exclusion, nav pill 332px rgba(255,255,255,0.11) blur 12px, active pill + lang 228px |
| **16-164** | `Header` | То же, см. [1-230](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-230&m=dev) |
| **16-170** | `Footer` | Подвал: 1358px, блок ACE4KA (только главная), тёмный блок #101010; реализован по макету с data-node-id на всех дочерних нодах |
| **16-171** | `Footer` — `.footer-ace4ka` | Текст ACE4KA: 330px, semibold, center |
| **16-172** | `Footer` — `.footer-inner` | Тёмный блок: #101010, padding 16px |
| **16-173** | `Footer` — `.footer-top` | Строка статус+ссылки, затем примечание |
| **16-174–176** | `Footer` — `.footer-status` | Статус: dot 19px, текст 24px 1.2 -1px |
| **16-177** | `Footer` — `.footer-links-row` | Ссылки: 14px, uppercase, gap 14px |
| **16-185** | `Footer` — `.footer-link` | Ссылка: Telegram |
| **16-187** | `Footer` — `.footer-link` | Ссылка: Pinterest |
| **16-189** | `Footer` — `.footer-link` | Ссылка: Behance |
| **16-191** | `Footer` — `.footer-link` | Ссылка: Resume |
| **16-195** | `Footer` — `.footer-link` | Ссылка: Email |
| **16-199** | `Footer` — `.footer-link` | Ссылка: Dribbble |
| **16-201** | `Footer` — `.footer-link` | Ссылка: LinkedIn |
| **16-207** | `Footer` — `.footer-link` | Ссылка: Проекты |
| **16-209** | `Footer` — `.footer-link` | Ссылка: Связь |
| **16-183** | `Footer` — `.footer-note` | Примечание: 24px, max-width 661px |

## Спецификации из макетов (в CSS)

- **Header [1-230](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-230&m=dev)**: logo 24px, -1px, mix-blend exclusion; nav pill rgba(255,255,255,0.11), blur 12px; active pill rgba(0,0,0,0.55), border rgba(255,255,255,0.48), inset shadow.
- **Hero**: role 14px/20px, 1px tracking, 60% opacity; H1 96px/96px, -6px; text 24px, max 661px; more 24px; info label 12px/16px, 1px, 40%; value 18px/28px, -1px; links 14px/20px, 1px, uppercase.
- **Preview block [1-231](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-231&m=dev)**: 369×280, gradient #262626→#1a1a1a, overlay blur 20px, shadow; titlebar 38px; **title** 13px bold rgba(0,0,0,0.5) (`.preview-card-block__title`); CTA: border-radius 0.375rem, border 1px solid #F5F5F5, mix-blend-mode plus-darker (`--preview-cta-*`); image area 242px, radius 6px.
- **Projects (1-361, 1-297)**: единые отступы в `css/design-tokens.css`: `--card-gap: 8px` (между изображением и текстом, между title/meta/desc), `--grid-row-gap: 24px`, `--grid-column-gap: 8px`; logo-section `--space-12` и `--space-48`; title 60px/60px, 500, -2px, uppercase; filter pills gap 8px; grid 1290px; card 639px max, image 16:9, title 24px/32px -0.53px, meta 12px/16px 0.6px 40%, desc 14px/22.75px -0.15px 60%.
- **Project detail 1-522**: back link 14px 0.55px uppercase; hero 1310×721, radius 21px; top row title+lead | meta card 415px #0f0f0f 16px 24px; grid 2 cols gap 24px; cards #0f0f0f 16px 33px; footer border-top 65px, 2 cols gap 48px; tools pills 12px #262626 border.
- **Footer**: ACE4KA clamp(80px,24vw,330px) 600 -1px uppercase; inner #101010 16px; status+links row space-between align-end; note 24px 1.2 -1px max 661px.

**Эффекты** (тени, blur, mix-blend, фоны) вынесены в `css/design-tokens.css`: `--shadow-*`, `--blur-*`, `--effect-*`, `--mix-blend-exclusion`. Компоненты в `css/style.css` используют эти переменные.

При расхождении с макетом откройте нужный node в Figma (Dev mode) и сверьте значения в этом файле и в `css/style.css`.

---

## Верстка: Hero и страница Контакты (обновления)

- **Hero (1-202)**  
  - Контент по центру: `.hero__content` — `text-align: center`, `align-items: center`; `.hero-content` — `align-items: center`; `.hero-links` — `justify-content: center`.  
  - Отступ между верхним блоком (вектор + карточка) и рядом контента: `margin-top: var(--hero-row-gap)` (12px).

- **Страница Контакты** (`contact.html`, класс `page-contact`)  
  - Всё по центру: `.main` — flex-колонка, `align-items: center`, `text-align: center`; `.page-header` — flex, `align-items: center`; `.contact-grid` — `margin: 0 auto`; карточки `.contact-item` — `flex-direction: column`, `text-align: center`, внутренний блок с подписью и ссылкой — `align-items: center`.  
  - Токены дизайн-системы: `--space-*`, `--font-size-*`, `--color-surface`, `--radius-lg` и др. в `css/style.css`.  
  - В разметке: без `<br>` между подписью и ссылкой (отступ через `gap`), у иконок-эмодзи `aria-hidden="true"`.
