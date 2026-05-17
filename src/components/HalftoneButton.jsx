import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/**
 * Кнопка «ВСЕ ПРОЕКТЫ» — pink pill, halftone-точки с пропорциональным изменением размера
 * через blur + contrast в изолированном чёрном слое, наложенном через mix-blend-mode: lighten.
 */
export default function HalftoneButton({ to, children, ariaLabel, className = '' }) {
  return (
    <SeamlessProjectsLink
      to={to}
      className={`btn-show-all ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <span className="btn-show-all__side btn-show-all__side--left" aria-hidden="true">
        <span className="btn-show-all__field" />
      </span>
      <span className="btn-show-all__label">{children}</span>
      <span className="btn-show-all__side btn-show-all__side--right" aria-hidden="true">
        <span className="btn-show-all__field" />
      </span>
    </SeamlessProjectsLink>
  );
}
