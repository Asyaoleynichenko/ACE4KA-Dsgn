import { gsap, ScrollTrigger } from '../gsap/setup.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import {
  MOTION_EASE_GSAP,
  MOTION_SCRUB,
  MOTION_STAGGER_BEAT,
  MOTION_DURATION_REVEAL,
  prefersReducedMotion as motionReduced,
} from './motionSystem.js';

const VF_FROM = '"wght" 320, "wdth" 92"';
const VF_TO_BOLD = '"wght" 700, "wdth" 100"';
const VF_TO_REGULAR = '"wght" 500, "wdth" 100"';

const VARIANTS = {
  cinematic: {
    from: {
      clipPath: 'inset(100% 0% 0% 0%)',
      filter: 'blur(16px)',
      fontVariationSettings: VF_FROM,
      yPercent: 6,
    },
    to: {
      clipPath: 'inset(0% 0% 0% 0%)',
      filter: 'blur(0px)',
      fontVariationSettings: VF_TO_BOLD,
      yPercent: 0,
    },
    duration: MOTION_DURATION_REVEAL,
    ease: MOTION_EASE_GSAP,
  },
  mask: {
    from: { clipPath: 'inset(100% 0% 0% 0%)', filter: 'blur(0px)', yPercent: 0 },
    to: { clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', yPercent: 0 },
    duration: 0.95,
    ease: MOTION_EASE_GSAP,
  },
  blur: {
    from: { clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(14px)', yPercent: 0 },
    to: { clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', yPercent: 0 },
    duration: 0.88,
    ease: MOTION_EASE_GSAP,
  },
  vf: {
    from: {
      clipPath: 'inset(0% 0% 0% 0%)',
      filter: 'blur(0px)',
      fontVariationSettings: VF_FROM,
      yPercent: 0,
    },
    to: {
      clipPath: 'inset(0% 0% 0% 0%)',
      filter: 'blur(0px)',
      fontVariationSettings: VF_TO_BOLD,
      yPercent: 0,
    },
    duration: 1.05,
    ease: 'power3.inOut',
  },
};

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wrapLineContent(lineEl) {
  if (lineEl.dataset.revealWrapped === '1') {
    return lineEl.querySelector('.type-reveal__inner');
  }

  lineEl.classList.add('type-reveal__line');
  const mask = document.createElement('span');
  mask.className = 'type-reveal__mask';
  const inner = document.createElement('span');
  inner.className = 'type-reveal__inner type-reveal__vf';
  while (lineEl.firstChild) {
    inner.appendChild(lineEl.firstChild);
  }
  mask.appendChild(inner);
  lineEl.appendChild(mask);
  lineEl.dataset.revealWrapped = '1';
  return inner;
}

/** Разбивает текстовый блок на визуальные строки (переносы layout). */
export function splitElementIntoVisualLines(element) {
  if (element.dataset.revealSplit === '1') {
    return [...element.querySelectorAll(':scope > .type-reveal__line .type-reveal__inner')];
  }

  const text = element.textContent?.trim();
  if (!text) return [];

  const words = text.split(/(\s+)/).filter(Boolean);
  element.textContent = '';

  const probes = words.map((word) => {
    const span = document.createElement('span');
    span.className = 'type-reveal__probe-word';
    span.textContent = word;
    element.appendChild(span);
    return span;
  });

  const groups = [];
  let batch = [];
  let lastTop = -1;

  for (const span of probes) {
    const top = span.offsetTop;
    if (batch.length && top > lastTop + 1) {
      groups.push(batch);
      batch = [];
    }
    batch.push(span);
    lastTop = top;
  }
  if (batch.length) groups.push(batch);

  element.textContent = '';
  const inners = [];

  for (const wordSpans of groups) {
    const line = document.createElement('span');
    line.className = 'type-reveal__line';
    const mask = document.createElement('span');
    mask.className = 'type-reveal__mask';
    const inner = document.createElement('span');
    inner.className = 'type-reveal__inner type-reveal__vf';
    for (const ws of wordSpans) {
      inner.appendChild(ws);
    }
    mask.appendChild(inner);
    line.appendChild(mask);
    element.appendChild(line);
    inners.push(inner);
  }

  element.dataset.revealSplit = '1';
  return inners;
}

function resolveSplit(root, split) {
  if (split !== 'auto') return split;
  const presetLines = root.querySelectorAll(':scope > .hero-title__line, :scope > [data-reveal-line]');
  if (presetLines.length) return 'children';
  if (root.children.length > 1) return 'children';
  return 'lines';
}

function collectLineInners(root, split) {
  const mode = resolveSplit(root, split);

  if (mode === 'block') {
    const inner = wrapLineContent(root);
    root.classList.add('type-reveal__line');
    return [inner];
  }

  if (mode === 'children') {
    const children = [...root.children].filter((c) => c.nodeType === 1);
    if (children.length) {
      return children.map((child) => wrapLineContent(child));
    }
  }

  return splitElementIntoVisualLines(root);
}

function applyReducedMotionFinal(root, inners, variantKey) {
  const preset = VARIANTS[variantKey] ?? VARIANTS.cinematic;
  root.classList.remove('type-reveal--pending');
  root.classList.add('type-reveal--done');
  for (const inner of inners) {
    gsap.set(inner, { ...preset.to, clearProps: 'willChange' });
  }
}

/**
 * @param {HTMLElement} root
 * @param {{
 *   variant?: keyof typeof VARIANTS,
 *   trigger?: 'load' | 'scroll',
 *   split?: 'auto' | 'children' | 'block',
 *   delay?: number,
 *   stagger?: number,
 *   duration?: number,
 *   once?: boolean,
 *   weightTo?: 'bold' | 'regular',
 * }} options
 */
export function initTypographyReveal(root, options = {}) {
  if (!root || root.dataset.revealInit === '1') return () => {};

  const variantKey = options.variant ?? root.dataset.typeReveal ?? 'cinematic';
  const preset = VARIANTS[variantKey] ?? VARIANTS.cinematic;
  const trigger = options.trigger ?? root.dataset.typeRevealTrigger ?? 'load';
  const split = options.split ?? root.dataset.typeRevealSplit ?? 'auto';
  const delay = Number(options.delay ?? root.dataset.typeRevealDelay ?? 0) || 0;
  const stagger =
    Number(options.stagger ?? root.dataset.typeRevealStagger ?? MOTION_STAGGER_BEAT) ||
    MOTION_STAGGER_BEAT;
  const duration = Number(options.duration ?? root.dataset.typeRevealDuration ?? preset.duration) || preset.duration;
  const once = options.once !== false;
  const weightTo = options.weightTo === 'regular' ? VF_TO_REGULAR : VF_TO_BOLD;

  root.classList.add('type-reveal', `type-reveal--${variantKey}`, 'type-reveal--pending');

  const inners = collectLineInners(root, split);
  if (!inners.length) return () => {};

  root.dataset.revealInit = '1';

  if (motionReduced()) {
    applyReducedMotionFinal(root, inners, variantKey);
    return () => {};
  }

  const toVars = { ...preset.to, fontVariationSettings: weightTo };
  gsap.set(inners, { ...preset.from, force3D: true });

  const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();

  const tl = gsap.timeline({
    delay,
    paused: trigger === 'scroll',
    onComplete: () => {
      root.classList.remove('type-reveal--pending');
      root.classList.add('type-reveal--done');
      gsap.set(inners, { clearProps: 'willChange' });
    },
  });

  tl.to(inners, {
    ...toVars,
    duration,
    ease: preset.ease,
    stagger,
  });

  let scrollTrigger;
  if (trigger === 'scroll') {
    scrollTrigger = ScrollTrigger.create({
      trigger: root,
      start: 'top 88%',
      once,
      scroller,
      onEnter: () => tl.play(0),
    });
    requestAnimationFrame(() => refreshScrollTrigger());
  }

  return () => {
    scrollTrigger?.kill();
    tl.kill();
    root.classList.remove('type-reveal--pending', 'type-reveal--done');
    delete root.dataset.revealInit;
    delete root.dataset.revealSplit;
  };
}

export function initTypographyRevealAll(root = document, selector = '[data-type-reveal]') {
  const cleanups = [];
  const nodes = root.querySelectorAll(selector);
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.dataset.revealInit === '1') continue;
    cleanups.push(initTypographyReveal(node));
  }
  return () => cleanups.forEach((fn) => fn());
}
