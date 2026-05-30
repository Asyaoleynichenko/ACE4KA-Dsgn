# ACE4KA — Портфолио

Сайт-портфолио на **React** (Vite + React Router).

## Требования

- Node.js **18+** (для Vite 5)
- npm или yarn

## Установка и запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

## Сборка

```bash
npm run build
```

Статика будет в папке `dist/`.

## Структура (React)

- `src/App.jsx` — маршруты (главная, проекты, о себе, контакты, страница проекта по slug).
- `src/components/` — Header, Footer, Layout, PreviewCardBlock, ProjectCard, FilterPills.
- `src/pages/` — HomePage, ProjectsPage, AboutPage, ContactPage, ProjectDetailPage.
- `src/data/projects.js` — данные проектов (slug, title, meta, layout и т.д.); макеты всех страниц проектов в Figma: [фрейм 89-156](https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=89-156&m=dev) (`FIGMA_PROJECT_PAGES_FRAME_URL`).
- Стили: в корне `css/style.css`, `css/design-tokens.css`, `css/fonts.css` (подключаются из `src/main.jsx`).

## Картинки и шрифты

- **Картинки**: папка `public/images` (в сборке пути `/images/...`).
- **Шрифты** (Figma 16-187, 16-189, 16-195, 16-207):
  - **Inter** (основной): подключается в `src/main.jsx` через `@fontsource/inter` (400, 500, 600, 700, 900, latin + cyrillic).
  - **Agatha Modern** (Figma 16-195, вариант «Исследования»): декоративный, 20px, #ef0. Файлы положите в **`public/fonts/`**: `agatha-modern-regular.woff2` (или .woff / .ttf). Скачать: [Agatha-Modern](https://font.download/font/agatha-modern), [freefonts.co](https://freefonts.co/fonts/agatha-modern-regular).
  - **Ice Kingdom (Frozen) Cyrillic** (Figma 16-207, «In progres»): декоративный Bold, 14px. Файлы в **`public/fonts/`**: `ice-kingdom-frozen-cyrillic-bold.woff2` (или .woff / .ttf). Скачать: [online-fonts.com](https://online-fonts.com/fonts/ice-kingdom-frozen-cyrillic), [fontsisland.com](https://fontsisland.com/font/ice-kingdom-28frozen29-cyrillic-bold). В CSS используется как `font-family: var(--font-ice-kingdom)` или `'Ice Kingdom'`.
  - В `css/design-tokens.css` заданы переменные `--font-agatha` и `--font-ice-kingdom` для использования в стилях.

## Маршруты

| Путь | Страница |
|------|----------|
| `/` | Главная |
| `/projects` | Все проекты |
| `/project/:slug` | Страница проекта (drop, marginals, …) |
| `/about` | О себе |
| `/contact` | Контакты |
