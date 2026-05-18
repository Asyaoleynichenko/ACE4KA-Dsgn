import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/**
 * Кнопка «ВСЕ ПРОЕКТЫ» — pink pill + halftone-точки с плавным радиальным изменением размера.
 * isolation + чёрный бг + lighten + contrast(400%) → реально variable-size без артефактов.
 *
 * Передайте `to` для внутренней навигации (React Router) или `href` для внешней ссылки
 * (рендерится как обычный `<a target=_blank>`).
 */
export default function HalftoneButton({ to, href, children, ariaLabel, className = '' }) {
  const inner = (
    <>
      <span className="btn-show-all__side btn-show-all__side--left" aria-hidden="true">
        <span className="btn-show-all__field" />
      </span>
      <span className="btn-show-all__label">{children}</span>
      <span className="btn-show-all__side btn-show-all__side--right" aria-hidden="true">
        <span className="btn-show-all__field" />
      </span>
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
