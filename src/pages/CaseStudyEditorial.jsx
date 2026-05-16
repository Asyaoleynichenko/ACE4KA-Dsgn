import HypothesisTable from '../components/HypothesisTable.jsx';
import ImpactMetrics from '../components/ImpactMetrics.jsx';
import TradeOff from '../components/TradeOff.jsx';
import DotIcon from '../components/DotIcon.jsx';

function Eyebrow({ children, icon = 'dot-bullet' }) {
  return (
    <div className="cs-eyebrow">
      <DotIcon name={icon} size={14} />
      <span className="text-condensed">{children}</span>
    </div>
  );
}

/**
 * Editorial case-study layout, applied only when project.caseStudyEditorial exists.
 * Uses the three reusable components (HypothesisTable / ImpactMetrics / TradeOff)
 * and section eyebrows / 01, / 02.N etc. Re-usable across cases.
 */
export default function CaseStudyEditorial({ project, title }) {
  const data = project.caseStudyEditorial;
  if (!data) return null;

  const {
    lead,
    meta,
    contextText,
    approachLabel,
    approachItems,
    hypotheses,
    experiments,
    finalPhrase,
    aggregate,
    role,
  } = data;

  return (
    <div
      className="case-study-editorial"
      data-node-id={project.figmaNodeId}
      data-figma-url={project.figmaUrl}
    >
      <header className="cs-header">
        <h1 className="cs-title">{title || project.title}</h1>
        {lead ? <p className="cs-lead">{lead}</p> : null}
        {meta?.length ? (
          <div className="cs-meta">
            {meta.map((item, i) => (
              <div key={i} className="cs-meta__cell">
                <div className="cs-meta__label">{item.label}</div>
                <div className="cs-meta__value">{item.value}</div>
              </div>
            ))}
          </div>
        ) : null}
      </header>

      {contextText || approachItems?.length ? (
        <section className="cs-section cs-section--first">
          <Eyebrow>Section 01 — Контекст и подход</Eyebrow>
          {contextText ? <p className="cs-prose">{contextText}</p> : null}
          {approachItems?.length ? (
            <blockquote className="cs-quote cs-quote--soft">
              {approachLabel ? (
                <Eyebrow icon="dot-list">{approachLabel}</Eyebrow>
              ) : null}
              <ol>
                {approachItems.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ol>
            </blockquote>
          ) : null}
        </section>
      ) : null}

      {hypotheses?.length ? (
        <section className="cs-section">
          <Eyebrow icon="dot-grid">Section 02 — Эксперименты</Eyebrow>
          <HypothesisTable items={hypotheses} />
        </section>
      ) : null}

      {experiments?.map((exp, i) => (
        <section key={exp.id || i} className="cs-section cs-experiment">
          <Eyebrow icon="dot-target">{`Section 02.${i + 1} — Эксперимент ${exp.id || `E${i + 1}`} развёрнуто`}</Eyebrow>
          <h2 className="cs-exp-title">{exp.title}</h2>

          {exp.context || exp.nuance ? (
            <div
              className={
                exp.nuance ? 'cs-context-grid' : 'cs-context-grid cs-context-grid--single'
              }
            >
              {exp.context ? (
                <div className="cs-context-grid__cell">
                  <div className="cs-context-grid__label">Контекст</div>
                  <p className="cs-context-grid__text">{exp.context}</p>
                </div>
              ) : null}
              {exp.nuance ? (
                <div className="cs-context-grid__cell">
                  <div className="cs-context-grid__label">Важный нюанс</div>
                  <p className="cs-context-grid__text">{exp.nuance}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {exp.hypothesis ? <blockquote className="cs-quote">{exp.hypothesis}</blockquote> : null}

          {exp.done || exp.traded ? <TradeOff done={exp.done} traded={exp.traded} /> : null}

          {exp.impact?.length ? <ImpactMetrics items={exp.impact} /> : null}
        </section>
      ))}

      {finalPhrase || aggregate?.length ? (
        <section className="cs-section">
          <Eyebrow icon="dot-arrow-right">Section 03 — Общий результат</Eyebrow>
          {finalPhrase ? <p className="cs-final-phrase">{finalPhrase}</p> : null}
          {aggregate?.length ? <ImpactMetrics items={aggregate} /> : null}
        </section>
      ) : null}

      {role?.length ? (
        <section className="cs-section">
          <Eyebrow icon="dot-letter-a">Section 04 — Моя роль</Eyebrow>
          <ul className="cs-role-list">
            {role.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
