import { gsap, ScrollTrigger } from './setup.js';
import { FOLDER_HERO_RING_PX } from '../data/sectionHeaderItems.js';
import { MOTION, isMobileViewport, motionBeat } from '../motion/motionSystem.js';

const beat = motionBeat;

/** Длина pin-прохода hero (px скролла). */
export function heroExitScrollTravelPx() {
  if (typeof window === 'undefined') return 820;
  return Math.round(window.innerHeight * 0.92);
}

/** Центр видимой области (с учётом фикс-шапки) — единая точка сборки. */
function getViewportCenter() {
  const header = document.querySelector('.header');
  const headerH = header?.getBoundingClientRect().height ?? 0;
  return {
    x: window.innerWidth / 2,
    y: headerH + (window.innerHeight - headerH) / 2,
  };
}

/** Смещение (px), чтобы центр элемента попал в точку (tx, ty). */
function deltaToPoint(el, tx, ty) {
  const r = el.getBoundingClientRect();
  return { x: tx - (r.left + r.width / 2), y: ty - (r.top + r.height / 2) };
}

/** Снять mouse-float inline-переменные (внешний элемент + внутренний __float). */
function clearFloatVars(elements) {
  for (const el of elements) {
    if (!el) continue;
    el.style.removeProperty('--float-x');
    el.style.removeProperty('--float-y');
    for (const inner of el.querySelectorAll('.header-item__float')) {
      inner.style.removeProperty('--float-x');
      inner.style.removeProperty('--float-y');
    }
  }
}

/**
 * Hero scroll — сборка к ЦЕНТРУ:
 * 1) текст (роль, имя, описание) уходит первым;
 * 2) фото съезжает строго в центр вьюпорта и укрупняется;
 * 3) папки сходятся симметричным кольцом вокруг фото (остаются — это навигация);
 * 4) блок «Больше обо мне» + контакты + ссылки ОСТАЁТСЯ (не анимируется).
 */
export function setupHeroScrollTimeline(hero, competencies, { scroller } = {}) {
  if (!hero || typeof window === 'undefined') return null;
  /* Мобилка — нативный вертикальный скролл, без pin/сборки. */
  if (isMobileViewport()) return null;

  const introCopy = hero.querySelectorAll('.hero-role, .hero-title, .hero-text');
  const card = hero.querySelector('.hero__card');
  const folders = gsap.utils.toArray(hero.querySelectorAll('.header-item--folder'));
  const wells = gsap.utils.toArray(hero.querySelectorAll('.header-item--image-well'));
  const floatables = [...folders, ...wells, ...(card ? [card] : [])];
  const isDesktop = window.matchMedia('(min-width: 64rem)').matches;

  /* GSAP берёт горизонтальное центрирование на себя (CSS — translate(-50%,0)). */
  for (const el of folders) gsap.set(el, { xPercent: -50, yPercent: 0, transformOrigin: '50% 50%' });
  for (const el of wells) gsap.set(el, { xPercent: -50, yPercent: 0, transformOrigin: '50% 50%' });
  if (card) gsap.set(card, { xPercent: -50, yPercent: isDesktop ? 0 : -50, transformOrigin: '50% 50%' });

  const easeOut = MOTION.easeGsapPunch;
  const easeIn = MOTION.easeGsapIn;
  const tl = gsap.timeline({ defaults: { ease: MOTION.easeGsap } });

  const CARD_SCALE = 1.4;
  const FOLDER_SCALE = 1.12;
  const CARD_FOOTER_GAP = 28;

  /* Размеры папок в покое (для зазора от фото; подписи разной длины). */
  const folderRest = folders.map((el) => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });

  /** Нетрансформированная высота карточки (для расчёта финального низа). */
  const cardRestSize = () => {
    if (!card) return { w: 320, h: 300 };
    const sx = Number(gsap.getProperty(card, 'scaleX')) || 1;
    const sy = Number(gsap.getProperty(card, 'scaleY')) || 1;
    const r = card.getBoundingClientRect();
    return { w: r.width / sx, h: r.height / sy };
  };

  /** Высота футера без текущего GSAP-сдвига (для центровки кластера). */
  const footerEl = hero.querySelector('.hero-about__footer');
  const footerHeight = () => (footerEl ? footerEl.getBoundingClientRect().height : 150);

  /**
   * Центр КЛАСТЕРА (фото + футер под ним), а не только фото: фото поднимается
   * выше центра экрана на половину (футер+зазор), чтобы группа «фото + контакты»
   * стояла строго по центру по вертикали — иначе футер перевешивает вниз.
   */
  const heroCenter = () => {
    const c = getViewportCenter();
    const lift = (footerHeight() + CARD_FOOTER_GAP) / 2;
    return { x: c.x, y: c.y - lift };
  };

  /* 1) Текст уходит первым — роль, имя, описание. */
  if (introCopy.length) {
    tl.to(
      introCopy,
      { autoAlpha: 0, y: -28, duration: beat(2.4), ease: easeIn, stagger: beat(0.3) },
      0,
    );
  }

  /* 2) Фото — строго в центр вьюпорта + укрупнение (остаётся). */
  if (card) {
    tl.to(
      card,
      {
        x: () => deltaToPoint(card, heroCenter().x, heroCenter().y).x,
        y: () => deltaToPoint(card, heroCenter().x, heroCenter().y).y,
        scale: CARD_SCALE,
        duration: beat(5),
        ease: easeOut,
        onStart: () => clearFloatVars([card]),
      },
      beat(0.8),
    );
  }

  /* 3) Папки — чистый симметричный фрейм: 2 колонки (слева/справа от фото),
        в каждой по 2 папки (сверху/снизу). Единый x-офсет колонки (по самой
        широкой подписи) → ровные колонки, не вразнобой. Низ-центр — футеру. */
  const maxFolderHalfW = (Math.max(...folderRest.map((f) => f.w)) * FOLDER_SCALE) / 2;
  folders.forEach((el, i) => {
    const ring = FOLDER_HERO_RING_PX[el.dataset?.nodeId] ?? { x: 0, y: 0 };
    const sx = Math.sign(ring.x) || (i % 2 === 0 ? -1 : 1); /* лево/право */
    const sy = ring.y < 0 ? -1 : 1; /* верх/низ в колонке */
    const target = () => {
      const c = heroCenter();
      const s = cardRestSize();
      const halfW = (s.w * CARD_SCALE) / 2;
      const halfH = (s.h * CARD_SCALE) / 2;
      return {
        x: c.x + sx * (halfW + maxFolderHalfW + 40),
        y: c.y + sy * (halfH * 0.58),
      };
    };
    tl.to(
      el,
      {
        x: () => { const t = target(); return deltaToPoint(el, t.x, t.y).x; },
        y: () => { const t = target(); return deltaToPoint(el, t.x, t.y).y; },
        scale: 1.12,
        duration: beat(5.2),
        ease: easeOut,
        onStart: () => clearFloatVars([el]),
      },
      beat(1) + i * beat(0.18),
    );
  });

  /* 4) Image-wells — мелкая навигация: к центру и мягко гаснет (declutter). */
  wells.forEach((el, i) => {
    tl.to(
      el,
      {
        x: () => deltaToPoint(el, heroCenter().x, heroCenter().y).x,
        y: () => deltaToPoint(el, heroCenter().x, heroCenter().y).y,
        scale: 0.8,
        autoAlpha: 0,
        duration: beat(3.4),
        ease: easeIn,
        onStart: () => clearFloatVars([el]),
      },
      beat(1) + i * beat(0.14),
    );
  });

  /* 5) Футер (Больше обо мне + контакты + ссылки) — ПОДНИМАЕТСЯ под фото и
        ОСТАЁТСЯ (не гаснет). Закрывает пустоту снизу, центрируя весь кластер. */
  if (footerEl && card) {
    tl.to(
      footerEl,
      {
        y: () => {
          const cardFinalBottom = heroCenter().y + (cardRestSize().h * CARD_SCALE) / 2;
          const fy = Number(gsap.getProperty(footerEl, 'y')) || 0;
          const footerTopNoY = footerEl.getBoundingClientRect().top - fy;
          return cardFinalBottom + CARD_FOOTER_GAP - footerTopNoY;
        },
        duration: beat(4.6),
        ease: easeOut,
      },
      beat(1.1),
    );
  }

  /* 6) Папки исчезают в САМОМ КОНЦЕ прохода (после сборки кольцом). */
  if (folders.length) {
    tl.to(
      folders,
      { autoAlpha: 0, scale: 1.7, duration: beat(2), ease: easeIn },
      beat(6.2),
    );
  }

  /* 7) Следующий экран — мягкое выплывание при входе во вьюпорт (subtle). */
  if (competencies) {
    gsap.fromTo(
      competencies,
      { autoAlpha: 0.3, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        ease: MOTION.easeGsap,
        scrollTrigger: {
          trigger: competencies,
          start: 'top 88%',
          end: 'top 45%',
          scrub: MOTION.scrub,
          scroller,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  const scrollTrigger = ScrollTrigger.create({
    id: 'home-camera-hero-exit',
    trigger: hero,
    start: 'top top',
    end: `+=${heroExitScrollTravelPx()}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    scrub: MOTION.scrubHero,
    scroller,
    animation: tl,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const scrolling = self.progress > 0.02;
      hero.dataset.heroScroll = scrolling ? 'active' : '';
      if (scrolling) clearFloatVars(floatables);
    },
    onLeaveBack() {
      hero.dataset.heroScroll = '';
    },
  });

  return { timeline: tl, scrollTrigger };
}
