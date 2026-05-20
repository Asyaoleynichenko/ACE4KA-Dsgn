/** Инерция ленты: меньше α — тяжелее, «музейный» ход. */
export const SCRUB_LERP_ALPHA = 0.075;
export const SCRUB_LERP_SNAP_PX = 0.4;

export function lerpScalar(current, target, alpha = SCRUB_LERP_ALPHA) {
  const d = target - current;
  if (Math.abs(d) <= SCRUB_LERP_SNAP_PX) return target;
  return current + d * alpha;
}

/** Разная «глубина» слоёв — карточки не движутся одинаково. */
export function cardDepthMultiplier(index) {
  const pattern = [1, 1.2, 0.88, 1.1, 0.95];
  return pattern[index % pattern.length];
}

/**
 * Базовый сдвиг ленты + per-card parallax / scale / opacity / rotateY.
 * scroll-bound: smoothX уже сглажен, привязан к вертикальному скроллу.
 */
export function applyCinematicCardTransforms(inner, viewport, smoothX) {
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
    });
    return { mx: 0, step: slideW + gap };
  }

  const vw = viewport.clientWidth || 1;
  const focus = smoothX + vw * 0.5;

  inner.style.transform = `translate3d(${-smoothX}px, 0, 0)`;

  slides.forEach((slide, i) => {
    const center = i * step + slideW * 0.5;
    const distSlides = (center - focus) / Math.max(step, 1);
    const ad = Math.abs(distSlides);
    const dm = cardDepthMultiplier(i);
    const parallaxX = distSlides * step * 0.16 * dm;
    const scale = Math.max(0.86, 1 - ad * 0.06);
    const opacity = Math.max(0.45, 1 - ad * 0.3);
    const tz = (1 - Math.min(ad, 1.25)) * 64 * dm - ad * 14;
    const ty = ad * 14;
    const ry = distSlides * -3.2 * dm;
    const blur = ad > 0.5 ? Math.min(3, (ad - 0.5) * 4.5) : 0;

    slide.style.transform = [
      `translate3d(${parallaxX.toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px)`,
      `scale(${scale.toFixed(4)})`,
      `rotateY(${ry.toFixed(3)}deg)`,
    ].join(' ');
    slide.style.opacity = opacity.toFixed(3);
    slide.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
    slide.style.zIndex = String(100 + Math.round((1 - Math.min(ad, 1.5)) * 24));
  });

  return { mx, step };
}

export function resetCinematicCardTransforms(inner) {
  if (!inner) return;
  inner.style.transform = '';
  inner.querySelectorAll(':scope > *').forEach((slide) => {
    slide.style.transform = '';
    slide.style.opacity = '';
    slide.style.filter = '';
    slide.style.zIndex = '';
  });
}
