import { motion, useReducedMotion } from 'framer-motion';
import { useIntersectionScrollSpy } from '../hooks/useIntersectionScrollSpy.js';

const spring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.85 };

function dashWidths(level, isActive) {
  const parent = level <= 1;
  if (isActive) return parent ? 44 : 30;
  return parent ? 18 : 10;
}

/**
 * Боковая навигация в духе nektar.tv: тире + подпись, иерархия по level,
 * scrollspy через Intersection Observer, плавные состояния — Framer Motion.
 *
 * @param {{ id: string, label: string, level?: number }[]} items
 */
export default function SideScrollspyNav({ items, ariaLabel, className = '' }) {
  const reduceMotion = useReducedMotion();
  const sectionIds = items.map((i) => i.id);
  const activeId = useIntersectionScrollSpy(sectionIds);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const instant = reduceMotion || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    el.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' });
  };

  if (!items.length) return null;

  return (
    <nav
      className={`pointer-events-auto fixed right-5 top-1/2 z-[55] hidden max-w-[min(220px,calc(50vw-24px))] -translate-y-1/2 min-[1120px]:block ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-6 font-sans shadow-lg shadow-black/20 backdrop-blur-xl">
        <ul className="flex flex-col gap-3.5">
          {items.map(({ id, label, level = 1 }) => {
            const isActive = activeId === id;
            const parent = level <= 1;
            const w = dashWidths(level, isActive);
            return (
              <li key={id} style={{ paddingLeft: parent ? 0 : 12 }}>
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
                      width: w,
                      backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.28)',
                      opacity: isActive ? 1 : 0.55,
                    }}
                    transition={reduceMotion ? { duration: 0.12 } : spring}
                  />
                  <motion.span
                    className="min-w-0 truncate text-left text-[11px] font-medium uppercase tracking-[0.14em] text-white"
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0.4,
                    }}
                    transition={reduceMotion ? { duration: 0.12 } : spring}
                  >
                    {label}
                  </motion.span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
