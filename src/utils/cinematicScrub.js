/** Инерция ленты: current += (target - current) * 0.08 — «тяжёлая» камера */
export const SCRUB_LERP_ALPHA = 0.08;
export const SCRUB_LERP_SNAP_PX = 0.35;

export function lerpScalar(current, target, alpha = SCRUB_LERP_ALPHA) {
  if (Math.abs(target - current) <= SCRUB_LERP_SNAP_PX) return target;
  return current + (target - current) * alpha;
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

/** Scroll-bound progress 0…1: вертикальный скролл = timeline scrub (span = runway-spacer). */
export function scrollProgress01(runway, sticky, spacer) {
  if (!runway) return 0;
  const pin = sticky ?? runway;
  const stickyTop = parseFloat(getComputedStyle(pin).top) || 0;
  const rect = runway.getBoundingClientRect();
  const pinH = sticky?.offsetHeight ?? pin.offsetHeight ?? 0;
  const spacerH = spacer?.offsetHeight ?? 0;
  const span = Math.max(1, spacerH || runway.offsetHeight - pinH);
  const scrolled = stickyTop - rect.top;
  return clamp01(scrolled / span);
}

/**
 * Горизонтальный сдвиг ленты; карточки не трогаем (opacity/scale в JS давали «чёрный экран»).
 */
export function applyCinematicCardTransforms(
  inner,
  viewport,
  smoothX,
  _progress01 = 0,
  _velocityPx = 0,
  exitP = 0,
) {
  const slides = inner.querySelectorAll(':scope > *');
  if (!slides.length) return { mx: 0, step: 0 };

  const slideW = slides[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(inner).columnGap || getComputedStyle(inner).gap) || 0;
  const step = slideW + gap;
  const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);

  if (mx <= 1) {
    inner.style.transform = 'none';
    slides.forEach((slide) => {
      slide.style.transform = '';
      slide.style.opacity = '';
      slide.style.filter = '';
      slide.style.zIndex = '';
      slide.style.pointerEvents = '';
    });
    return { mx: 0, step };
  }

  const holdAtEnd = exitP > 0.004;
  const xTrack = holdAtEnd ? mx : smoothX;

  inner.style.transform = `translate3d(${-Math.round(xTrack)}px, 0, 0)`;

  slides.forEach((slide) => {
    slide.style.transform = '';
    slide.style.opacity = '';
    slide.style.filter = '';
    slide.style.zIndex = '';
    slide.style.pointerEvents = '';
  });

  return { mx, step };
}

export function resetCinematicCardTransforms(inner) {
  if (!inner) return;
  inner.style.transform = '';
  inner.querySelectorAll(':scope > *').forEach((slide) => {
    slide.style.flex = '';
    slide.style.width = '';
    slide.style.maxWidth = '';
    slide.style.minWidth = '';
    slide.style.transform = '';
    slide.style.opacity = '';
    slide.style.filter = '';
    slide.style.zIndex = '';
    slide.style.pointerEvents = '';
  });
}

/** @deprecated оставлено для совместимости импортов */
export function cardLayer(index) {
  return { speed: 1, parallax: 1, scale: 1, rotate: 1, z: 1, stagger: 0 };
}
