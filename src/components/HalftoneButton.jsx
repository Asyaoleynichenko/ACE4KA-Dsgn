import { useRef } from 'react';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';
import { useSvgDisplacementHover } from '../hooks/useSvgDisplacementHover.js';

/**
 * Glossy fintech CTA + Swap-style halftone: static dots × radial map + SVG displacement on hover.
 */
export default function HalftoneButton({ to, href, children, ariaLabel, className = '' }) {
  const rootRef = useRef(null);
  useSvgDisplacementHover(rootRef, { mapId: 'ace-halftone-liquid-map', scaleHover: 18 });

  const inner = (
    <>
      <span className="btn-show-all__halftone btn-show-all__halftone--liquid" aria-hidden="true" />
      <span className="btn-show-all__label">{children}</span>
    </>
  );
  const cls = `btn-show-all liquid-displace-host ${className}`.trim();

  if (href) {
    return (
      <a
        ref={rootRef}
        href={href}
        className={cls}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return (
    <SeamlessProjectsLink ref={rootRef} to={to} className={cls} aria-label={ariaLabel}>
      {inner}
    </SeamlessProjectsLink>
  );
}
