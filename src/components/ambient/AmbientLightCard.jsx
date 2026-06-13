import { forwardRef, useEffect, useId, useRef } from 'react';
import { useAmbientLightOptional } from '../../context/AmbientLightProvider.jsx';

const DEFAULT_GLOW = '255, 255, 255';

/** Dark glass card with inset white glow (no external bloom). */
const AmbientLightCard = forwardRef(function AmbientLightCard(
  {
    as: Tag = 'li',
    className = '',
    glowColor = DEFAULT_GLOW,
    children,
    ...rest
  },
  forwardedRef,
) {
  const id = useId();
  const localRef = useRef(null);
  const ref = forwardedRef ?? localRef;
  const ambient = useAmbientLightOptional();

  useEffect(() => {
    const el = ref.current;
    if (!el || !ambient) return undefined;
    el.style.setProperty('--ambient-glow-rgb', glowColor);
    ambient.register(id, el, { color: glowColor });
    return () => ambient.unregister(id);
  }, [ambient, glowColor, id, ref]);

  return (
    <Tag ref={ref} className={`ambient-light-card ${className}`.trim()} {...rest}>
      <span className="ambient-light-card__clip" aria-hidden="true">
        <span className="ambient-light-card__surface" />
        <span className="ambient-light-card__rim" />
      </span>
      <div className="ambient-light-card__content">{children}</div>
    </Tag>
  );
});

export default AmbientLightCard;
