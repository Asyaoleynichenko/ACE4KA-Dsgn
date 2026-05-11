import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';

const COLLAPSED_STORAGE = 'ace4ka:caseSpyNavCollapsed';

const spring = { type: 'spring', stiffness: 400, damping: 32, mass: 0.85 };

function dashWidth(level, isActive) {
  const l1 = (level ?? 2) <= 1;
  if (isActive) return l1 ? 40 : 26;
  return l1 ? 15 : 8;
}

function navigableRows(sections) {
  return sections.filter((s) => s.id);
}

/** Оглавление кейса: стеклянная панель + сворачивание в колонку «тире». */
export default function ProjectCaseStudySpyNav({ sections, activeId }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const tx = reduceMotion ? { duration: 0.16 } : spring;

  /** Портал в body: иначе position:fixed цепляется к .page-transition с transform и пропадает с края экрана */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(COLLAPSED_STORAGE) === '1';
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

  if (!sections?.length) return null;
  if (!mounted || typeof document === 'undefined') return null;

  const rail = (
    <nav
      className="pointer-events-auto fixed top-1/2 z-[120] hidden min-[768px]:block -translate-y-1/2"
      style={{ right: 'max(12px, env(safe-area-inset-right, 0px))' }}
      aria-label={t('projectDetail.spyNavAria')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!collapsed ? (
          <motion.div
            key="spy-expanded"
            initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 14, filter: 'blur(4px)' }}
            transition={tx}
            className="relative max-w-[min(268px,calc(42vw-20px))] rounded-[1.35rem] border border-white/12 bg-black/40 px-4 py-5 pr-11 font-sans shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <button
              type="button"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
              aria-expanded="true"
              aria-label={t('projectDetail.spyNavCollapse')}
              onClick={() => setCollapsed(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <ol className="m-0 list-none space-y-3 p-0" id="case-spy-outline">
              {sections.map((entry, index) => {
                if (entry.chapterTitle) {
                  return (
                    <li key={`spy-ch-${index}`} className="border-b border-white/10 pb-2.5">
                      <div className="flex items-start gap-2.5">
                        <span
                          className="mt-[0.38em] inline-block h-0.5 w-4 shrink-0 rounded-full bg-white/50"
                          aria-hidden
                        />
                        <span className="text-[10px] font-semibold uppercase leading-snug tracking-[0.09em] text-white/95">
                          {entry.chapterTitle}
                        </span>
                      </div>
                    </li>
                  );
                }

                const { id, label, keyword, caption, level } = entry;
                const lv = level ?? (hasChapter ? 2 : 1);
                const isRich = Boolean(keyword && caption);
                const titleAttr = isRich ? `${keyword} — ${caption}` : label;
                const isActive = activeId === id;

                if (!hasChapter) {
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="group flex items-start gap-2.5 rounded-lg py-1 outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/40"
                        aria-current={isActive ? 'location' : undefined}
                        title={titleAttr}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToId(id);
                        }}
                      >
                        <motion.span
                          className="mt-[0.42em] inline-block h-0.5 shrink-0 rounded-full"
                          layout={false}
                          initial={false}
                          animate={{
                            width: dashWidth(lv, isActive),
                            backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.32)',
                            opacity: isActive ? 1 : 0.6,
                          }}
                          transition={tx}
                          aria-hidden
                        />
                        <span
                          className={`min-w-0 text-[11px] uppercase leading-snug tracking-[0.12em] ${
                            isActive ? 'font-semibold text-white' : 'font-medium text-white/45'
                          }`}
                        >
                          {label}
                        </span>
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={id} className="pl-2">
                    <a
                      href={`#${id}`}
                      className="flex flex-col gap-0.5 rounded-lg py-1 pl-2 outline-none ring-offset-2 ring-offset-transparent transition-colors focus-visible:ring-2 focus-visible:ring-white/40"
                      aria-current={isActive ? 'location' : undefined}
                      title={titleAttr}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(id);
                      }}
                    >
                      <span
                        className={`text-[11px] uppercase tracking-[0.12em] ${
                          isActive ? 'font-bold text-white' : 'font-semibold text-white/42'
                        }`}
                      >
                        {keyword ?? label}
                      </span>
                      {isRich ? (
                        <span
                          className={`text-[10px] font-medium normal-case leading-snug tracking-[0.03em] ${
                            isActive ? 'text-white/88' : 'text-white/36'
                          }`}
                        >
                          {caption}
                        </span>
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        ) : (
          <motion.div
            key="spy-collapsed"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={tx}
            className="flex flex-col items-end gap-2"
          >
            <div className="flex flex-col items-end gap-1.5 rounded-2xl border border-white/10 bg-black/38 px-2.5 py-3 shadow-lg backdrop-blur-xl">
              {rows.map((entry) => {
                const { id, label, keyword, caption, level } = entry;
                const lv = level ?? (hasChapter ? 2 : 1);
                const isActive = activeId === id;
                const tip = keyword && caption ? `${keyword} — ${caption}` : label;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    title={tip}
                    className="flex justify-end py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(id);
                    }}
                  >
                    <motion.div
                      className="h-0.5 rounded-full"
                      initial={false}
                      animate={{
                        width: dashWidth(lv, isActive),
                        backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.28)',
                        opacity: isActive ? 1 : 0.52,
                      }}
                      transition={tx}
                    />
                  </a>
                );
              })}
            </div>
            <motion.button
              type="button"
              layout
              className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-full border border-white/12 bg-black text-white/75 shadow-md transition hover:bg-zinc-950 hover:text-white"
              aria-expanded="false"
              aria-label={t('projectDetail.spyNavExpand')}
              onClick={() => setCollapsed(false)}
            >
              <span className="flex flex-col items-center justify-center gap-[3px]" aria-hidden>
                <span className="h-0.5 w-[14px] rounded-full bg-current opacity-90" />
                <span className="h-0.5 w-[14px] rounded-full bg-current opacity-65" />
                <span className="h-0.5 w-[14px] rounded-full bg-current opacity-45" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  return createPortal(rail, document.body);
}
