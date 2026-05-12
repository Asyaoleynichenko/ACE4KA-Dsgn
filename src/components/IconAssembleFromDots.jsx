/**
 * Мягкое появление иконки из центра.
 * Пропсы `ringRadiusPx/dotCount/dotPx` оставлены для обратной совместимости.
 */
export default function IconAssembleFromDots({ children, className = '' }) {
  return (
    <span className={`icon-assemble-dots ${className}`.trim()}>
      <span className="icon-assemble-dots__media">{children}</span>
    </span>
  );
}
