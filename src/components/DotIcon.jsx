import { useEffect, useRef } from 'react';

/**
 * Dot-matrix icon set. Each icon is a list of {cx, cy, r?, opacity?} circles
 * on a 24×24 grid. Use size to scale; color via `currentColor` (set via CSS).
 *
 * Names: dot-bullet, dot-arrow-right, dot-grid, dot-target, dot-list, dot-letter-a.
 *
 * The first child rendered is the visible accent (e.g. target center), drawn LAST
 * (z-order) for layering when needed — done with separate <g> below.
 */

const R = 1.4;
const SAT = 0.45; // satellite opacity

const ICONS = {
  'dot-bullet': {
    viewBox: '0 0 24 24',
    circles: [
      { cx: 12, cy: 12, r: 2 },
      { cx: 4, cy: 12, opacity: SAT },
      { cx: 20, cy: 12, opacity: SAT },
      { cx: 12, cy: 4, opacity: SAT },
      { cx: 12, cy: 20, opacity: SAT },
    ],
  },
  'dot-arrow-right': {
    viewBox: '0 0 24 24',
    circles: [
      { cx: 4, cy: 12 },
      { cx: 9, cy: 12 },
      { cx: 14, cy: 12 },
      { cx: 19, cy: 12 },
      { cx: 14, cy: 7 },
      { cx: 14, cy: 17 },
      { cx: 16.5, cy: 9.5, opacity: SAT },
      { cx: 16.5, cy: 14.5, opacity: SAT },
    ],
  },
  'dot-grid': {
    viewBox: '0 0 24 24',
    circles: [
      { cx: 5, cy: 5 },
      { cx: 12, cy: 5 },
      { cx: 19, cy: 5 },
      { cx: 5, cy: 12 },
      { cx: 12, cy: 12 },
      { cx: 19, cy: 12 },
      { cx: 5, cy: 19 },
      { cx: 12, cy: 19 },
      { cx: 19, cy: 19 },
    ],
  },
  'dot-target': {
    viewBox: '0 0 24 24',
    ring: { cx: 12, cy: 12, r: 9 },
    circles: [
      { cx: 12, cy: 12, r: 2.2, accent: true },
      { cx: 12, cy: 3, opacity: SAT, r: 1 },
      { cx: 12, cy: 21, opacity: SAT, r: 1 },
      { cx: 3, cy: 12, opacity: SAT, r: 1 },
      { cx: 21, cy: 12, opacity: SAT, r: 1 },
    ],
  },
  'dot-list': {
    viewBox: '0 0 24 24',
    circles: [
      { cx: 12, cy: 5 },
      { cx: 12, cy: 12 },
      { cx: 12, cy: 19 },
      { cx: 5, cy: 12, opacity: SAT },
      { cx: 19, cy: 12, opacity: SAT },
    ],
  },
  'dot-letter-a': {
    viewBox: '0 0 24 24',
    circles: [
      { cx: 9, cy: 4 },
      { cx: 15, cy: 4 },
      { cx: 5, cy: 9 },
      { cx: 19, cy: 9 },
      { cx: 5, cy: 14 },
      { cx: 10, cy: 14 },
      { cx: 14, cy: 14 },
      { cx: 19, cy: 14 },
      { cx: 5, cy: 19 },
      { cx: 19, cy: 19 },
    ],
  },
};

export default function DotIcon({ name, size = 20, className = '', animated = true, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!animated) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-animated', '');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animated]);

  const icon = ICONS[name];
  if (!icon) return null;

  const cls = ['dot-icon', `dot-icon--${name}`, className].filter(Boolean).join(' ');

  return (
    <svg
      ref={ref}
      className={cls}
      width={size}
      height={size}
      viewBox={icon.viewBox}
      role="img"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {icon.ring ? (
        <circle
          cx={icon.ring.cx}
          cy={icon.ring.cy}
          r={icon.ring.r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
      ) : null}
      {icon.circles.map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={c.r ?? R}
          fill={c.accent ? 'var(--accent)' : 'currentColor'}
          opacity={c.opacity}
        />
      ))}
    </svg>
  );
}
