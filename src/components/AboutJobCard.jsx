import AboutJobSticker from './AboutJobSticker.jsx';

function AboutJobBody({ job }) {
  return (
    <div className="about-job__body">
      {job.period ? (
        <p className="about-job__period">
          <span className="text-condensed">{job.period}</span>
        </p>
      ) : null}
      <h3 className="about-job__org"><span className="text-condensed">{job.org}</span></h3>
      <p className="about-job__title">{job.title}</p>
      {job.text ? (
        <>
          <hr className="about-job__divider" aria-hidden="true" />
          <p className="about-job__text">{job.text}</p>
        </>
      ) : null}
    </div>
  );
}

export default function AboutJobCard({ job, viewLabel, projectPath }) {
  if (!job.projectSlug) {
    return (
      <li className="about-job">
        <article className="about-job__sticker about-job__sticker--plain">
          <AboutJobBody job={job} />
        </article>
      </li>
    );
  }

  return (
    <li className="about-job">
      <AboutJobSticker
        peelLabel={viewLabel}
        projectPath={projectPath}
        ariaLabel={`${viewLabel} — ${job.org}`}
      >
        <AboutJobBody job={job} />
      </AboutJobSticker>
    </li>
  );
}
