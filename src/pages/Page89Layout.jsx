import { useI18n } from '../i18n/I18nProvider.jsx';
import { resolveMessage } from '../i18n/resolveMessage.js';
import { publicUrl } from '../utils/publicUrl.js';

export default function Page89Layout({ figmaId, messageKey }) {
  const { t, messages } = useI18n();
  const page = resolveMessage(messages, messageKey);
  const headingId = `${messageKey.replaceAll('.', '-')}-title`;

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
    <section
      className="page89-wrap snap-screen"
      data-node-id={figmaId}
      aria-labelledby={headingId}
    >
      <header className="page-header page89-header">
        <h1 id={headingId}>{title}</h1>
        <p>{subtitle}</p>
      </header>
      <ul className="page89-grid" role="list">
        {cards.map((card, i) => {
          const mediaPath = card.image || card.icon;
          const mediaSrc =
            typeof mediaPath === 'string' ? publicUrl(mediaPath) : mediaPath;
          const isIconSlot = Boolean(card.icon && !card.image);
          const cardTitle =
            typeof card.title === 'string'
              ? card.title
              : t('draftPage.blockTitle', { n: i + 1 });
          const cardText =
            typeof card.text === 'string'
              ? card.text
              : t('draftPage.blockText');

          return (
            <li key={`${messageKey}-${i}`} className="page89-grid__item">
              {mediaSrc ? (
                <div
                  className={
                    isIconSlot ? 'page89-grid__media page89-grid__media--icon' : 'page89-grid__media'
                  }
                >
                  <img
                    className="page89-grid__img"
                    src={mediaSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
              <strong className="page89-grid__title">{cardTitle}</strong>
              <p className="page89-grid__text">{cardText}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
