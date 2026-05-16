const STATUS_LABEL = {
  confirmed: 'ПОДТВЕРЖДЕНА',
  rejected: 'НЕ ПОДТВЕРЖДЕНА',
  iterated: 'ИТЕРАЦИЯ',
  pending: 'В РАБОТЕ',
};

export default function HypothesisTable({ items }) {
  if (!items?.length) return null;
  return (
    <div className="cs-hypotheses" role="table" aria-label="Гипотезы">
      {items.map((item, i) => {
        const status = item.status || 'pending';
        return (
          <div
            key={item.id || i}
            className="cs-hypotheses__row"
            data-status={status}
            role="row"
          >
            <div className="cs-hypotheses__index" role="cell">
              {item.id || `H${i + 1}`}
            </div>
            <div className="cs-hypotheses__body" role="cell">
              {item.subline ? (
                <div className="cs-hypotheses__subline">{item.subline}</div>
              ) : null}
              <p className="cs-hypotheses__statement">{item.statement}</p>
            </div>
            <div className="cs-hypotheses__meta" role="cell">
              <span className="cs-hypotheses__chip"><span className="text-condensed">{STATUS_LABEL[status] || status}</span></span>
              {item.result ? (
                <span className="cs-hypotheses__result"><span className="text-condensed">{item.result}</span></span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
