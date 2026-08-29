import { publicUrl } from '../utils/publicUrl.js';
import { setProjectHeroVtName } from '../utils/projectHeroViewTransition.js';

/** Обложка кейса: один кадр или коллаж из 2–4 кадров. */
export default function CaseStudyHeroMosaic({ images, slug, alt, placeholder }) {
  if (!images?.length) {
    return <div className="hero-placeholder">{placeholder}</div>;
  }

  if (images.length === 1) {
    return (
      <div className="hero__media" aria-label={alt}>
        <img
          ref={(el) => setProjectHeroVtName(el, slug)}
          src={publicUrl(images[0])}
          alt={alt}
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    );
  }

  return (
    <div className="hero__media hero__media--mosaic" data-count={images.length} aria-label={alt}>
      {images.map((src, i) => (
        <img
          key={src}
          ref={i === 0 ? (el) => setProjectHeroVtName(el, slug) : undefined}
          src={publicUrl(src)}
          alt=""
          decoding="async"
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : undefined}
        />
      ))}
    </div>
  );
}
