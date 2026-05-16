export default function TradeOff({ done, traded }) {
  const isDoneArray = Array.isArray(done);
  return (
    <div className="cs-tradeoff">
      <div className="cs-tradeoff__col">
        <div className="cs-tradeoff__label"><span className="text-condensed">ЧТО СДЕЛАНО</span></div>
        {isDoneArray ? (
          <ul className="cs-tradeoff__list">
            {done.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="cs-tradeoff__text">{done}</p>
        )}
      </div>
      <div className="cs-tradeoff__col">
        <div className="cs-tradeoff__label"><span className="text-condensed">TRADE-OFF</span></div>
        <p className="cs-tradeoff__text">{traded}</p>
      </div>
    </div>
  );
}
