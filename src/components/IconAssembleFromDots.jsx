/**
 * Спокойное появление иконки: fade + лёгкий rise (см. `icon-ui-reveal-in` в `style.css`).
 * Пропсы `ringRadiusPx/dotCount/dotPx` игнорируются — оставлены для совместимости вызовов.
 */
export default function IconAssembleFromDots({ children, className = '' }) {
  return (
    <span className={`icon-assemble-dots ${className}`.trim()}>
      <span className="icon-assemble-dots__media">{children}</span>
    </span>
  );
}
