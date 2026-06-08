import { gsap, ScrollTrigger } from './setup.js';
import { MOTION, isMobileViewport, motionBeat } from '../motion/motionSystem.js';

const beat = motionBeat;

/** Глубина перспективы (px). z-твины ДОЛЖНЫ быть < PERSP, иначе элемент уходит
   за камеру и рендерится зеркально. Рост даёт scale × магнификация persp/(persp−z). */
const PERSP = 1100;

/** Длина pin-прохода hero (px скролла) — полёт сквозь сцену. */
export function heroExitScrollTravelPx() {
  if (typeof window === 'undefined') return 1000;
  return Math.round(window.innerHeight * 1.1);
}

/** Снять mouse-float inline-переменные, чтобы они не дрались с z-твином. */
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
 * Hero scroll = полёт камеры СКВОЗЬ сцену (z-dolly):
 * всё надвигается прямо на зрителя, растёт и пролетает мимо.
 * Послойная глубина: текст уходит первым → фото → папки (фокус, крупнее всех,
 * улетают последними). За ними из глубины выплывает следующий экран.
 */
export function setupHeroScrollTimeline(hero, competencies, { scroller } = {}) {
  if (!hero || typeof window === 'undefined') return null;
  /* Мобилка — без pin/3D: нативный вертикальный скролл (Lenis off на ≤48rem). */
  if (isMobileViewport()) return null;

  const introCopy = hero.querySelectorAll('.hero-role, .hero-title, .hero-text');
  const footer = hero.querySelector('.hero-about__footer');
  const card = hero.querySelector('.hero__card');
  const folders = gsap.utils.toArray(hero.querySelectorAll('.header-item--folder'));
  const wells = gsap.utils.toArray(hero.querySelectorAll('.header-item--image-well'));
  const floatables = [...folders, ...wells, ...(card ? [card] : [])];

  const tl = gsap.timeline({ defaults: { ease: MOTION.easeGsap, transformPerspective: PERSP } });

  /* 1) Текст уходит первым — рвётся на зрителя и растворяется. */
  if (introCopy.length) {
    tl.to(
      introCopy,
      { z: 440, scale: 1.5, autoAlpha: 0, duration: beat(2.6), ease: MOTION.easeGsapIn, stagger: beat(0.28) },
      0,
    );
  }

  /* 2) Контакты/ссылки («Больше обо мне» блок) — следом за текстом. */
  if (footer) {
    tl.to(
      footer,
      { z: 480, scale: 1.5, autoAlpha: 0, duration: beat(3), ease: MOTION.easeGsapIn },
      beat(0.7),
    );
  }

  /* 3) Фото надвигается и пролетает мимо (магнификация persp/(persp−z) ≈ 2.5×). */
  if (card) {
    tl.to(
      card,
      {
        z: 640,
        scale: 2.4,
        autoAlpha: 0,
        duration: beat(4.6),
        ease: MOTION.easeGsapPunch,
        onStart: () => clearFloatVars([card]),
      },
      beat(1),
    );
  }

  /* 4) Image-wells — мелкая навигация, уходит вместе с фото. */
  wells.forEach((el, i) => {
    tl.to(
      el,
      {
        z: 560,
        scale: 2.0,
        autoAlpha: 0,
        duration: beat(3.8),
        ease: MOTION.easeGsapIn,
        onStart: () => clearFloatVars([el]),
      },
      beat(1.2) + i * beat(0.18),
    );
  });

  /* 5) Папки — ФОКУС: крупнее всех, глубже всех (быстрее мимо), улетают последними.
       z 780 < PERSP 1100 → магнификация ≈ 3.4×, итоговый визуальный размер ≈ 11× базы. */
  folders.forEach((el, i) => {
    tl.to(
      el,
      {
        z: 780,
        scale: 3.2,
        duration: beat(6.4),
        ease: MOTION.easeGsapPunch,
        onStart: () => clearFloatVars([el]),
      },
      beat(1.4) + i * beat(0.2),
    );
    /* Гаснут только в самом конце прохода. */
    tl.to(
      el,
      { autoAlpha: 0, duration: beat(2), ease: MOTION.easeGsapIn },
      beat(6.6) + i * beat(0.12),
    );
  });

  /* 6) Следующий экран выплывает ИЗ глубины — отдельным триггером при входе
        во вьюпорт (НЕ в пиновом таймлайне: иначе пин тянется пустым после того
        как папки улетели → чёрный хвост). Папки гаснут ровно в конце пина. */
  if (competencies) {
    gsap.fromTo(
      competencies,
      { autoAlpha: 0.2, scale: 0.9, z: -260, transformPerspective: PERSP },
      {
        autoAlpha: 1,
        scale: 1,
        z: 0,
        ease: MOTION.easeGsap,
        scrollTrigger: {
          trigger: competencies,
          start: 'top 90%',
          end: 'top 42%',
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
    end: () => `+=${heroExitScrollTravelPx()}`,
    pin: true,
    /* pinSpacing:false — без зарезервированной высоты hero после пина (иначе она
       прокручивается пустой = чёрный провал). Следующий экран поднимается ЗА
       прозрачным hero во время пина и выплывает, когда папки улетели. */
    pinSpacing: false,
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
