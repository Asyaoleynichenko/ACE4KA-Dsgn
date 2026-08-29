import { hypothesisCardHeading } from '../i18n/projectFieldTranslate.js';
import { pillArrowReplace } from '../utils/pillArrowKeywords.js';

/**
 * Общий каркас всех кейсов: проблема → подход → гипотезы.
 * Якоря skipped-секций сохраняют spy-навигацию.
 */
export default function CaseStudyEditorialFrame({
  slug,
  editorial,
  skipped,
  ct,
  t,
  locale,
}) {
  const { contextText, approachItems, hypotheses } = editorial;
  const hypSkipped = skipped.find((s) => s.kind === 'hyp');
  const textSkipped = skipped.filter((s) => s.kind === 'text');

  if (!contextText && !approachItems.length && !hypotheses.length) return null;

  return (
    <>
      {contextText ? (
        <section className="section case-frame case-frame--problem" id={`case-${slug}-overview`}>
          {textSkipped.map(({ index }) => (
            <div key={index} className="case-study-subanchor" id={`case-${slug}-body-${index}`} aria-hidden="true" />
          ))}
          <article className="case-frame__card">
            <h2>
              <span className="text-condensed">{ct('problem')}</span>
            </h2>
            <p>{contextText}</p>
          </article>
        </section>
      ) : null}

      {approachItems.length ? (
        <section className="section case-frame case-frame--approach" id={`case-${slug}-approach`}>
          <h2>
            <span className="text-condensed">{ct('approach')}</span>
          </h2>
          <ul className="section__pills section__pills--approach" aria-label={ct('approach')}>
            {approachItems.map((line, j) => (
              <li key={j}>{pillArrowReplace(line)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {hypotheses.length ? (
        <section
          className="section case-frame case-frame--hypotheses"
          id={hypSkipped ? `case-${slug}-body-${hypSkipped.index}-hyp` : `case-${slug}-hypotheses`}
        >
          <ul className="hyp-list" aria-label={t('projectDetail.hypothesisStripAria')}>
            {hypotheses.map((h, j) => (
              <li key={j} className="hyp-list__item">
                <details className="hyp-list__row" open={j === 0}>
                  <summary className="hyp-list__summary">
                    <span className="hyp-list__title">
                      <span className="text-condensed text-condensed--single-line">
                        {hypothesisCardHeading(h, j, locale, t)}
                      </span>
                    </span>
                    <span className="hyp-list__icon" aria-hidden="true" />
                  </summary>
                  <div className="hyp-list__body">
                    <div className="hyp-list__body-inner">
                      <p className="hyp-list__text">{h.text}</p>
                      {h.outcome ? (
                        <span className="hyp-list__outcome">{pillArrowReplace(h.outcome)}</span>
                      ) : null}
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
