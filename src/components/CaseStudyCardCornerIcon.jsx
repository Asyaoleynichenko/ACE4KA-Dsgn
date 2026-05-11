/**
 * Декоративная иконка угла карточки кейса: базовый PNG + слои «LED-матрицы»
 * (маска = силуэт иконки). Уважает prefers-reduced-motion через CSS.
 */
function ledMaskStyle(src) {
  if (!src) return undefined;
  const safe = String(src)
    .replace(/\\/g, '/')
    .replace(/"/g, '%22')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
  return { '--led-mask': `url("${safe}")` };
}

export default function CaseStudyCardCornerIcon({ src, staggerIndex = 0 }) {
  if (!src) return null;
  const stagger = `${(Number(staggerIndex) % 16) * 0.09}s`;
  return (
    <span
      className="card__corner-icon-led"
      style={{
        ...ledMaskStyle(src),
        '--led-stagger': stagger,
      }}
    >
      <img src={src} alt="" className="card__corner-icon" width={56} height={56} decoding="async" aria-hidden />
      <span className="card__corner-icon-led__dots card__corner-icon-led__dots--a" aria-hidden />
      <span className="card__corner-icon-led__dots card__corner-icon-led__dots--b" aria-hidden />
      <span className="card__corner-icon-led__scan" aria-hidden />
    </span>
  );
}
