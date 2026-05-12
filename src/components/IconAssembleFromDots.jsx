import { useMemo } from 'react';

/**
 * При первом показе: точки сходятся к центру, затем появляется иконка (scale из центра).
 * Используется в шапке и плашках героя; при `prefers-reduced-motion` — без эффекта.
 */
export default function IconAssembleFromDots({
  children,
  className = '',
  ringRadiusPx = 22,
  dotCount = 16,
  dotPx = 3,
}) {
  const dots = useMemo(
    () =>
      Array.from({ length: dotCount }, (_, i) => ({
        i,
        ang: `${(360 / dotCount) * i}deg`,
        delayFrac: i / Math.max(1, dotCount - 1),
      })),
    [dotCount],
  );

  return (
    <span
      className={`icon-assemble-dots ${className}`.trim()}
      style={{
        '--icon-assemble-r': `${ringRadiusPx}px`,
        '--icon-assemble-dot': `${dotPx}px`,
      }}
    >
      <span className="icon-assemble-dots__burst" aria-hidden="true">
        {dots.map(({ i, ang, delayFrac }) => (
          <span
            key={i}
            className="icon-assemble-dots__dot"
            style={{
              '--ang': ang,
              animationDelay: `${delayFrac * 0.24}s`,
            }}
          />
        ))}
      </span>
      <span className="icon-assemble-dots__media">{children}</span>
    </span>
  );
}
