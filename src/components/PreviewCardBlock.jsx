import { publicUrl } from '../utils/publicUrl.js';

/** Figma 1:231 — Image Preview: 369×280, titlebar (leading: spacer, close, spacer, resize, spacer, title; trailing: spacer, CTA), image area */
export default function PreviewCardBlock() {
  return (
    <a
      href="https://t.me/pnkprty"
      target="_blank"
      rel="noopener noreferrer"
      className="preview-card-block"
      data-node-id="1:231"
    >
      <div className="preview-card-block__overlay preview-card-block__overlay--base" aria-hidden="true" />
      <div className="preview-card-block__overlay preview-card-block__overlay--blur" aria-hidden="true" />
      <div className="preview-card-block__titlebar" data-node-id="I1:231;204:10533">
        <div className="preview-card-block__leading" data-node-id="I1:231;103:8916">
          <span className="preview-card-block__spacer preview-card-block__spacer--12" aria-hidden="true" />
          <span className="preview-card-block__btn-close" aria-hidden="true" title="Закрыть">
            <img src={publicUrl('/images/preview-card-close.svg')} alt="" width="12" height="12" />
          </span>
          <span className="preview-card-block__spacer preview-card-block__spacer--8" aria-hidden="true" />
          <span className="preview-card-block__btn-resize" aria-hidden="true" title="Развернуть">
            <img src={publicUrl('/images/preview-card-resize.svg')} alt="" width="12" height="12" />
          </span>
          <span className="preview-card-block__spacer preview-card-block__spacer--8" aria-hidden="true" />
          <span className="preview-card-block__title" data-node-id="I1:231;153:9332">Привет!</span>
        </div>
        <div className="preview-card-block__trailing" data-node-id="I1:231;103:8929">
          <span className="preview-card-block__spacer preview-card-block__spacer--8" aria-hidden="true" />
          <span className="preview-card-block__cta" data-node-id="I1:231;153:9369">Написать в Telegram</span>
        </div>
      </div>
      <div className="preview-card-block__image" data-node-id="I1:231;103:8833">
        {/* Изображение по макету: inset 38px 5px 5px 5px */}
      </div>
    </a>
  );
}
