import { useEffect, useRef } from 'react';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/**
 * Концентрические кольца точек (DOTWAVE): 10 колец, dotsPerCircle = 12 + i*6.
 * Плотность каждого кольца пульсирует со сдвигом фазы — создаёт «ripple».
 * Idle: медленно и приглушённо. Hover: быстрее и ярче.
 */
const RING_COUNT = 10;
const BASE_DOTS = 12;
const DOTS_PER_STEP = 6;
const PHASE_PER_RING = 0.55;

export default function HalftoneButton({ to, children, ariaLabel, className = '' }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const linkRef = useRef(null);
  const hoverRef = useRef(false);
  const tickRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const link = linkRef.current;
    if (!canvas || !wrap || !link) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sync = () => {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    sync();

    const drawFrame = () => {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      /** Outer ring extends 10% past the longer side — обрезается overflow:hidden на кнопке. */
      const maxR = Math.max(cx, cy) * 1.1;
      const ringStep = maxR / RING_COUNT;

      const hovering = hoverRef.current;
      const baseAlpha = hovering ? 1 : 0.42;
      const speed = hovering ? 0.052 : 0.018;

      ctx.clearRect(0, 0, w, h);

      for (let i = 1; i <= RING_COUNT; i += 1) {
        const ringR = i * ringStep;
        const dots = BASE_DOTS + i * DOTS_PER_STEP;
        const ringPhase = i * PHASE_PER_RING;
        /** intensity ∈ [0..1] — синусоида со сдвигом по индексу кольца, отсюда волна. */
        const intensity = (Math.sin(tickRef.current * speed + ringPhase) + 1) / 2;

        const dotR = 0.9 + intensity * 1.6;
        const alpha = (0.14 + intensity * 0.62) * baseAlpha;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;

        for (let j = 0; j < dots; j += 1) {
          const angle = (j / dots) * Math.PI * 2;
          const x = cx + ringR * Math.cos(angle);
          const y = cy + ringR * Math.sin(angle);
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      drawFrame();
      tickRef.current += 1;
      rafRef.current = requestAnimationFrame(loop);
    };

    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
    };
    const onFocus = () => {
      hoverRef.current = true;
    };
    const onBlur = () => {
      hoverRef.current = false;
    };
    link.addEventListener('pointerenter', onEnter);
    link.addEventListener('pointerleave', onLeave);
    link.addEventListener('focus', onFocus);
    link.addEventListener('blur', onBlur);

    if (reducedMotion) {
      drawFrame();
    } else {
      loop();
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      link.removeEventListener('pointerenter', onEnter);
      link.removeEventListener('pointerleave', onLeave);
      link.removeEventListener('focus', onFocus);
      link.removeEventListener('blur', onBlur);
    };
  }, []);

  return (
    <SeamlessProjectsLink
      to={to}
      className={`btn-show-all ${className}`.trim()}
      aria-label={ariaLabel}
      ref={linkRef}
    >
      <span className="btn-show-all__canvas-wrap" ref={wrapRef} aria-hidden="true">
        <canvas ref={canvasRef} className="btn-show-all__canvas" />
      </span>
      <span className="btn-show-all__label">{children}</span>
    </SeamlessProjectsLink>
  );
}
