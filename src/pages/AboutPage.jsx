import { useMemo } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SideScrollspyNav from '../components/SideScrollspyNav.jsx';

export default function AboutPage() {
  const { t, messages } = useI18n();
  const jobs = messages.about?.jobs ?? [];
  const skills = messages.about?.skills?.items ?? [];
  const eduItems = messages.about?.eduItems ?? [];

  const spyItems = useMemo(
    () => [
      { id: 'intro', label: t('about.spyNav.intro'), level: 1 },
      { id: 'experience', label: t('about.spyNav.experience'), level: 1 },
      { id: 'education', label: t('about.spyNav.education'), level: 1 },
      { id: 'team', label: t('about.spyNav.team'), level: 2 },
      { id: 'habitat', label: t('about.spyNav.habitat'), level: 2 },
      { id: 'memes', label: t('about.spyNav.memes'), level: 2 },
    ],
    [t],
  );

  return (
    <div className="about-page" data-node-id="140:12528" data-name="Background">
      <SideScrollspyNav items={spyItems} ariaLabel={t('about.spyNav.aria')} />
      <header className="about-page__intro snap-screen" id="intro">
        <h1 className="about-page__name">{t('about.intro.name')}</h1>
        <div className="about-page__lead">
          <p>{t('about.intro.lead1')}</p>
          <p>{t('about.intro.lead2')}</p>
        </div>
      </header>

      <div className="about-page__grid snap-screen" id="experience">
        <section className="about-page__panel about-page__panel--experience" aria-labelledby="about-exp-heading">
          <h2 className="about-page__panel-title" id="about-exp-heading">
            {t('about.experience.title')}
          </h2>
          <ul className="about-page__card-list">
            {jobs.map((job) => (
              <li key={job.org + job.period} className="about-page__job-card">
                <p className="about-page__job-period">{job.period}</p>
                <h3 className="about-page__job-title">{job.title}</h3>
                <p className="about-page__job-org">{job.org}</p>
                <p className="about-page__job-text">{job.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-page__panel about-page__panel--skills" aria-labelledby="about-skills-heading">
          <h2 className="about-page__panel-title" id="about-skills-heading">
            {t('about.skills.title')}
          </h2>
          <ul className="about-page__skills">
            {skills.map((s) => (
              <li key={s} className="about-page__skill-pill">
                {s}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="about-page__section snap-screen" id="education" aria-labelledby="about-edu-heading">
        <h2 className="about-page__section-title" id="about-edu-heading">
          {t('about.education.title')}
        </h2>
        <ul className="about-page__edu-grid">
          {eduItems.map((e) => (
            <li key={e.school + e.years} className="about-page__edu-card">
              <p className="about-page__edu-years">{e.years}</p>
              <h3 className="about-page__edu-school">{e.school}</h3>
              <p className="about-page__edu-line">{e.line}</p>
              <p className="about-page__edu-detail">{e.detail}</p>
              {e.extra ? <p className="about-page__edu-extra">{e.extra}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="about-page__section about-page__section--compact snap-screen" id="team" aria-labelledby="about-team-heading">
        <h2 className="about-page__section-title" id="about-team-heading">
          {t('about.team.title')}
        </h2>
        <p className="about-page__muted">{t('about.team.body')}</p>
      </section>

      <section
        className="about-page__section about-page__section--compact snap-screen"
        id="habitat"
        aria-labelledby="about-habitat-heading"
      >
        <h2 className="about-page__section-title" id="about-habitat-heading">
          {t('about.habitat.title')}
        </h2>
        <p className="about-page__muted">{t('about.habitat.body')}</p>
      </section>

      <section className="about-page__section about-page__section--compact snap-screen" id="memes" aria-labelledby="about-memes-heading">
        <h2 className="about-page__section-title" id="about-memes-heading">
          {t('about.memes.title')}
        </h2>
        <p className="about-page__muted">{t('about.memes.body')}</p>
      </section>
    </div>
  );
}
