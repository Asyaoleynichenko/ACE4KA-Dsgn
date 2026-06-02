import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { projectMatchesFilter } from '../data/projectFilterTags.js';
import { getBentoLayoutClassMap } from '../utils/projectsBentoLayout.js';
import { SMART_EASE } from '../motion/smartAnimate.js';

const MORPH_DURATION_MS = 960;
const GOO_FILTER_ID = 'bento-goo';

const cellVariants = {
  initial: { opacity: 0, scale: 0.2, borderRadius: '48%' },
  enter: {
    opacity: 1,
    scale: 1,
    borderRadius: '1rem',
    transition: {
      opacity: { duration: 0.38, ease: SMART_EASE },
      scale: { type: 'spring', stiffness: 200, damping: 22, mass: 1 },
      borderRadius: { duration: 0.62, ease: SMART_EASE },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.15,
    borderRadius: '50%',
    transition: {
      opacity: { duration: 0.32, ease: [0.55, 0, 0.75, 0.15] },
      scale: { duration: 0.5, ease: [0.55, 0, 0.75, 0.15] },
      borderRadius: { duration: 0.4, ease: SMART_EASE },
    },
  },
};

const layoutTransition = {
  type: 'spring',
  stiffness: 220,
  damping: 26,
  mass: 0.95,
};

/** Случайные позиции/радиусы блоб-ваш для метаболл-эффекта поверх сетки. */
function makeBlobs(seed) {
  const rng = (i) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 233280;
    return x - Math.floor(x);
  };
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    cx: 8 + rng(i) * 84,
    cy: 12 + rng(i + 11) * 76,
    r: 5 + rng(i + 23) * 10,
    delay: rng(i + 31) * 0.18,
  }));
}

export default function ProjectsBentoGrid({ slugs, resolveProject, className = '', ...gridProps }) {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') ?? 'vsyo';
  const reduceMotion = useReducedMotion();

  const visibleSlugs = useMemo(
    () => slugs.filter((slug) => projectMatchesFilter(slug, filter)),
    [slugs, filter],
  );

  const bentoClassMap = useMemo(
    () => getBentoLayoutClassMap(visibleSlugs),
    [visibleSlugs],
  );

  /* «is-morphing» висит на сетке во время перехода фильтра — включает goo-wash слой и will-change. */
  const [isMorphing, setIsMorphing] = useState(false);
  const [morphSeed, setMorphSeed] = useState(0);
  const prevFilterRef = useRef(filter);

  useEffect(() => {
    if (prevFilterRef.current === filter) return;
    prevFilterRef.current = filter;
    if (reduceMotion) return;
    setMorphSeed((s) => s + 1);
    setIsMorphing(true);
    const id = window.setTimeout(() => setIsMorphing(false), MORPH_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [filter, reduceMotion]);

  const blobs = useMemo(() => makeBlobs(morphSeed || 1), [morphSeed]);

  return (
    <motion.div
      className={`preview-grid preview-bento${isMorphing ? ' is-morphing' : ''}${className ? ` ${className}` : ''}`}
      layout={!reduceMotion}
      role="list"
      aria-live="polite"
      aria-relevant="additions removals"
      {...gridProps}
    >
      {/* SVG goo-filter в DOM один раз; визуально не виден, используется блоб-вашем поверх сетки. */}
      <svg
        className="preview-bento__goo-defs"
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
      >
        <defs>
          <filter id={GOO_FILTER_ID} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="bento-blur" />
            <feColorMatrix
              in="bento-blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="bento-goo"
            />
            <feBlend in="SourceGraphic" in2="bento-goo" />
          </filter>
        </defs>
      </svg>

      <div
        className={[
          'preview-bento__cells',
          isMorphing && !reduceMotion ? 'is-goo' : '',
          visibleSlugs.length > 0 && visibleSlugs.length !== 10 ? 'is-compact' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
      <AnimatePresence mode="popLayout" initial={false}>
        {/* Метаболл-wash поверх сетки — только во время смены фильтра. */}
        {isMorphing && !reduceMotion ? (
          <motion.div
            key={`bento-wash-${morphSeed}`}
            className="preview-bento__wash"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: SMART_EASE }}
          >
            <svg
              className="preview-bento__wash-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <g filter={`url(#${GOO_FILTER_ID})`}>
                {blobs.map((b) => (
                  <motion.circle
                    key={b.id}
                    cx={b.cx}
                    cy={b.cy}
                    fill="rgba(245, 245, 245, 0.16)"
                    initial={{ r: 0 }}
                    animate={{ r: [0, b.r * 1.6, b.r * 0.8, 0] }}
                    transition={{
                      duration: 0.72,
                      delay: b.delay,
                      times: [0, 0.35, 0.7, 1],
                      ease: SMART_EASE,
                    }}
                  />
                ))}
              </g>
            </svg>
          </motion.div>
        ) : null}

        {visibleSlugs.map((slug) => {
          const p = resolveProject(slug);
          if (!p) return null;
          const cellClass = bentoClassMap.get(slug) ?? 'preview-bento__cell--tile-2';
          return (
            <motion.div
              key={slug}
              role="listitem"
              layout={!reduceMotion}
              layoutId={!reduceMotion ? `bento-cell-${slug}` : undefined}
              className={`preview-bento__cell ${cellClass}`}
              variants={reduceMotion ? undefined : cellVariants}
              initial={reduceMotion ? false : 'initial'}
              animate={reduceMotion ? undefined : 'enter'}
              exit={reduceMotion ? undefined : 'exit'}
              transition={reduceMotion ? undefined : { layout: layoutTransition }}
              style={{ transformOrigin: 'center center', borderRadius: '1rem' }}
            >
              <ProjectCard
                slug={slug}
                title={tWithFallback(t, `projects.cards.${slug}.title`, p.title)}
                meta={tWithFallback(t, `projects.cards.${slug}.meta`, p.meta)}
                desc={tWithFallback(t, `projects.cards.${slug}.desc`, p.desc)}
                image={p.cardImage ?? p.image}
                video={p.video}
                isDemo={false}
                variant="overlay"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
        {visibleSlugs.length === 0 ? (
          <p className="preview-bento__empty">{t('projectsPage.emptyFilter')}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
