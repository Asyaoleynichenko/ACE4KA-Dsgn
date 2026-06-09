import { useEffect, useRef, useState } from 'react';

/**
 * Кастомный курсор: точка с lerp-инерцией (та же физика, что у проекта),
 * превращается в кружок «View» над карточками кейсов. Только desktop-указатель,
 * выключается на тачах и при prefers-reduced-motion.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    const dot = dotRef.current;
    if (!dot) return undefined;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let visible = false;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
      }
    };

    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      dot.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let current = '';
    const onOver = (e) => {
      const hit = e.target.closest?.('[data-cursor], .preview-card, .preview-card__link');
      const next = hit ? hit.getAttribute?.('data-cursor') || 'View' : '';
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const onLeaveWindow = () => {
      visible = false;
      dot.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeaveWindow);
    document.documentElement.classList.add('has-custom-cursor');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className={`cursor-dot${label ? ' cursor-dot--label' : ''}`}
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {label ? <span className="cursor-dot__label">{label}</span> : null}
    </div>
  );
}
