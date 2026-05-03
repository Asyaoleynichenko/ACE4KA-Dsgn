import { Link } from 'react-router-dom';
import { publicUrl } from '../utils/publicUrl.js';

export default function ProjectCard({ slug, title, meta, desc, image, isDemo }) {
  const href = slug ? `/project/${slug}` : '/projects';
  const imageSrc = typeof image === 'string' ? publicUrl(image) : image;
  return (
    <article className="preview-card">
      <Link to={href} className="preview-card__link">
        <div className="preview-image">
          {image ? (
            <img src={imageSrc} alt="" />
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
