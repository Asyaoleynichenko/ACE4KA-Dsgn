import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../gsap/setup.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { MOTION, prefersReducedMotion } from '../motion/motionSystem.js';
import { setupHeroScrollTimeline } from '../gsap/heroScrollTimeline.js';

function setSceneVars(targets, vars) {
  for (const el of targets) {
    if (!el) continue;
    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
  }
}

/**
 * Главная как единый motion object: scroll = camera, сцены перетекают друг в друга.
 */
export function useHomeCameraScroll(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const rail = root.querySelector('[data-camera-rail]');
    const world = root.querySelector('.home-world');
    if (!rail || !world) return undefined;

    const targets = [root];
    const hero = rail.querySelector('[data-scene="hero"]');
    /* Сброс инлайн-трансформов от старого hero-pin / HMR — иначе фото и папки висят поверх следующего блока */
    if (hero) {
      hero.querySelectorAll(
        '.header-item--folder, .header-item--image-well, .hero__card, .hero-about__footer, .hero-role, .hero-title, .hero-text',
      ).forEach((el) => {
        gsap.set(el, { clearProps: 'transform,opacity,visibility,x,y,scale,xPercent,yPercent' });
      });
      delete hero.dataset.heroScroll;
    }
    const competencies = rail.querySelector('[data-scene="competencies"]');
    const projects = rail.querySelector('[data-scene="projects"]');
    if (competencies) {
      gsap.set(competencies, { clearProps: 'transform,opacity,visibility' });
    }
    const defaults = {
      '--camera-p': '0',
      '--scene-comp': '0',
      '--scene-projects': '0',
      '--world-hue': '280',
    };
    setSceneVars(targets, defaults);

    if (prefersReducedMotion()) {
      setSceneVars(targets, {
        '--camera-p': '1',
        '--scene-comp': '1',
        '--scene-projects': '1',
      });
      return undefined;
    }

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'home-camera-master',
        trigger: rail,
        start: 'top top',
        end: 'bottom bottom',
        scrub: MOTION.scrub,
        scroller,
        onUpdate(self) {
          const p = self.progress;
          setSceneVars(targets, {
            '--camera-p': p.toFixed(4),
            '--world-hue': String(280 + p * 40),
          });
        },
      });

      setupHeroScrollTimeline(hero, competencies, { scroller });

      if (competencies) {
        ScrollTrigger.create({
          id: 'home-camera-comp',
          trigger: competencies,
          start: 'top bottom',
          end: 'bottom top',
          scrub: MOTION.scrub,
          scroller,
          onUpdate(self) {
            setSceneVars(targets, {
              '--scene-comp': self.progress.toFixed(4),
            });
          },
        });
      }

      if (projects) {
        ScrollTrigger.create({
          id: 'home-camera-projects',
          trigger: projects,
          start: 'top 92%',
          end: 'top 28%',
          scrub: MOTION.scrub,
          scroller,
          onUpdate(self) {
            const p = self.progress;
            setSceneVars(targets, {
              '--scene-projects': p.toFixed(4),
            });
          },
        });
      }

      /* parallax-depth тоже сдвигал блоки и ломал сетку */
    }, root);

    const rafId = requestAnimationFrame(() => refreshScrollTrigger());

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
      for (const el of targets) {
        if (!el) continue;
        for (const key of Object.keys(defaults)) {
          el.style.removeProperty(key);
        }
      }
      rail.querySelectorAll('[data-camera-depth]').forEach((el) => {
        el.style.removeProperty('--camera-shift-y');
      });
    };
  }, [rootRef]);
}
