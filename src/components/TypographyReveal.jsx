import { useLayoutEffect, useRef } from 'react';
import { initTypographyReveal } from '../motion/typographyReveal.js';

/**
 * Cinematic typography: mask reveal + line stagger + variable font + blur sharpen.
 * Не fade-in-up — клип-маска и фильтр.
 */
export default function TypographyReveal({
  as: Tag = 'div',
  className = '',
  variant = 'cinematic',
  trigger = 'load',
  split = 'auto',
  delay = 0,
  stagger = 0.09,
  duration,
  once = true,
  weightTo = 'bold',
  children,
  ...rest
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    return initTypographyReveal(el, {
      variant,
      trigger,
      split,
      delay,
      stagger,
      duration,
      once,
      weightTo,
    });
  }, [variant, trigger, split, delay, stagger, duration, once, weightTo, children]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
