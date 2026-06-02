import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../gsap/setup.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { MOTION, prefersReducedMotion } from '../motion/motionSystem.js';

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

    // CSS custom properties наследуются: пишем сцену-переменные только на корень
    // (.home-page--seamless), а .home-world / [data-camera-rail] читают их через var().
    // Так на каждом кадре скролла одна запись вместо трёх на каждую переменную.
    const targets = [root];
    const hero = rail.querySelector('[data-scene="hero"]');
    const competencies = rail.querySelector('[data-scene="competencies"]');
    const projects = rail.querySelector('[data-scene="projects"]');
    const bridgeType = root.querySelector('.home-type-bridge');

    const defaults = {
      '--camera-p': '0',
      '--hero-exit': '0',
      '--scene-comp': '0',
      '--scene-projects': '0',
      '--type-bridge': '0',
      '--world-hue': '280',
    };
    setSceneVars(targets, defaults);

    if (prefersReducedMotion()) {
      setSceneVars(targets, {
        '--camera-p': '1',
        '--hero-exit': '0',
        '--scene-comp': '1',
        '--scene-projects': '1',
        '--type-bridge': '1',
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

      if (hero) {
        ScrollTrigger.create({
          id: 'home-camera-hero-exit',
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: MOTION.scrub,
          scroller,
          onUpdate(self) {
            const exit = self.progress;
            setSceneVars(targets, {
              '--hero-exit': exit.toFixed(4),
            });
          },
        });
      }

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
              '--type-bridge': p.toFixed(4),
            });
            /* opacity — только через --type-bridge в CSS, без inline blur */
          },
        });
      }

      rail.querySelectorAll('[data-camera-depth]').forEach((el) => {
        const depth = parseFloat(el.dataset.cameraDepth) || 1;
        ScrollTrigger.create({
          trigger: rail,
          start: 'top top',
          end: 'bottom bottom',
          scrub: MOTION.scrub,
          scroller,
          onUpdate(self) {
            const shift = (self.progress - 0.5) * depth * MOTION.camera.parallaxSpan;
            el.style.setProperty('--camera-shift-y', `${shift.toFixed(2)}px`);
          },
        });
      });
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
      if (bridgeType) bridgeType.style.removeProperty('opacity');
      rail.querySelectorAll('[data-camera-depth]').forEach((el) => {
        el.style.removeProperty('--camera-shift-y');
      });
    };
  }, [rootRef]);
}
