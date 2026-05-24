import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sticker from '../vendor/sticker.js';

export default function AboutJobSticker({
  children,
  className = '',
  peelLabel,
  projectPath,
  ariaLabel,
}) {
  const rootRef = useRef(null);
  const peelRef = useRef(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    const peelEl = peelRef.current;
    if (!el || !peelEl) return undefined;

    let cancelled = false;
    let frameId = 0;

    const mountSticker = () => {
      if (cancelled) return;
      Sticker.init(el, {
        borderRadius: '0.25rem',
        backColor: '#f5ebcc',
        corner: 'bottom-right',
        peelLabel,
        interactionEl: peelEl,
      });
    };

    frameId = requestAnimationFrame(mountSticker);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      Sticker.destroy(el);
    };
  }, [peelLabel]);

  return (
    <div className="about-job__sticker-wrap">
      <div ref={rootRef} className={`sticker about-job__sticker ${className}`.trim()}>
        {children}
      </div>
      <Link
        ref={peelRef}
        className="about-job__peel-link"
        to={projectPath}
        aria-label={ariaLabel}
      />
    </div>
  );
}
