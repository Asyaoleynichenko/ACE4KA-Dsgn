import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { useIntersectionScrollSpy } from '../hooks/useIntersectionScrollSpy.js';
import { smartTween, smartTweenReduced } from '../motion/smartAnimate.js';
import { scrollToElement } from '../utils/scrollRoot.js';
import { rem } from '../utils/cssRem.js';

function dashWidths(level, isActive) {
  const parent = level <= 1;
  if (isActive) return parent ? 32 : 26;
  return parent ? 20 : 12;
}

/**
 * Боковая навигация: по умолчанию — только вертикальный столбец чёрточек справа;
 * на hover/focus раскрывается в TOC с подписями. scrollspy — IntersectionObserver.
 *
 * @param {{ id: string, label: string, level?: number }[]} items
 */
export default function SideScrollspyNav({ items, ariaLabel, className = '' }) {
  const reduceMotion = useReducedMotion();
  const { lenis } = useLenisInstance();
  const sectionIds = items.map((i) => i.id);
  const activeId = useIntersectionScrollSpy(sectionIds);
  const [expanded, setExpanded] = useState(false);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const instant =
      reduceMotion ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    scrollToElement(el, { lenis, immediate: instant, block: 'start' });
  };

  if (!items.length) return null;

  const tween = reduceMotion ? smartTweenReduced() : smartTween(0.24);

  return (
    <nav
      className={`pointer-events-auto fixed right-5 top-1/2 z-[55] hidden -translate-y-1/2 scrollspy:block ${className}`.trim()}
      aria-label={ariaLabel}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setExpanded(false);
      }}
    >
      <motion.div
        className="font-sans"
        initial={false}
        animate={{
          paddingInline: expanded ? rem(20) : rem(12),
          paddingBlock: expanded ? rem(24) : rem(18),
          backgroundColor: expanded ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0)',
          borderColor: expanded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0)',
        }}
        transition={tween}
        style={{
          borderRadius: rem(24),
          borderWidth: rem(1),
          borderStyle: 'solid',
          backdropFilter: expanded ? 'blur(1.25rem)' : 'none',
          WebkitBackdropFilter: expanded ? 'blur(1.25rem)' : 'none',
          boxShadow: expanded ? '0 0.75rem 2.25rem rgba(0,0,0,0.28)' : 'none',
        }}
      >
        <ul className="flex flex-col gap-3.5">
          {items.map(({ id, label, level = 1 }) => {
            const isActive = activeId === id;
            const parent = level <= 1;
            const w = dashWidths(level, isActive);
            return (
              <li key={id} style={{ paddingLeft: expanded && !parent ? rem(12) : 0 }}>
                <a
                  href={`#${id}`}
                  className="group flex max-w-full items-center gap-3 outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/40"
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(id);
                  }}
                >
                  <motion.div
                    className="h-0.5 shrink-0 rounded-full"
                    initial={false}
                    animate={{
                      width: rem(w),
                      backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.32)',
                      opacity: isActive ? 1 : 0.6,
                    }}
                    transition={tween}
                  />
                  <motion.span
                    className="overflow-hidden whitespace-nowrap text-left text-[0.8125rem] font-medium tracking-[0.01em] text-white"
                    initial={false}
                    animate={{
                      opacity: expanded ? (isActive ? 1 : 0.42) : 0,
                      maxWidth: expanded ? rem(200) : 0,
                      marginLeft: expanded ? 0 : rem(-12),
                    }}
                    transition={tween}
                    aria-hidden={expanded ? undefined : 'true'}
                  >
                    {label}
                  </motion.span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </nav>
  );
}
