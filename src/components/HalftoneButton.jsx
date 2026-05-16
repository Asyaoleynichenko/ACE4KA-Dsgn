import { useEffect, useRef } from 'react';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

const GRID = 19;              // расстояние между центрами точек
const MAX_R = GRID * 0.44;    // радиус у дальнего края
const SPEED = 0.38;           // px за кадр

/**
 * Кнопка «ВСЕ ПРОЕКТЫ» с canvas-halftone: зеркальные точки слева/справа,
 * растут от центра (r=0) к краю (r=MAX_R), плавно «выезжают» наружу.
 */
export default function HalftoneButton({ to, children, ariaLabel, className = '' }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    /** Уважаем reduced-motion — отрисовываем один статичный кадр и не запускаем RAF. */
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let offset = 0;

    const sync = () => {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
    };

    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    sync();

    const drawFrame = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const halfCols = Math.ceil(cx / GRID) + 2;
      const rows = Math.ceil(h / GRID) + 1;

      ctx.clearRect(0, 0, w, h);

      for (const side of [-1, 1]) {
        for (let col = 0; col < halfCols; col += 1) {
          for (let row = 0; row < rows; row += 1) {
            /** Дистанция от центра — циклит 0 → cx, что и даёт эффект «движения наружу». */
            const dist = (col * GRID + (offset % GRID)) % cx;
            const x = cx + side * dist;
            const yShift = col % 2 === 0 ? 0 : GRID / 2;
            const y = row * GRID + yShift - GRID / 2;

            const norm = dist / cx; // 0 у центра → 1 у края
            const r = MAX_R * norm;
            if (r < 1) continue;

            const alpha = 0.14 + norm * 0.52;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
            ctx.fill();
          }
        }
      }
    };

    const loop = () => {
      drawFrame();
      offset += SPEED;
      rafRef.current = requestAnimationFrame(loop);
    };

    if (reducedMotion) {
      drawFrame();
    } else {
      loop();
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <SeamlessProjectsLink to={to} className={`btn-show-all ${className}`.trim()} aria-label={ariaLabel}>
      <span className="btn-show-all__canvas-wrap" ref={wrapRef} aria-hidden="true">
        <canvas ref={canvasRef} className="btn-show-all__canvas" />
      </span>
      <span className="btn-show-all__label">{children}</span>
    </SeamlessProjectsLink>
  );
}
