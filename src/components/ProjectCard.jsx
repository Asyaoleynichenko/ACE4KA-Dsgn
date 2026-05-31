import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { publicUrl } from '../utils/publicUrl.js';
import { setProjectHeroVtName } from '../utils/projectHeroViewTransition.js';
import { withViewTransition } from '../utils/withViewTransition.js';

export default function ProjectCard({ slug, title, meta, desc, image, video, isDemo, variant = 'default' }) {
  const { localizedPath } = useI18n();
  const navigate = useNavigate();
  const href = slug ? localizedPath(`/project/${slug}`) : localizedPath('/projects');
  const imageSrc = typeof image === 'string' ? publicUrl(image) : image;
  const videoSrc = typeof video === 'string' ? publicUrl(video) : null;

  /* Клик-навигация через View Transitions: hero-обложка карточки морфит в hero детальной страницы. */
  const handleNavigate = (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    withViewTransition(() => navigate(href));
  };

  const isOverlay = variant === 'overlay';
  const linkLabel = isOverlay ? [title, meta, desc].filter(Boolean).join('. ') : undefined;

  return (
    <article className={`preview-card${isOverlay ? ' preview-card--overlay' : ''}`}>
      <Link
        to={href}
        className="preview-card__link"
        onClick={handleNavigate}
        aria-label={linkLabel}
      >
        <div className="preview-image">
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
          <h3 className="preview-card__title">
            {title}
          </h3>
          <p className="preview-card__meta">
            <span className="text-condensed">{meta}</span>
          </p>
          {desc && <p className="preview-card__desc">{desc}</p>}
        </div>
      </Link>
    </article>
  );
}
