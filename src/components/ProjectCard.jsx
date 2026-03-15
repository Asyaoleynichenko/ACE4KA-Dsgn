import { Link } from 'react-router-dom';

export default function ProjectCard({ slug, title, meta, desc, image, isDemo }) {
  const href = slug ? `/project/${slug}` : '/projects';
  return (
    <article className="preview-card" data-node-id="1-361">
      <Link to={href} className="preview-card__link">
        <div className="preview-image" data-node-id="1-362">
          {image ? (
            <img src={image} alt="" />
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
