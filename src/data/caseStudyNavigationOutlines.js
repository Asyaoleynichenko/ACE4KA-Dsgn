/**
 * Оглавление кейсов: короткие 1–3-слова подписи, нумерация 01/02 даёт ритм.
 * target: hero | intro | overview | narrative | compare | body:N | body:N:hyp
 *
 * Маппинг target → каркасу страницы кейса:
 *   hero      → шапка кейса (название, год, роль, команда)
 *   intro     → блок «О проекте»
 *   overview  → блок верхних карточек (контекст / задача / результат)
 *   body:N    → N-й блок caseSections (см. projects.js)
 *   body:N:hyp→ блок гипотез внутри body:N
 *
 * Если каркас секций в projects.js не совпадает с пунктом — клик по пункту прокрутит
 * к ближайшему якорю, а highlight подсветится только когда якорь попадёт в вьюпорт.
 */
export const CASE_STUDY_NAV_OUTLINES = {
  'mail-monetization': {
    chapterTitle: 'Mail Монетизация',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'overview' },
      { keyword: 'Подход', target: 'body:0' },
      { keyword: 'Эксперимент 1', target: 'body:1' },
      { keyword: 'Эксперимент 2', target: 'body:2' },
      { keyword: 'Эксперимент 3', target: 'body:3' },
      { keyword: 'Эксперимент 4', target: 'body:4' },
      { keyword: 'Результат', target: 'body:5' },
      { keyword: 'Моя роль', target: 'body:6' },
    ],
  },
  'mail-nauki': {
    chapterTitle: 'Mail Наука',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'body:0' },
      { keyword: 'Задача', target: 'body:1' },
      { keyword: 'Гипотезы', target: 'body:2:hyp' },
      { keyword: 'Mail Наука', target: 'body:3' },
      { keyword: 'Media UI', target: 'body:4' },
      { keyword: 'Масштабирование', target: 'body:5' },
      { keyword: 'Mail Кино', target: 'body:6' },
      { keyword: 'Результат', target: 'body:8' },
      { keyword: 'Моя роль', target: 'body:9' },
    ],
  },
  racktables: {
    chapterTitle: 'RackTables',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Задача', target: 'overview' },
      { keyword: 'Сценарий', target: 'body:0' },
      { keyword: 'Проблема', target: 'body:1' },
      { keyword: 'Решение', target: 'body:2' },
      { keyword: 'Vibe-coding', target: 'body:3' },
      { keyword: 'Парадигма', target: 'body:4' },
      { keyword: 'Ожидаемое влияние', target: 'body:5' },
      { keyword: 'Результат', target: 'body:6' },
    ],
  },
  'mail-spetsproekty': {
    chapterTitle: 'Спецпроекты Mail',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'overview' },
      { keyword: 'Задача', target: 'body:0' },
      { keyword: 'Метрики', target: 'body:1' },
      { keyword: 'Концепции', target: 'body:2' },
      { keyword: 'AI в продакшн', target: 'body:3' },
      { keyword: 'Процесс', target: 'body:4' },
      { keyword: 'Trade-off', target: 'body:5' },
      { keyword: 'Результат', target: 'body:6' },
      { keyword: 'Моя роль', target: 'body:7' },
    ],
  },
  neural: {
    chapterTitle: 'Нейросети Hi-Tech',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'overview' },
      { keyword: 'Проблема', target: 'body:0' },
      { keyword: 'Гипотеза', target: 'body:0:hyp' },
      { keyword: 'Решение', target: 'body:1' },
      { keyword: 'Арт-дирекшн', target: 'body:2' },
      { keyword: 'Метрики', target: 'body:3' },
      { keyword: 'Результат', target: 'body:4' },
      { keyword: 'Стратегия', target: 'body:5' },
      { keyword: 'Моя роль', target: 'body:6' },
    ],
  },
  biohacking: {
    chapterTitle: 'Биохакинг',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'overview' },
      { keyword: 'Цель', target: 'body:0' },
      { keyword: 'Гипотезы', target: 'body:0:hyp' },
      { keyword: 'Концепция', target: 'body:1' },
      { keyword: 'Визуал', target: 'body:2' },
      { keyword: '3D и интерактив', target: 'body:3' },
      { keyword: 'Вёрстка', target: 'body:4' },
      { keyword: 'AI', target: 'body:5' },
      { keyword: 'Метрики', target: 'body:6' },
      { keyword: 'Результат', target: 'body:7' },
      { keyword: 'Моя роль', target: 'body:8' },
    ],
  },
  drop: {
    chapterTitle: 'DROP',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'body:0' },
      { keyword: 'Концепция', target: 'body:1' },
      { keyword: 'Гипотеза', target: 'body:2:hyp' },
      { keyword: 'Telegram-MVP', target: 'body:3' },
      { keyword: 'Валидация', target: 'body:4' },
      { keyword: 'Дизайн-система', target: 'body:5' },
      { keyword: 'Trade-off', target: 'body:6' },
      { keyword: 'Результат', target: 'body:7' },
      { keyword: 'Моя роль', target: 'body:8' },
    ],
  },
  loochok: {
    chapterTitle: 'LÒÒCHOK',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'body:0' },
      { keyword: 'Проблема', target: 'body:1' },
      { keyword: 'Исследование', target: 'body:2' },
      { keyword: 'TAM/SAM/SOM', target: 'body:3' },
      { keyword: 'Аудитория', target: 'body:4' },
      { keyword: 'Гипотеза', target: 'body:4:hyp' },
      { keyword: 'MVP', target: 'body:5' },
      { keyword: 'Комьюнити', target: 'body:6' },
      { keyword: 'Бизнес-модель', target: 'body:7' },
      { keyword: 'Дизайн-система', target: 'body:8' },
      { keyword: 'Результат', target: 'body:9' },
      { keyword: 'Моя роль', target: 'body:10' },
    ],
  },
  retrash: {
    chapterTitle: 'RE*TRASH',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Контекст', target: 'body:0' },
      { keyword: 'Исследование', target: 'body:1' },
      { keyword: 'Гипотеза', target: 'body:1:hyp' },
      { keyword: 'Решение', target: 'body:2' },
      { keyword: 'Архитектура', target: 'body:3' },
      { keyword: 'Бренд', target: 'body:4' },
      { keyword: 'Дизайн-система', target: 'body:5' },
      { keyword: 'Результат', target: 'body:6' },
      { keyword: 'Моя роль', target: 'body:7' },
    ],
  },
  inkz: {
    chapterTitle: 'INKZ',
    items: [
      { keyword: 'О проекте', target: 'intro' },
      { keyword: 'Проблема', target: 'body:0' },
      { keyword: 'Задача', target: 'body:1' },
      { keyword: 'Исследование', target: 'body:2' },
      { keyword: 'Гипотезы', target: 'body:2:hyp' },
      { keyword: 'MVP', target: 'body:3' },
      { keyword: 'Экраны', target: 'body:4' },
      { keyword: 'Метрики', target: 'body:5' },
      { keyword: 'Бизнес-модель', target: 'body:6' },
      { keyword: 'Результат', target: 'body:7' },
      { keyword: 'Моя роль', target: 'body:8' },
    ],
  },
};
