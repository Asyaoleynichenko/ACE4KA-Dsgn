import { gsap, ScrollTrigger } from './setup.js';
import { FOLDER_HERO_RING_PX } from '../data/sectionHeaderItems.js';
import { MOTION, isMobileViewport, motionBeat } from '../motion/motionSystem.js';

const beat = motionBeat;

/** Длина pin-прохода hero (px скролла). */
export function heroExitScrollTravelPx() {
  if (typeof window === 'undefined') return 720;
  return Math.round(window.innerHeight * 0.82);
}

/** Центр видимой области страницы (с учётом фикс-шапки). */
function getViewportCenter() {
  const header = document.querySelector('.header');
  const headerH = header?.getBoundingClientRect().height ?? 0;
  const vh = window.innerHeight;
  return {
    x: window.innerWidth / 2,
    y: headerH + (vh - headerH) / 2,
  };
}

/** Смещение элемента к точке viewport (px). */
function deltaToPoint(el, targetX, targetY, anchor = 'center') {
  const rect = el.getBoundingClientRect();
  let cx;
  let cy;
  if (anchor === 'folder') {
    cx = rect.left + rect.width / 2;
    cy = rect.top + rect.height * 0.38;
  } else {
    cx = rect.left + rect.width / 2;
    cy = rect.top + rect.height / 2;
  }
  return { x: targetX - cx, y: targetY - cy };
}

/** Верх элемента без текущего GSAP-translateY (для абсолютного y-твина). */
function layoutTop(el) {
  const rect = el.getBoundingClientRect();
  const y = Number(gsap.getProperty(el, 'y')) || 0;
  return rect.top - y;
}

/** Y-трансформ футера: всегда ниже низа карточки, с зазором. */
function footerYBelowCard(cardEl, footerEl, gapPx = 24) {
  if (!cardEl || !footerEl) return 0;
  const cardBottom = cardEl.getBoundingClientRect().bottom;
  const targetTop = cardBottom + gapPx;
  return targetTop - layoutTop(footerEl);
}

function clearFloatVars(elements) {
  for (const el of elements) {
    el.style.removeProperty('--float-x');
    el.style.removeProperty('--float-y');
    for (const inner of el.querySelectorAll('.header-item__float')) {
      inner.style.removeProperty('--float-x');
      inner.style.removeProperty('--float-y');
    }
  }
}

/**
 * Hero scroll — пофазный timeline:
 * 1) роль / имя / описание уходят первыми
 * 2) фото + папки сходятся к центру страницы (X и Y)
 * 3) «Больше обо мне» + блок контактов/ссылок поднимаются вверх
 */
export function setupHeroScrollTimeline(hero, competencies, { scroller } = {}) {
  if (!hero || typeof window === 'undefined') return null;

  const heroIntroCopy = hero.querySelectorAll('.hero-role, .hero-title, .hero-text');
  const heroFooter = hero.querySelector('.hero-about__footer');
  const infoGrid = hero.querySelector('.info-grid');
  const infoCards = gsap.utils.toArray(hero.querySelectorAll('.info-card'));
  const infoCardsToHide = infoCards.slice(0, -1);
  const contactsCard = infoCards.at(-1) ?? null;
  const card = hero.querySelector('.hero__card');
  const folders = gsap.utils.toArray(hero.querySelectorAll('.header-item--folder'));
  const wells = gsap.utils.toArray(hero.querySelectorAll('.header-item--image-well'));
  const folderLabels = gsap.utils.toArray(
    hero.querySelectorAll('.header-item--folder .header-item__label, .header-item--image-well .header-item__label'),
  );
  const floatables = [...folders, ...wells, ...(card ? [card] : [])];

  const usePin = !isMobileViewport();
  const isDesktop = window.matchMedia('(min-width: 64rem)').matches;

  for (const el of folders) {
    gsap.set(el, { xPercent: -50, yPercent: 0, transformOrigin: '50% 0%', scale: 1 });
  }
  for (const el of wells) {
    gsap.set(el, { xPercent: -50, yPercent: 0, transformOrigin: '50% 0%', scale: 1, opacity: 1 });
  }
  if (card) {
    gsap.set(card, {
      xPercent: -50,
      yPercent: isDesktop ? 0 : -50,
      transformOrigin: '50% 50%',
      scale: 1,
    });
  }

  const easeOut = MOTION.easeGsapPunch;
  const easeIn = MOTION.easeGsapIn;
  const tl = gsap.timeline({ defaults: { ease: MOTION.easeGsap } });

  if (heroIntroCopy.length) {
    tl.to(
      heroIntroCopy,
      {
        autoAlpha: 0,
        height: 0,
        minHeight: 0,
        marginBlock: 0,
        paddingBlock: 0,
        overflow: 'hidden',
        duration: beat(2),
        ease: easeIn,
        stagger: beat(0.35),
      },
      0,
    );
  }

  if (infoCardsToHide.length) {
    tl.to(
      infoCardsToHide,
      {
        autoAlpha: 0,
        height: 0,
        minHeight: 0,
        marginBlock: 0,
        paddingBlock: 0,
        overflow: 'hidden',
        duration: beat(2.2),
        ease: easeIn,
        stagger: beat(0.25),
      },
      beat(0.8),
    );
  }

  if (infoGrid && contactsCard) {
    tl.to(
      infoGrid,
      {
        gridTemplateColumns: 'minmax(0, 1fr)',
        justifyContent: 'center',
        maxWidth: '14rem',
        rowGap: 0,
        duration: beat(2.8),
        ease: easeOut,
      },
      beat(2.4),
    );
    tl.to(
      contactsCard,
      {
        gridColumn: '1 / -1',
        duration: beat(2.4),
        ease: easeOut,
      },
      beat(2.4),
    );
  }

  if (folderLabels.length) {
    tl.to(
      folderLabels,
      {
        autoAlpha: 0,
        duration: beat(1.4),
        ease: easeIn,
      },
      beat(1.2),
    );
  }

  if (heroFooter && card) {
    tl.to(
      heroFooter,
      {
        x: () => {
          const { x, y } = getViewportCenter();
          return deltaToPoint(heroFooter, x, y, 'center').x;
        },
        y: () => footerYBelowCard(card, heroFooter),
        duration: beat(5.5),
        ease: easeOut,
      },
      beat(1.8),
    );
  }

  if (contactsCard) {
    tl.fromTo(
      contactsCard,
      { autoAlpha: 0.85 },
      { autoAlpha: 1, duration: beat(2.8), ease: easeOut },
      beat(3),
    );
  }

  if (card) {
    tl.to(
      card,
      {
        x: () => {
          const { x, y } = getViewportCenter();
          return deltaToPoint(card, x, y, 'center').x;
        },
        y: () => {
          const { x, y } = getViewportCenter();
          return deltaToPoint(card, x, y, 'center').y;
        },
        scale: 1.48,
        duration: beat(5.5),
        ease: easeOut,
        onStart: () => clearFloatVars([card]),
      },
      beat(1.8),
    );
  }

  folders.forEach((el, i) => {
    const nodeId = el.dataset?.nodeId;
    const ring = FOLDER_HERO_RING_PX[nodeId] ?? { x: 0, y: 0 };
    tl.to(
      el,
      {
        x: () => {
          const { x, y } = getViewportCenter();
          return deltaToPoint(el, x + ring.x, y + ring.y, 'folder').x;
        },
        y: () => {
          const { x, y } = getViewportCenter();
          return deltaToPoint(el, x + ring.x, y + ring.y, 'folder').y;
        },
        scale: 1.72,
        duration: beat(5.2),
        ease: easeOut,
        onStart: () => clearFloatVars([el]),
      },
      beat(2.2) + i * beat(0.9),
    );
  });

  wells.forEach((el, i) => {
    tl.to(
      el,
      {
        opacity: 0,
        scale: 0.72,
        x: () => {
          const { x, y } = getViewportCenter();
          return deltaToPoint(el, x, y, 'folder').x;
        },
        y: () => {
          const { x, y } = getViewportCenter();
          return deltaToPoint(el, x, y, 'folder').y;
        },
        duration: beat(3.6),
        ease: easeIn,
        onStart: () => clearFloatVars([el]),
      },
      beat(2.2) + i * beat(0.55),
    );
  });

  if (folders.length) {
    tl.to(
      folders,
      {
        autoAlpha: 0,
        scale: 1.5,
        duration: beat(2.8),
        ease: easeIn,
      },
      0.76,
    );
  }

  if (competencies) {
    tl.fromTo(
      competencies,
      { opacity: 0.28, y: 32 },
      { opacity: 1, y: 0, duration: beat(3.8), ease: easeOut },
      0.62,
    );
  }

  const scrollTrigger = ScrollTrigger.create({
    id: 'home-camera-hero-exit',
    trigger: hero,
    start: 'top top',
    end: usePin ? () => `+=${heroExitScrollTravelPx()}` : 'bottom top',
    pin: usePin,
    pinSpacing: true,
    anticipatePin: 1,
    scrub: MOTION.scrubHero,
    scroller,
    animation: tl,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const scrolling = self.progress > 0.04;
      hero.dataset.heroScroll = scrolling ? 'active' : '';
      if (scrolling) clearFloatVars(floatables);
    },
    onLeave() {
      hero.dataset.heroScroll = 'active';
    },
    onLeaveBack() {
      hero.dataset.heroScroll = '';
    },
  });

  return { timeline: tl, scrollTrigger };
}
