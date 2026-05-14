const ARROW = {
  up: '↗',
  down: '↘',
  flat: '→',
};

export default function ImpactMetrics({ items }) {
  if (!items?.length) return null;
  const cols = items.length;
  return (
    <div
      className="cs-impact"
      style={{ '--cs-impact-cols': cols }}
      role="list"
      aria-label="Impact metrics"
    >
      {items.map((item, i) => {
        const direction = item.direction || 'flat';
        return (
          <div key={i} className="cs-impact__cell" data-direction={direction} role="listitem">
            <div className="cs-impact__top">
              <span className="cs-impact__label">{item.label}</span>
              <span className="cs-impact__arrow" aria-hidden="true">
                {ARROW[direction] || ARROW.flat}
              </span>
            </div>
            <div className="cs-impact__value">{item.value}</div>
            {item.note ? <p className="cs-impact__note">{item.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
