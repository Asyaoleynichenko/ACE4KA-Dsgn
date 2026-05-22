import { COMPETENCIES_HEADING_ORDER } from '../data/competenciesHeadingOrder.js';

/**
 * Главная — блок компетенций (Figma 592:38775 / 418:21263).
 * Статическая стопка из пяти строк типографики + CTA «Все проекты».
 */
export default function HomeCompetenciesScrub({ lines, ariaLabel, children }) {
  return (
    <div className="home-competencies-scrub home-competencies-scrub--static">
      <div className="home-competencies__panel">
        <div className="home-competencies__inner home-competencies__inner--stack">
          <div className="home-competencies__type" role="group" aria-label={ariaLabel}>
            {lines.map((line, i) => (
              <div
                key={line}
                className="home-competencies__line-wrap"
                data-heading={COMPETENCIES_HEADING_ORDER[i] ?? 3}
              >
                <p className="home-competencies__line">{line}</p>
              </div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
