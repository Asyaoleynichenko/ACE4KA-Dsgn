import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { smartTween, smartTweenReduced } from '../motion/smartAnimate.js';

const COLLAPSED_STORAGE = 'ace4ka:caseSpyNavCollapsed';

function dashWidthPx(level, isActive) {
  const l1 = (level ?? 2) <= 1;
  if (isActive) return l1 ? 44 : 28;
  return l1 ? 18 : 10;
}

function navigableRows(sections) {
  return sections.filter((s) => s.id);
}

/** Оглавление кейса: fixed справа по центру вьюпорта (портал в body из-за transform у .page-transition). */
export default function ProjectCaseStudySpyNav({ sections, activeId }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion() === true;

  const [mounted, setMounted] = useState(false);
  const [canHoverOpen, setCanHoverOpen] = useState(false);
  const leaveTimerRef = useRef(null);
  const hoverSuppressRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const syncHover = () => setCanHoverOpen(mq.matches);
    syncHover();
    mq.addEventListener('change', syncHover);
    return () => mq.removeEventListener('change', syncHover);
  }, []);

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current != null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const scheduleCollapse = () => {
    clearLeaveTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      leaveTimerRef.current = null;
      setCollapsed(true);
    }, 220);
  };

  useEffect(() => () => clearLeaveTimer(), []);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.sessionStorage.getItem(COLLAPSED_STORAGE);
    if (stored === null || stored === '') return true;
    return stored === '1';
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(COLLAPSED_STORAGE, collapsed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const rows = useMemo(() => navigableRows(sections), [sections]);
  const hasChapter = sections.some((s) => s.chapterTitle);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const ui = reduceMotion ? smartTweenReduced() : smartTween(0.28);
  const panel = reduceMotion ? smartTweenReduced() : smartTween(0.34);
  const layout = reduceMotion ? smartTweenReduced() : smartTween(0.24);
  const micro = reduceMotion ? smartTweenReduced() : smartTween(0.16);

  const dashStagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.028,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  const dashRow = {
    hidden: reduceMotion ? {} : { opacity: 0, x: 10 },
    show: { opacity: 1, x: 0, transition: ui },
  };

  if (!sections?.length) return null;

  const openFromHover = () => {
    clearLeaveTimer();
    if (!canHoverOpen || hoverSuppressRef.current) return;
    setCollapsed(false);
  };

  const handleNavMouseLeave = () => {
    hoverSuppressRef.current = false;
    if (!canHoverOpen) return;
    scheduleCollapse();
  };

  const handleNavFocusCapture = () => {
    clearLeaveTimer();
    setCollapsed(false);
  };

  const handleNavBlurCapture = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (canHoverOpen) scheduleCollapse();
    else setCollapsed(true);
  };

  const handleCollapseClick = () => {
    hoverSuppressRef.current = true;
    setCollapsed(true);
  };

  const nav = (
    <nav
      className={`case-study-rail case-study-rail--fixed${collapsed ? ' case-study-rail--collapsed' : ''}${canHoverOpen ? ' case-study-rail--hover-expand' : ''}`}
      aria-label={t('projectDetail.spyNavAria')}
      aria-expanded={canHoverOpen ? !collapsed : undefined}
      onMouseEnter={openFromHover}
      onMouseLeave={handleNavMouseLeave}
      onFocusCapture={handleNavFocusCapture}
      onBlurCapture={handleNavBlurCapture}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!collapsed ? (
          <motion.div
            key="rail-expanded"
            className="case-study-rail__panel"
            initial={reduceMotion ? false : { opacity: 0, x: 18, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 12, scale: 0.985 }}
            transition={panel}
            whileHover={reduceMotion || canHoverOpen ? undefined : { y: -2, transition: micro }}
          >
            <motion.button
              type="button"
              className="case-study-rail__icon-btn case-study-rail__icon-btn--collapse"
              aria-expanded="true"
              aria-label={t('projectDetail.spyNavCollapse')}
              onClick={handleCollapseClick}
              whileTap={reduceMotion ? undefined : { scale: 0.9 }}
              transition={micro}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
            <ol className="case-study-rail__list">
              {sections.map((entry, index) => {
                if (entry.chapterTitle) {
                  return (
                    <motion.li
                      key={`spy-ch-${index}`}
                      className="case-study-rail__chapter"
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...ui, delay: reduceMotion ? 0 : index * 0.02 }}
                    >
                      <span className="case-study-rail__chapter-dash" aria-hidden />
                      <span className="case-study-rail__chapter-text">{entry.chapterTitle}</span>
                    </motion.li>
                  );
                }

                const { id, label, keyword, caption, level } = entry;
                const lv = level ?? (hasChapter ? 2 : 1);
                const isRich = Boolean(keyword && caption);
                const titleAttr = isRich ? `${keyword} — ${caption}` : label;
                const isActive = activeId === id;

                if (!hasChapter) {
                  return (
                    <motion.li
                      key={id}
                      initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...ui, delay: reduceMotion ? 0 : index * 0.018 }}
                    >
                      <motion.a
                        href={`#${id}`}
                        className={`case-study-rail__link case-study-rail__link--flat${isActive ? ' is-active' : ''}`}
                        aria-current={isActive ? 'location' : undefined}
                        title={titleAttr}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToId(id);
                        }}
                        whileHover={reduceMotion ? undefined : { x: -3 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        transition={ui}
                      >
                        <motion.span
                          className="case-study-rail__dash"
                          style={{ width: `${dashWidthPx(lv, isActive)}px`, transformOrigin: 'right center' }}
                          layout={!reduceMotion}
                          transition={{ layout }}
                          aria-hidden
                          whileHover={reduceMotion ? undefined : { scaleX: 1.1 }}
                        />
                        <span className="case-study-rail__link-text">{label}</span>
                      </motion.a>
                    </motion.li>
                  );
                }

                return (
                  <motion.li
                    key={id}
                    initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...ui, delay: reduceMotion ? 0 : index * 0.018 }}
                  >
                    <motion.a
                      href={`#${id}`}
                      className={`case-study-rail__link case-study-rail__link--stack${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'location' : undefined}
                      title={titleAttr}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(id);
                      }}
                      whileHover={reduceMotion ? undefined : { x: -2 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                      transition={ui}
                    >
                      <span className="case-study-rail__kw">{keyword ?? label}</span>
                      {isRich ? <span className="case-study-rail__cap">{caption}</span> : null}
                    </motion.a>
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>
        ) : (
          <motion.div
            key="rail-compact"
            className="case-study-rail__panel case-study-rail__panel--compact"
            initial={reduceMotion ? false : { opacity: 0, x: 16, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 10, scale: 0.97 }}
            transition={panel}
            whileHover={reduceMotion || canHoverOpen ? undefined : { x: -6, transition: micro }}
          >
            <motion.div
              className="case-study-rail__dashes"
              variants={dashStagger}
              initial="hidden"
              animate="show"
            >
              {rows.map((entry) => {
                const { id, label, keyword, caption, level } = entry;
                const lv = level ?? (hasChapter ? 2 : 1);
                const isActive = activeId === id;
                const tip = keyword && caption ? `${keyword} — ${caption}` : label;
                const w = dashWidthPx(lv, isActive);
                return (
                  <motion.a
                    key={id}
                    href={`#${id}`}
                    className={`case-study-rail__dash-hit${isActive ? ' is-active' : ''}`}
                    title={tip}
                    aria-current={isActive ? 'location' : undefined}
                    variants={dashRow}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(id);
                    }}
                    whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                    transition={ui}
                  >
                    <motion.span
                      className="case-study-rail__dash"
                      style={{ width: `${w}px`, transformOrigin: 'right center' }}
                      layout={!reduceMotion}
                      transition={{ layout }}
                      aria-hidden
                      whileHover={reduceMotion ? undefined : { scaleX: 1.22, scaleY: 1.35 }}
                    />
                  </motion.a>
                );
              })}
            </motion.div>
            {!canHoverOpen ? (
              <motion.button
                type="button"
                className="case-study-rail__icon-btn case-study-rail__icon-btn--expand"
                aria-expanded="false"
                aria-label={t('projectDetail.spyNavExpand')}
                onClick={() => setCollapsed(false)}
                whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                transition={micro}
              >
                <span className="case-study-rail__burger" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
              </motion.button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  if (!mounted) return null;
  return createPortal(nav, document.body);
}
