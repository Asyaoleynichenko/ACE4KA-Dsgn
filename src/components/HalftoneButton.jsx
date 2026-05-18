import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/**
 * Glossy fintech CTA + Swap-style halftone: static dots × radial map from center (multiply + contrast).
 */
export default function HalftoneButton({ to, href, children, ariaLabel, className = '' }) {
  const inner = (
    <>
      <span className="btn-show-all__halftone" aria-hidden="true" />
      <span className="btn-show-all__label">{children}</span>
    </>
  );
  const cls = `btn-show-all ${className}`.trim();

  if (href) {
    return (
      <a
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
    <SeamlessProjectsLink to={to} className={cls} aria-label={ariaLabel}>
      {inner}
    </SeamlessProjectsLink>
  );
}
