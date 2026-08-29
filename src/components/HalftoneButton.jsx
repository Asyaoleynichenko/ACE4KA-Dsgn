import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/**
 * Glossy fintech CTA + edge halftone. Hover is CSS glow only.
 */
export default function HalftoneButton({ to, href, children, ariaLabel, className = '', ...rest }) {
  const inner = (
    <>
      <span className="btn-show-all__halftone btn-show-all__halftone--liquid" aria-hidden="true" />
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
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <SeamlessProjectsLink to={to} className={cls} aria-label={ariaLabel} {...rest}>
      {inner}
    </SeamlessProjectsLink>
  );
}
