/**
 * Лоадер Suspense-фолбэка: чёрный экран с проявляющимся именем-вордмарком.
 * Минималистичный, монохромный — в духе канона. Показывается долю секунды
 * (роуты префетчатся), поэтому без тяжёлых анимаций.
 */
export default function SiteLoader() {
  return (
    <div className="site-loader" role="status" aria-live="polite">
      <span className="site-loader__mark">
        <span className="text-condensed">ACE4KA</span>
      </span>
      <span className="sr-only">Загрузка…</span>
    </div>
  );
}
