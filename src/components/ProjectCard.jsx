import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { publicUrl } from '../utils/publicUrl.js';
import { setProjectHeroVtName } from '../utils/projectHeroViewTransition.js';

export default function ProjectCard({ slug, title, meta, desc, image, isDemo }) {
  const { localizedPath } = useI18n();
  const href = slug ? localizedPath(`/project/${slug}`) : localizedPath('/projects');
  const imageSrc = typeof image === 'string' ? publicUrl(image) : image;

  return (
    <article className="preview-card">
      <Link to={href} className="preview-card__link">
        <div className="preview-image">
          {image ? (
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
          <h3 className="preview-card__title">{title}</h3>
          <p className="preview-card__meta">{meta}</p>
          {desc && <p className="preview-card__desc">{desc}</p>}
        </div>
      </Link>
    </article>
  );
}
