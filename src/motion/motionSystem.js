/**
 * Единая физика движения сайта: один lerp, один easing, один rhythm/pacing.
 * Lenis · mouse float · scrub · typography · camera — одни законы.
 */

/** Инерция: current += (target - current) * LERP */
export const MOTION_LERP = 0.1;

/** CSS / Framer — cubic-bezier(0.32, 0.72, 0, 1) */
export const MOTION_EASE_CSS = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** CSS — лёгкий «удар» с микро-overshoot для hover / reveal */
export const MOTION_EASE_CSS_PUNCH = 'cubic-bezier(0.22, 1.08, 0.36, 1)';

/** GSAP — ближайший к --ease-smart без Club-плагинов */
export const MOTION_EASE_GSAP = 'power3.out';

/** GSAP — резкий выход / вход (hero, scrub-сегменты) */
export const MOTION_EASE_GSAP_PUNCH = 'power4.out';

/** GSAP — быстрый снос (текст, wells) */
export const MOTION_EASE_GSAP_IN = 'power3.in';

/** Один «удар» ритма (stagger между строками / карточками) */
export const MOTION_STAGGER_BEAT = 0.07;

/** Базовая длительность reveal = 7 beats × stagger */
export const MOTION_DURATION_REVEAL = MOTION_STAGGER_BEAT * 7;

/** Микро-раскрытия (аккордеон, панели, hover) — синхрон с --dur-smart-base */
export const MOTION_DURATION_MICRO = MOTION_STAGGER_BEAT * 2.9;

/** Быстрый микро-отклик — синхрон с --dur-smart-nav */
export const MOTION_DURATION_MICRO_FAST = MOTION_STAGGER_BEAT * 2;

/** ScrollTrigger scrub — секунды сглаживания (меньше = отзывчивее) */
export const MOTION_SCRUB = 0.48;

/** Hero pin — чуть резче общий скролл-сегмент */
export const MOTION_SCRUB_HERO = 0.38;

export const MOTION = {
  lerp: MOTION_LERP,
  easeCss: MOTION_EASE_CSS,
  easeCssPunch: MOTION_EASE_CSS_PUNCH,
  easeGsap: MOTION_EASE_GSAP,
  easeGsapPunch: MOTION_EASE_GSAP_PUNCH,
  easeGsapIn: MOTION_EASE_GSAP_IN,
  staggerBeat: MOTION_STAGGER_BEAT,
  durationReveal: MOTION_DURATION_REVEAL,
  scrub: MOTION_SCRUB,
  scrubHero: MOTION_SCRUB_HERO,
  competencies: {
    /** ~пол-экрана на строку — блок удерживает, пока не пролистаны все строки */
    stepVh: 0.52,
    stepMinPx: 120,
  },
  /** Горизонтальная лента карточек кейса — вертикальный scrub (не от mx 100cqi) */
  horizontalStrip: {
    /** ~1 экран на 3–4 карточки; без дубля spacer + pin */
    stepVh: 0.28,
    stepMinPx: 140,
  },
  camera: {
    /** px сдвига слоя на полный проход главной */
    parallaxSpan: 80,
    glowDriftVw: 14,
    glowDriftVh: 20,
  },
};

export function motionLerp(current, target, alpha = MOTION_LERP) {
  if (Math.abs(target - current) < 0.08) return target;
  return current + (target - current) * alpha;
}

export function motionBeat(multiplier = 1) {
  return MOTION_STAGGER_BEAT * multiplier;
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** ≤48rem — тот же брейкпоинт, что у нативного горизонтального скролла лент. */
export function isMobileViewport() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 48rem)').matches
  );
}

/** Мобилка и reduced-motion — нативный скролл вместо Lenis / vertical scroll-jail. */
export function prefersNativeScroll() {
  return prefersReducedMotion() || isMobileViewport();
}
