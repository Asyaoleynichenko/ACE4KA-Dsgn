import { publicUrl } from '../utils/publicUrl.js';
import { useI18n } from '../i18n/I18nProvider.jsx';

/** Image Preview на главной — Figma 416:13005 (369×280) */
const FIGMA_PREVIEW_URL =
  'https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=416-13005&m=dev';

/** Декоративные traffic lights как в macOS (вся карточка — одна ссылка). */
function MacTrafficLights({ t }) {
  return (
    <div className="preview-card-block__traffic" aria-hidden="true">
      <span className="preview-card-block__traffic-dot preview-card-block__traffic-dot--close" title={t('previewCard.trafficClose')} />
      <span className="preview-card-block__traffic-dot preview-card-block__traffic-dot--minimize" title={t('previewCard.trafficMinimize')} />
      <span className="preview-card-block__traffic-dot preview-card-block__traffic-dot--zoom" title={t('previewCard.trafficZoom')} />
    </div>
  );
}

/** Image Preview по макету Figma 416:13005: светофоры, заголовок, CTA, аватар, превью */
export default function PreviewCardBlock() {
  const { t, messages } = useI18n();
  const previewImageSrc = publicUrl('/images/figma-416-12975/preview-photo.png');
  const avatarSrc = publicUrl(messages.about?.profilePhoto ?? '/images/figma-743-16866/profile.webp');

  return (
    <a
      href="https://t.me/pnkprty"
      target="_blank"
      rel="noopener noreferrer"
      className="preview-card-block preview-card-block--mac-window"
      data-node-id="416-13005"
      data-figma-url={FIGMA_PREVIEW_URL}
      aria-label={t('previewCard.aria')}
      data-float="1.2"
      data-float-range="24"
    >
      <div className="preview-card-block__overlay preview-card-block__overlay--base" aria-hidden="true" />
      <div className="preview-card-block__overlay preview-card-block__overlay--blur" aria-hidden="true" />
      <div className="preview-card-block__titlebar" data-node-id="I861:16906;204:10533">
        <div className="preview-card-block__titlebar-start" data-node-id="I861:16906;103:8916">
          <MacTrafficLights t={t} />
        </div>
        <span className="preview-card-block__title" data-node-id="I861:16906;153:9332">
          {t('previewCard.title')}
        </span>
        <div className="preview-card-block__trailing" data-node-id="I861:16906;103:8929">
          <span className="preview-card-block__cta" data-node-id="I861:16906;153:9369">
            {t('previewCard.cta')}
          </span>
          <span className="preview-card-block__avatar" aria-hidden="true">
            <img src={avatarSrc} alt="" decoding="async" />
          </span>
        </div>
      </div>
      <div className="preview-card-block__image" data-node-id="I861:16906;103:8833">
        <img src={previewImageSrc} alt="" decoding="async" fetchPriority="high" />
      </div>
    </a>
  );
}
