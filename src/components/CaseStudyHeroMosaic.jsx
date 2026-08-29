import { publicUrl } from '../utils/publicUrl.js';
import { setProjectHeroVtName } from '../utils/projectHeroViewTransition.js';

/** Обложка кейса: один кадр. */
export default function CaseStudyHeroMosaic({ images, slug, alt, placeholder }) {
  const src = images?.[0];
  if (!src) {
    return <div className="hero-placeholder">{placeholder}</div>;
  }

  return (
    <div className="hero__media" aria-label={alt}>
      <img
        ref={(el) => setProjectHeroVtName(el, slug)}
        src={publicUrl(src)}
        alt={alt}
        decoding="async"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}
