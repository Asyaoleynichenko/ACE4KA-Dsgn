import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { publicUrl } from '../utils/publicUrl.js';
import AboutJobCard from '../components/AboutJobCard.jsx';

const ABOUT_FIGMA_URL =
  'https://www.figma.com/design/3p1Mnu6yIL6Y8CwebsdP1F/%D0%92-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=743-16866&m=dev';

const aboutLinks = [
  { href: 'https://t.me/pnkprty', labelKey: 'about.links.telegram' },
  { href: 'https://behance.net/', labelKey: 'about.links.behance' },
  { href: '/resume', labelKey: 'about.links.resume' },
  { href: 'mailto:hello@example.com', labelKey: 'about.links.email' },
  { href: 'https://pinterest.com/', labelKey: 'about.links.pinterest' },
];

const eduGridClass = {
  hse: 'about-page__edu-card--hse',
  gpa: 'about-page__edu-card--gpa',
  bbe: 'about-page__edu-card--bbe',
  ui: 'about-page__edu-card--ui',
  vk: 'about-page__edu-card--vk',
};

function AboutLinkRow({ localizedPath, t }) {
  return (
    <div className="about-page__links hero-links" data-node-id="743:17042">
      {aboutLinks.map(({ href, labelKey }, index) => {
        const label = t(labelKey);
        const linkEl = href.startsWith('/') ? (
          <Link key={href} to={localizedPath(href)}>
            <span className="text-condensed">{label}</span>
          </Link>
        ) : (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer">
            <span className="text-condensed">{label}</span>
          </a>
        );

        if (index === 0) return linkEl;

        return (
          <span key={`wrap-${href}`} className="hero-links__item">
            <span className="hero-links__sep" aria-hidden="true" />
            {linkEl}
          </span>
        );
      })}
    </div>
  );
}

export default function AboutPage() {
  const { t, localizedPath, messages } = useI18n();
  const jobs = messages.about?.jobs ?? [];
  const skills = messages.about?.skills?.items ?? [];
  const eduItems = messages.about?.eduItems ?? [];
  const profilePhoto = messages.about?.profilePhoto ?? '/images/figma-743-16866/profile.png';

  return (
    <div
      className="about-page"
      data-node-id="743:16866"
      data-name="Background"
      data-figma-url={ABOUT_FIGMA_URL}
    >
      <header className="about-page__hero" id="intro" data-node-id="743:17054">
        <div className="about-page__photo-wrap" data-node-id="743:16931">
          <img
            className="about-page__photo"
            src={publicUrl(profilePhoto)}
            alt=""
            width={449}
            height={449}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="about-page__hero-copy" data-node-id="743:16917">
          <h1 className="about-page__name" data-node-id="743:16919">
            {t('about.intro.name')}
          </h1>
          <p className="about-page__lead" data-node-id="743:16921">
            {t('about.intro.lead')}
          </p>
          <AboutLinkRow localizedPath={localizedPath} t={t} />
        </div>
      </header>

      <div className="about-page__duo" data-node-id="743:17053">
        <section
          className="about-page__panel about-page__panel--skills"
          id="skills"
          aria-labelledby="about-skills-heading"
          data-node-id="743:16907"
        >
          <h2 className="about-page__section-heading" id="about-skills-heading" data-node-id="743:16909">
            {t('about.skills.title')}
          </h2>
          <ul className="about-page__skill-list hyp-list" data-node-id="337:24764">
            {skills.map((skill, index) => (
              <li key={skill.title} className="hyp-list__item">
                <details className="hyp-list__row" data-node-id="743:16911" open={index === 0}>
                  <summary className="hyp-list__summary">
                    <span className="hyp-list__title">{skill.title}</span>
                    <span className="hyp-list__icon" aria-hidden="true" />
                  </summary>
                  <div className="hyp-list__body">
                    <div className="hyp-list__body-inner">
                      <p className="hyp-list__text">{skill.description}</p>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="about-page__panel about-page__panel--experience"
          id="experience"
          aria-labelledby="about-exp-heading"
          data-node-id="743:16900"
        >
          <h2 className="about-page__section-heading" id="about-exp-heading" data-node-id="743:16902">
            {t('about.experience.title')}
          </h2>
          <ul className="about-page__job-list">
            {jobs.map((job) => (
              <AboutJobCard
                key={job.org + job.period}
                job={job}
                viewLabel={t('about.experience.viewLabel')}
                projectPath={localizedPath(`/project/${job.projectSlug}`)}
              />
            ))}
          </ul>
        </section>
      </div>

      <section
        className="about-page__section about-page__section--education"
        id="education"
        aria-labelledby="about-edu-heading"
        data-node-id="743:16867"
      >
        <h2 className="about-page__section-heading" id="about-edu-heading" data-node-id="743:16869">
          {t('about.education.title')}
        </h2>
        <ul className="about-page__edu-bento">
          {eduItems.map((item) => {
            if (item.variant === 'gpa') {
              return (
                <li
                  key="gpa"
                  className={`about-page__edu-card about-page__edu-card--gpa ${eduGridClass[item.grid] ?? ''}`.trim()}
                >
                  <p className="about-page__edu-score">{item.score}</p>
                  <p className="about-page__edu-score-label">
                    <span className="text-condensed">{item.line}</span>
                  </p>
                </li>
              );
            }

            return (
              <li
                key={item.school + item.years}
                className={`about-page__edu-card ${eduGridClass[item.grid] ?? ''}`.trim()}
              >
                <p className="about-page__edu-years">
                  <span className="text-condensed">{item.years}</span>
                </p>
                <h3 className="about-page__edu-school">{item.school}</h3>
                {item.line ? (
                  <p className="about-page__edu-line">
                    <span className="text-condensed">{item.line}</span>
                  </p>
                ) : null}
                {item.detail ? <p className="about-page__edu-detail">{item.detail}</p> : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
