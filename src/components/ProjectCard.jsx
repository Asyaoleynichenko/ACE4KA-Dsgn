import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { publicUrl } from '../utils/publicUrl.js';
import { setProjectHeroVtName } from '../utils/projectHeroViewTransition.js';

export default function ProjectCard({ slug, title, meta, desc, image, video, isDemo, depthSpeed }) {
  const { localizedPath } = useI18n();
  const href = slug ? localizedPath(`/project/${slug}`) : localizedPath('/projects');
  const imageSrc = typeof image === 'string' ? publicUrl(image) : image;
  const videoSrc = typeof video === 'string' ? publicUrl(video) : null;

  return (
    <article
      className="preview-card parallax-depth"
      {...(depthSpeed != null ? { 'data-speed': String(depthSpeed) } : {})}
    >
      <Link to={href} className="preview-card__link">
        <div className="preview-image" data-float="1.3" data-float-range="28">
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={imageSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              ref={(el) => setProjectHeroVtName(el, slug)}
            />
          ) : image ? (
            <img
              src={imageSrc}
              alt=""
              loading="lazy"
              decoding="async"
              ref={(el) => setProjectHeroVtName(el, slug)}
            />
          ) : (
            <div className="preview-image__placeholder" />
          )}
        </div>
        <div className="preview-card__body">
          <h3 className="preview-card__title" data-float="0.65" data-float-range="12">
            {title}
          </h3>
          <p className="preview-card__meta" data-float="0.45" data-float-range="8">
            <span className="text-condensed">{meta}</span>
          </p>
          {desc && <p className="preview-card__desc">{desc}</p>}
        </div>
      </Link>
    </article>
  );
}
