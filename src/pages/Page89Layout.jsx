import { useI18n } from '../i18n/I18nProvider.jsx';
import { resolveMessage } from '../i18n/resolveMessage.js';
import { publicUrl } from '../utils/publicUrl.js';

export default function Page89Layout({ figmaId }) {
  const { t, messages } = useI18n();
  const slug = figmaId.replace('-', '_');
  const page = resolveMessage(messages, `page89.${slug}`);

  const title = page?.title ?? t('draftPage.title', { id: figmaId });
  const subtitle = page?.subtitle ?? t('draftPage.subtitle', { id: figmaId });
  const cards = Array.isArray(page?.cards) ? page.cards : [];

  return (
    <div
      className={`page-${figmaId}__wrap layout-${figmaId} page89-wrap snap-screen`}
      data-node-id={figmaId}
    >
      <header className="page-header page89-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      <ul className="page89-grid" role="list">
        {cards.map((card, i) => {
          const mediaPath = card.image || card.icon;
          const mediaSrc =
            typeof mediaPath === 'string' ? publicUrl(mediaPath) : mediaPath;
          const isIconSlot = Boolean(card.icon && !card.image);

          return (
            <li key={i} className="page89-grid__item">
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
              <strong className="page89-grid__title">
                {card.title ?? t('draftPage.blockTitle', { n: i + 1 })}
              </strong>
              <p className="page89-grid__text">
                {card.text ?? t('draftPage.blockText')}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
