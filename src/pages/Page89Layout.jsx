import { useI18n } from '../i18n/I18nProvider.jsx';
import { resolveMessage } from '../i18n/resolveMessage.js';

const LAYOUT_BY_FIGMA = {
  '89-811': { wrap: 'page-89-811__wrap', layout: 'layout-89-811' },
  '89-772': { wrap: 'page-89-772__wrap', layout: 'layout-89-772' },
  '89-909': { wrap: 'page-89-909__wrap', layout: 'layout-89-909' },
  '89-915': { wrap: 'page-89-915__wrap', layout: 'layout-89-915' },
  '89-920': { wrap: 'page-89-920__wrap', layout: 'layout-89-920' },
};

export default function Page89Layout({ figmaId, messageKey }) {
  const { t, messages } = useI18n();
  const page = resolveMessage(messages, messageKey);
  const headingId = `${messageKey.replaceAll('.', '-')}-title`;
  const shell = LAYOUT_BY_FIGMA[figmaId] ?? {
    wrap: `page-${figmaId}__wrap`,
    layout: `layout-${figmaId}`,
  };

  const title =
    typeof page?.title === 'string'
      ? page.title
      : t('draftPage.title', { id: figmaId });
  const subtitle =
    typeof page?.subtitle === 'string'
      ? page.subtitle
      : t('draftPage.subtitle', { id: figmaId });
  const cards = Array.isArray(page?.cards) ? page.cards : [];

  return (
    <div
      className={`${shell.wrap} ${shell.layout} snap-screen`.trim()}
      data-node-id={figmaId}
      aria-labelledby={headingId}
    >
      <header className="page-header">
        <h1 id={headingId}>{title}</h1>
        <p>{subtitle}</p>
      </header>

      <div className="contact-grid">
        {cards.map((card, i) => {
          const cardTitle =
            typeof card.title === 'string'
              ? card.title
              : t('draftPage.blockTitle', { n: i + 1 });
          const cardText =
            typeof card.text === 'string'
              ? card.text
              : t('draftPage.blockText');

          return (
            <div key={`${messageKey}-${i}`} className="contact-item contact-item--text">
              <div>
                <strong>
                  <span className="text-condensed">{cardTitle}</span>
                </strong>
                <p>{cardText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
