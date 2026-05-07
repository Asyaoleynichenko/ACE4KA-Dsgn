import { publicUrl } from '../utils/publicUrl.js';

const FIGMA_PREVIEW_URL =
  'https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=1-231&m=dev';

/** Figma MCP — `public/images/preview-card-close.svg` / `preview-card-resize.svg`, node 1:231 */
const ICON_CLOSE_D =
  'M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM8.93262 3.06738C8.60314 2.7379 8.05376 2.74201 7.7373 3.05371L6.00098 4.78516L4.26074 3.0498C3.96194 2.751 3.39064 2.73298 3.06543 3.0625C2.74023 3.3877 2.75391 3.95898 3.05273 4.25781L4.79297 5.99414L3.05273 7.73828C2.75391 8.03711 2.74023 8.60449 3.06543 8.92969C3.39063 9.25927 3.96192 9.2456 4.26074 8.94238L6.00098 7.20215L7.7373 8.93848C8.05375 9.25463 8.60311 9.25431 8.93262 8.9248C9.2575 8.59957 9.25722 8.05068 8.94531 7.73438L7.20996 5.99414L8.94531 4.2627C9.25724 3.94637 9.25756 3.39261 8.93262 3.06738Z';

const ICON_RESIZE_D =
  'M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM3.85352 5.26758C3.53857 4.95279 3.00015 5.17583 3 5.62109V8C3 8.55217 3.44788 8.99981 4 9H6.37793C6.82332 8.99993 7.04635 8.46146 6.73145 8.14648L3.85352 5.26758ZM5.62012 3C5.17499 3.00029 4.95197 3.53861 5.2666 3.85352L8.14648 6.73145C8.46147 7.0463 8.99993 6.82329 9 6.37793V4C8.99981 3.44788 8.55217 3 8 3H5.62012Z';

function TitlebarIconClose() {
  return (
    <svg
      className="preview-card-block__icon"
      viewBox="0 0 12 12"
      width={12}
      height={12}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <g style={{ mixBlendMode: 'plus-darker' }}>
        <path d={ICON_CLOSE_D} fill="#000000" fillOpacity={0.5} />
      </g>
    </svg>
  );
}

function TitlebarIconResize() {
  return (
    <svg
      className="preview-card-block__icon"
      viewBox="0 0 12 12"
      width={12}
      height={12}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <g style={{ mixBlendMode: 'plus-darker' }}>
        <path d={ICON_RESIZE_D} fill="#000000" fillOpacity={0.5} />
      </g>
    </svg>
  );
}

/** Figma 1:231 — Image Preview: titlebar = chrome (иконки) + «Привет!» + CTA; иконки — inline SVG (blend на titlebar) */
export default function PreviewCardBlock() {
  const previewImageSrc = publicUrl('/images/figma-impl-89-347/e621b7d38edf9d65d35f29d2ceb01c700a03de6f.png');

  return (
    <a
      href="https://t.me/pnkprty"
      target="_blank"
      rel="noopener noreferrer"
      className="preview-card-block"
      data-node-id="1:231"
      data-figma-url={FIGMA_PREVIEW_URL}
      aria-label="Написать в Telegram @pnkprty"
    >
      <div className="preview-card-block__overlay preview-card-block__overlay--base" aria-hidden="true" />
      <div className="preview-card-block__overlay preview-card-block__overlay--blur" aria-hidden="true" />
      <div className="preview-card-block__titlebar" data-node-id="I1:231;204:10533">
        <div className="preview-card-block__leading" data-node-id="I1:231;103:8916">
          <div className="preview-card-block__chrome-controls" aria-hidden="true">
            <span className="preview-card-block__spacer preview-card-block__spacer--12" />
            <span className="preview-card-block__btn-close" title="Закрыть">
              <TitlebarIconClose />
            </span>
            <span className="preview-card-block__spacer preview-card-block__spacer--8" />
            <span className="preview-card-block__btn-resize" title="Развернуть">
              <TitlebarIconResize />
            </span>
            <span className="preview-card-block__spacer preview-card-block__spacer--8" />
          </div>
          <span className="preview-card-block__title" data-node-id="I1:231;153:9332">
            Привет!
          </span>
        </div>
        <div className="preview-card-block__trailing" data-node-id="I1:231;103:8929">
          <span className="preview-card-block__spacer preview-card-block__spacer--8" aria-hidden="true" />
          <span className="preview-card-block__cta" data-node-id="I1:231;153:9369">
            Написать мне @pnkprty
          </span>
        </div>
      </div>
      <div className="preview-card-block__image" data-node-id="I1:231;103:8833">
        <img src={previewImageSrc} alt="" />
      </div>
    </a>
  );
}
