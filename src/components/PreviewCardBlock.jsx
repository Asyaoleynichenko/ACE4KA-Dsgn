import { publicUrl } from '../utils/publicUrl.js';
import { useI18n } from '../i18n/I18nProvider.jsx';

const FIGMA_PREVIEW_URL =
  'https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-231&m=dev';

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

/** Figma 1:231 — окно в стиле macOS: titlebar, светофоры, контент на всю ширину */
export default function PreviewCardBlock() {
  const { t } = useI18n();
  const previewImageSrc = publicUrl('/images/figma-impl-89-347/e621b7d38edf9d65d35f29d2ceb01c700a03de6f.png');

  return (
    <a
      href="https://t.me/pnkprty"
      target="_blank"
      rel="noopener noreferrer"
      className="preview-card-block preview-card-block--mac-window"
      data-node-id="1:231"
      data-figma-url={FIGMA_PREVIEW_URL}
      aria-label={t('previewCard.aria')}
    >
      <div className="preview-card-block__overlay preview-card-block__overlay--base" aria-hidden="true" />
      <div className="preview-card-block__overlay preview-card-block__overlay--blur" aria-hidden="true" />
      <div className="preview-card-block__titlebar" data-node-id="I1:231;204:10533">
        <div className="preview-card-block__titlebar-start" data-node-id="I1:231;103:8916">
          <MacTrafficLights t={t} />
        </div>
        <span className="preview-card-block__title" data-node-id="I1:231;153:9332">
          {t('previewCard.title')}
        </span>
        <div className="preview-card-block__trailing" data-node-id="I1:231;103:8929">
          <span className="preview-card-block__cta" data-node-id="I1:231;153:9369">
            {t('previewCard.cta')}
          </span>
        </div>
      </div>
      <div className="preview-card-block__image" data-node-id="I1:231;103:8833">
        <img src={previewImageSrc} alt="" />
      </div>
    </a>
  );
}
