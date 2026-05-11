import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { publicUrl } from '../utils/publicUrl.js';
import { setProjectHeroVtName } from '../utils/projectHeroViewTransition.js';

export default function ProjectCard({ slug, title, meta, desc, image, isDemo }) {
  const navigate = useNavigate();
  const { localizedPath } = useI18n();
  const href = slug ? localizedPath(`/project/${slug}`) : localizedPath('/projects');
  const imageSrc = typeof image === 'string' ? publicUrl(image) : image;

  const onClick = (e) => {
    if (!slug || stripLocaleFromPathname(href) === '/projects') return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function') return;

    e.preventDefault();
    document.startViewTransition(() => {
      navigate(href);
    });
  };

  return (
    <article className="preview-card">
      <Link to={href} className="preview-card__link" onClick={onClick}>
        <div className="preview-image">
          {image ? (
            <img
              src={imageSrc}
              alt=""
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
