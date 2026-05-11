/**
 * Оглавление кейсов: заголовок раздела + пункты «ключ — пояснение».
 * target: hero | intro | overview | narrative | compare | body:N | body:N:hyp
 */
export const CASE_STUDY_NAV_OUTLINES = {
  'mail-nauki': {
    chapterTitle: 'Запуск Mail Наука и системный редизайн',
    items: [
      { keyword: 'Конфликт', caption: 'Ключевой конфликт продукта', target: 'body:0' },
      { keyword: 'Гипотезы', caption: 'Гипотезы и подход', target: 'body:2:hyp' },
      { keyword: 'Система', caption: 'Модульная система главной страницы', target: 'body:3' },
      { keyword: 'Масштабирование', caption: 'Запуск как MVP и масштабирование на другие проекты', target: 'body:4' },
      { keyword: 'Эффект', caption: 'Системный эффект', target: 'body:9' },
    ],
  },
  biohacking: {
    chapterTitle: 'Спецпроект «Биохакинг» (Invitro)',
    items: [
      { keyword: 'Задача', caption: 'Задача и влияние', target: 'intro' },
      { keyword: 'Лендинг', caption: 'Создание лендинга', target: 'body:0' },
      { keyword: 'Гипотезы', caption: 'Интерактив и 3D-анимация', target: 'body:0:hyp' },
      { keyword: 'AI-Production', caption: 'AI-Driven Production', target: 'body:1' },
      { keyword: 'Результаты', caption: 'Бизнес-результаты и метрики', target: 'overview' },
    ],
  },
  'mail-spetsproekty': {
    chapterTitle: 'Развитие направления спецпроектов (Mail.ru)',
    items: [
      { keyword: 'Задача', caption: 'Задача до реформирования и метрики', target: 'intro' },
      { keyword: 'Система', caption: 'Масштабируемая система производства', target: 'body:0' },
      { keyword: 'Гипотезы', caption: 'Систематизация и процессы', target: 'body:0:hyp' },
      { keyword: 'Гайд', caption: 'Создание гайда по работе с нейросетями', target: 'body:1' },
      { keyword: 'Влияние', caption: 'Влияние на скорость и затраты', target: 'overview' },
    ],
  },
  neural: {
    chapterTitle: 'Спецпроект /Н#ЙРОСЕТИ (Mail Hi-Tech)',
    items: [
      { keyword: 'Задача', caption: 'Задача и гипотезы', target: 'intro' },
      { keyword: 'Решение', caption: 'Решение и влияние', target: 'body:0' },
      { keyword: 'AI-Production', caption: 'AI-Driven Production', target: 'body:1' },
      { keyword: 'Взаимодействие', caption: 'Кросс-функциональное взаимодействие', target: 'body:0:hyp' },
      { keyword: 'Результаты', caption: 'Бизнес-результаты и стратегический эффект', target: 'overview' },
    ],
  },
  loochok: {
    chapterTitle: 'LOOCHOK (Медиа кастомизации)',
    items: [
      { keyword: 'Проблема', caption: 'Проблема и целевая аудитория', target: 'body:2' },
      { keyword: 'MVP', caption: 'MVP продукта и комьюнити', target: 'body:4' },
      { keyword: 'Бизнес', caption: 'Бизнес-модель', target: 'body:6' },
      { keyword: 'Айдентика', caption: 'Стайл-гайд и дизайн-система', target: 'body:12' },
      { keyword: 'Роадмап', caption: 'Роадмап развития и запуск', target: 'body:10' },
    ],
  },
  drop: {
    chapterTitle: 'DROP (Приложение для нетворкинга)',
    items: [
      { keyword: 'Контекст', caption: 'Контекст продукта', target: 'body:0' },
      { keyword: 'Гипотезы', caption: '6 продуктовых гипотез', target: 'body:2:hyp' },
      { keyword: 'Решение', caption: 'Решение и регистрация', target: 'body:4' },
      { keyword: 'Система', caption: 'Стайлгайд и дизайн-система', target: 'body:6' },
      { keyword: 'Исследование', caption: 'Научное исследование', target: 'body:8' },
    ],
  },
  retrash: {
    chapterTitle: 'RE*TRASH (Медиа-сервис)',
    items: [
      { keyword: 'Задача', caption: 'Задача и метрики', target: 'overview' },
      { keyword: 'Исследование', caption: 'Исследование барьеров аудитории', target: 'body:1' },
      { keyword: 'Гипотезы', caption: 'Гипотезы и подход', target: 'body:1:hyp' },
      { keyword: 'Визуал', caption: 'Визуальный стиль и дизайн-система', target: 'body:4' },
      { keyword: 'Лендинг', caption: 'Промо лендинг', target: 'body:3' },
    ],
  },
  'mail-monetization': {
    chapterTitle: 'Монетизация Mail.ru (Growth)',
    items: [
      { keyword: 'Подход', caption: 'Подход и гипотезы', target: 'body:0:hyp' },
      { keyword: 'Сегментация', caption: 'Запуск тарифа «Mail Space для работы»', target: 'body:1' },
      { keyword: 'Ограничения', caption: 'Ограничение многоаккаунтовости и Trade-off', target: 'body:3' },
      { keyword: 'Апсейл', caption: 'Апсейл внутри пользовательских сценариев', target: 'body:5' },
      { keyword: 'Freemium', caption: 'Freemium-фича: улучшение фото нейросетью', target: 'body:6' },
    ],
  },
  inkz: {
    chapterTitle: 'INKZ (Платформа для тату-мастеров)',
    items: [
      { keyword: 'Проблема', caption: 'Проблема и задача', target: 'body:1' },
      { keyword: 'Исследование', caption: 'Исследование и гипотезы', target: 'body:3' },
      { keyword: 'Решение', caption: 'Продуктовое решение', target: 'body:4' },
      { keyword: 'Бизнес', caption: 'Бизнес-модель и модель данных', target: 'body:7' },
      { keyword: 'Лендинг', caption: 'Промо лендинг', target: 'body:10' },
    ],
  },
  racktables: {
    chapterTitle: 'Rack Tables (Редизайн системы Yandex)',
    items: [
      { keyword: 'Проблема', caption: 'Проблема и задача', target: 'body:1' },
      { keyword: 'Решение', caption: 'Решение и влияние', target: 'body:3' },
      { keyword: 'Vibe-coding', caption: 'Скоростное прототипирование (Vibe-coding)', target: 'body:0' },
      { keyword: 'Результат', caption: 'Метрики и итоговый результат', target: 'body:4' },
    ],
  },
};
